import { getSalons } from "../actions";
import AdminSalonsClient from "./AdminSalonsClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function AdminSalonsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const status = params.status || "";

  const data = await getSalons(page, search, status);

  return <AdminSalonsClient data={data} />;
}
