import { getOrders } from "../actions";
import AdminPaymentsClient from "./AdminPaymentsClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  // Ideally show all financial transactions.
  // For now, filtering strictly by 'paid' status.
  const data = await getOrders(page, "paid");

  return <AdminPaymentsClient data={data} />;
}
