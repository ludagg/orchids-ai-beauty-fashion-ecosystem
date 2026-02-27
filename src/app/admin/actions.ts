"use server";

import { db } from "@/lib/db";
import { users, salons, orders, activityLogs } from "@/db/schema";
import { eq, desc, count, sum, and, or, ilike, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

async function logActivity(adminId: string, action: string, targetId: string, targetType: string, details?: any) {
  await db.insert(activityLogs).values({
    id: nanoid(),
    adminId,
    action,
    targetId,
    targetType,
    details,
  });
}

export async function getAdminStats() {
  await checkAdmin();

  const [userResult] = await db.select({ value: count() }).from(users);
  const [salonResult] = await db.select({ value: count() }).from(salons);
  const [pendingSalonResult] = await db.select({ value: count() }).from(salons).where(eq(salons.status, "pending"));

  // Revenue: Sum of totalAmount where status is paid-like
  const paidStatuses = ["paid", "processing", "ready_for_pickup", "shipped", "delivered", "completed"];

  const [revenueResult] = await db
    .select({ value: sum(orders.totalAmount) })
    .from(orders)
    .where(inArray(orders.status, paidStatuses as any));

  const recentTransactions = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 5,
    with: {
      user: true,
    },
  });

  return {
    totalUsers: userResult.value,
    totalSalons: salonResult.value,
    pendingSalons: pendingSalonResult.value,
    totalRevenue: revenueResult.value ? Number(revenueResult.value) / 100 : 0, // Convert cents to currency
    recentTransactions,
  };
}

export async function getUsers(page = 1, search = "", role = "") {
  await checkAdmin();
  const limit = 10;
  const offset = (page - 1) * limit;

  const filters = [];
  if (search) {
    filters.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)));
  }
  if (role && role !== "All Roles") {
    filters.push(eq(users.role, role.toLowerCase() as any));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const data = await db.query.users.findMany({
    where,
    limit,
    offset,
    orderBy: [desc(users.createdAt)],
  });

  const [totalResult] = await db.select({ value: count() }).from(users).where(where);

  return {
    data,
    total: totalResult.value,
    totalPages: Math.ceil(totalResult.value / limit),
  };
}

export async function toggleUserSuspension(userId: string) {
  const session = await checkAdmin();
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) throw new Error("User not found");

  await db.update(users)
    .set({ isSuspended: !user.isSuspended })
    .where(eq(users.id, userId));

  await logActivity(session.user.id, user.isSuspended ? 'activate_user' : 'suspend_user', userId, 'user');

  return { success: true };
}

export async function getSalons(page = 1, search = "", status = "") {
  await checkAdmin();
  const limit = 10;
  const offset = (page - 1) * limit;

  const filters = [];
  if (search) {
    filters.push(ilike(salons.name, `%${search}%`));
  }
  if (status && status !== "All Status") {
    filters.push(eq(salons.status, status.toLowerCase() as any));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const data = await db.query.salons.findMany({
    where,
    limit,
    offset,
    with: {
      owner: true,
    },
    orderBy: [desc(salons.createdAt)],
  });

  const [totalResult] = await db.select({ value: count() }).from(salons).where(where);

  return {
    data,
    total: totalResult.value,
    totalPages: Math.ceil(totalResult.value / limit),
  };
}

export async function approveSalon(salonId: string) {
  const session = await checkAdmin();
  await db.update(salons)
    .set({ status: 'active', isVerified: true })
    .where(eq(salons.id, salonId));

  await logActivity(session.user.id, 'approve_salon', salonId, 'salon');
  return { success: true };
}

export async function rejectSalon(salonId: string) {
  const session = await checkAdmin();
  // Using 'rejected' if enum supports it, otherwise 'suspended' or delete pending
  // The schema usually has 'active' | 'pending' | 'suspended'. Let's check schema first.
  // Assuming 'rejected' is valid or we use 'suspended' as proxy for now.
  // Based on previous code, 'rejected' was cast as any, implying it might not be in enum.
  // Let's stick to 'suspended' if 'rejected' fails, but for now we'll set it to 'suspended'
  // with a note or just use 'suspended' to be safe with strict enums.
  // However, for a proper "Reject" flow, we might want to delete the pending salon or mark as suspended.

  await db.update(salons)
    .set({ status: 'suspended' })
    .where(eq(salons.id, salonId));

  await logActivity(session.user.id, 'reject_salon', salonId, 'salon');

  return { success: true };
}

export async function activateSalon(salonId: string) {
    const session = await checkAdmin();
    await db.update(salons)
      .set({ status: 'active' })
      .where(eq(salons.id, salonId));
    await logActivity(session.user.id, 'activate_salon', salonId, 'salon');
    return { success: true };
}

export async function suspendSalon(salonId: string) {
  const session = await checkAdmin();
  await db.update(salons)
    .set({ status: 'suspended' })
    .where(eq(salons.id, salonId));
  await logActivity(session.user.id, 'suspend_salon', salonId, 'salon');
  return { success: true };
}

export async function getSalon(salonId: string) {
  await checkAdmin();
  const salon = await db.query.salons.findFirst({
    where: eq(salons.id, salonId),
    with: {
      owner: true,
      images: true,
    }
  });
  return salon;
}

export async function getOrders(page = 1, status = "") {
    await checkAdmin();
    const limit = 20;
    const offset = (page - 1) * limit;

    let where = undefined;
    if (status && status !== "All Status") {
        where = eq(orders.status, status as any);
    }

    const data = await db.query.orders.findMany({
        where,
        limit,
        offset,
        with: {
            user: true,
            items: {
                with: {
                    product: true
                }
            }
        },
        orderBy: [desc(orders.createdAt)]
    });

    const [totalResult] = await db.select({ value: count() }).from(orders).where(where);

    return {
        data,
        total: totalResult.value,
        totalPages: Math.ceil(totalResult.value / limit)
    };
}

export async function updateOrderStatus(orderId: string, status: string) {
    const session = await checkAdmin();

    await db.update(orders)
        .set({ status: status as any })
        .where(eq(orders.id, orderId));

    await logActivity(session.user.id, `update_order_status_${status}`, orderId, 'order');

    revalidatePath('/admin/marketplace');
    revalidatePath('/admin/payments');

    return { success: true };
}

export async function getActivityLogs(limit = 20) {
    await checkAdmin();
    const logs = await db.query.activityLogs.findMany({
        orderBy: [desc(activityLogs.createdAt)],
        limit,
        with: {
             // Assuming no relations defined yet, but adminId is foreign key
        }
    });

    // Manual join for admin info if relation not in schema
    // Or just return logs. adminId is there.
    // For now, let's fetch user info separately or rely on client fetching if needed,
    // but better to add relations in schema if we want admin names.
    // I'll just return raw logs for now, maybe with adminName if I can join.

    return logs;
}
