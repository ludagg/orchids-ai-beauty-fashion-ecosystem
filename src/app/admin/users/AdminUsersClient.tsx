"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Download,
  Plus,
  ArrowUpRight,
  Circle,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toggleUserSuspension } from "../actions";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  image: string | null;
  createdAt: Date;
}

interface AdminUsersClientProps {
  data: {
    data: User[];
    total: number;
    totalPages: number;
  };
}

export default function AdminUsersClient({ data }: AdminUsersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "All Roles");
  const [isPending, setIsPending] = useState(false);

  // Sync state with URL params when they change externally
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setRoleFilter(searchParams.get("role") || "All Roles");
  }, [searchParams]);

  const updateFilters = (newSearch: string, newRole: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newRole && newRole !== "All Roles") params.set("role", newRole);
    else params.delete("role");

    // Reset to page 1 on filter change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, roleFilter);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRoleFilter(newRole);
    updateFilters(search, newRole);
  };

  const handleToggleSuspend = async (userId: string) => {
    setIsPending(true);
    try {
      await toggleUserSuspension(userId);
      toast.success("User status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user status");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all platform users, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-card border border-border text-muted-foreground rounded-xl text-sm font-bold hover:bg-secondary transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Users
          </button>
          {/* Create User button removed as it requires complex form/modal */}
        </div>
      </div>

      {/* Stats Summary - Using passed data total if possible, or keep static/separate fetch.
          For now, we can use data.total for "Total Users" but "Active" requires more logic.
          We'll use a simple approximation based on current page data or leave static for now to focus on list functionality.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: data.total.toLocaleString(), change: "", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          // Placeholders for other stats as we don't have them in getAdminStats/getUsers yet without extra queries
          { label: "Active Now", value: "-", change: "", icon: Circle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Vendors", value: "-", change: "", icon: ShieldCheck, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Suspended", value: "-", change: "", icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <div key={i} className="p-6 bg-card rounded-2xl border border-border">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-card p-4 rounded-2xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border-transparent focus:bg-card focus:border-border rounded-lg text-sm transition-all outline-none text-foreground"
          />
        </form>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={handleRoleChange}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-secondary border-transparent text-sm font-bold text-muted-foreground outline-none cursor-pointer hover:bg-secondary/80"
          >
            <option>All Roles</option>
            <option value="user">User</option>
            <option value="salon_owner">Salon Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.data.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found.</td>
                 </tr>
              ) : (
                data.data.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/50 transition-colors group">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                            {u.image ? (
                                <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                    {u.name?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        u.role === 'salon_owner' ? 'bg-indigo-50 text-indigo-600' :
                        u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                        'bg-slate-100 text-slate-600'
                        }`}>
                        {u.role.replace('_', ' ')}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${!u.isSuspended ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="text-xs font-medium text-foreground">{!u.isSuspended ? 'Active' : 'Suspended'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                        {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => handleToggleSuspend(u.id)}
                            disabled={isPending}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                u.isSuspended
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                            }`}
                        >
                            {u.isSuspended ? "Activate" : "Suspend"}
                        </button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
              Showing page {searchParams.get("page") || 1} of {data.totalPages}
          </div>
          <div className="flex gap-2">
              <button
                disabled={Number(searchParams.get("page") || 1) <= 1}
                onClick={() => {
                    const p = Number(searchParams.get("page") || 1);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (p - 1).toString());
                    router.push(`?${params.toString()}`);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-secondary"
              >
                  Previous
              </button>
              <button
                disabled={Number(searchParams.get("page") || 1) >= data.totalPages}
                onClick={() => {
                    const p = Number(searchParams.get("page") || 1);
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("page", (p + 1).toString());
                    router.push(`?${params.toString()}`);
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium disabled:opacity-50 hover:bg-secondary"
              >
                  Next
              </button>
          </div>
      </div>
    </div>
  );
}
