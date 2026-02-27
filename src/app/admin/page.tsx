import { getAdminStats } from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";
import { getActivityLogs } from "./actions";
import ActivityLogs from "./ActivityLogs";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  const logs = await getActivityLogs();

  return (
    <div className="space-y-8">
      <AdminDashboardClient stats={stats} />
      <div className="mt-12">
        <ActivityLogs logs={logs} />
      </div>
    </div>
  );
}
