import { getSalon } from "@/app/admin/actions";
import { notFound } from "next/navigation";
import AdminSalonDetailClient from "./AdminSalonDetailClient";

export default async function AdminSalonDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const salon = await getSalon(id);

  if (!salon) {
    notFound();
  }

  return <AdminSalonDetailClient salon={salon as any} />;
}
