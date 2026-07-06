import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { LoyaltyEngine } from "@/lib/loyalty";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { referralCode: true, name: true, referredById: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let referralCode = user.referralCode;

        if (!referralCode) {
            // Generate a new code: First 3 letters of name + random string
            const prefix = user.name ? user.name.substring(0, 3).toUpperCase() : 'USR';
            referralCode = `${prefix}-${nanoid(6).toUpperCase()}`;

            await db.update(users)
                .set({ referralCode })
                .where(eq(users.id, userId));
        }

        // Count successful referrals
        const referredUsers = await db.select({ count: sql<number>`cast(count(*) as integer)` })
            .from(users)
            .where(eq(users.referredById, userId));

        const referralCount = referredUsers[0]?.count || 0;

        return NextResponse.json({
            referralCode,
            referralCount,
            hasReferredBy: !!user.referredById
        });

    } catch (error) {
        console.error("Error in GET referral:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { code } = body;

        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
        }

        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { referredById: true, referralCode: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (currentUser.referredById) {
            return NextResponse.json({ error: "You have already applied a referral code" }, { status: 400 });
        }

        if (currentUser.referralCode === code) {
            return NextResponse.json({ error: "You cannot apply your own referral code" }, { status: 400 });
        }

        const referrer = await db.query.users.findFirst({
            where: eq(users.referralCode, code),
            columns: { id: true, name: true }
        });

        if (!referrer) {
            return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
        }

        // Apply referral code
        await db.update(users)
            .set({ referredById: referrer.id })
            .where(eq(users.id, userId));

        // Award points
        // Award to referrer
        await LoyaltyEngine.addPoints(
            referrer.id,
            500,
            'referral_bonus',
            `Referred user ${session.user.name || 'someone'}`,
            userId // use new user id as reference
        );

        // Award to referee (new user)
        await LoyaltyEngine.addPoints(
            userId,
            200,
            'referral_bonus',
            `Used referral code from ${referrer.name || 'a friend'}`,
            referrer.id
        );

        return NextResponse.json({ success: true, message: "Referral code applied successfully" });

    } catch (error) {
        console.error("Error in POST referral:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
