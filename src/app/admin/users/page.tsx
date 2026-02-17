import { getUsers } from "../actions";
import AdminUsersClient from "./AdminUsersClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const role = params.role || "";

  const data = await getUsers(page, search, role);

  return <AdminUsersClient data={data} />;
}
