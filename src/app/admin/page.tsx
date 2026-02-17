import { getAdminStats } from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return <AdminDashboardClient stats={stats} />;
}
