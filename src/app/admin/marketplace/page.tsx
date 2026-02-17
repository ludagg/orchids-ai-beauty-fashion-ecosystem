import { getOrders } from "../actions";
import AdminMarketplaceClient from "./AdminMarketplaceClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function AdminMarketplacePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status || "";

  const data = await getOrders(page, status);

  return <AdminMarketplaceClient data={data} />;
}
