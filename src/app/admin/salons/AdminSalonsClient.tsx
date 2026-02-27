"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Star,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Plus,
  BarChart3,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { approveSalon, suspendSalon } from "../actions";
import { toast } from "sonner";
import Link from "next/link";

interface Salon {
  id: string;
  name: string;
  owner?: {
    id: string;
    name: string;
  };
  city: string;
  status: string;
  image: string | null;
  createdAt: Date;
}

interface AdminSalonsClientProps {
  data: {
    data: Salon[];
    total: number;
    totalPages: number;
  };
}

export default function AdminSalonsClient({ data }: AdminSalonsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All Status");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setStatusFilter(searchParams.get("status") || "All Status");
  }, [searchParams]);

  const updateFilters = (newSearch: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");

    if (newStatus && newStatus !== "All Status") params.set("status", newStatus);
    else params.delete("status");

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(search, statusFilter);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    updateFilters(search, newStatus);
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Are you sure you want to approve this salon?")) return;
    setIsPending(true);
    try {
      await approveSalon(id);
      toast.success("Salon approved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to approve salon");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm("Are you sure you want to suspend this salon?")) return;
    setIsPending(true);
    try {
      await suspendSalon(id);
      toast.success("Salon suspended");
      router.refresh();
    } catch (error) {
      toast.error("Failed to suspend salon");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleReject = async (id: string) => {
      if (!confirm("Are you sure you want to reject this salon application?")) return;
      setIsPending(true);
      try {
        // Assuming rejectSalon sets status to 'suspended' or 'rejected'
        // Using suspendSalon logic as fallback if rejectSalon is just a wrapper
        await suspendSalon(id);
        toast.success("Salon application rejected");
        router.refresh();
      } catch (error) {
        toast.error("Failed to reject salon");
        console.error(error);
      } finally {
        setIsPending(false);
      }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partner Salons</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage salon partner performance.</p>
        </div>
        {/* New Salon button could link to a create form or invite flow */}
      </div>

      {/* Salon Stats - Placeholder using total */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Partners", value: data.total.toLocaleString(), sub: "Registered", color: "text-blue-600" },
          { label: "Pending Approval", value: "-", sub: "Requires attention", color: "text-amber-600" },
          { label: "Active", value: "-", sub: "Operating", color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="p-6 bg-card rounded-2xl border border-border shadow-sm">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by salon name..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border focus:border-indigo-500 rounded-lg text-sm transition-all outline-none shadow-sm text-foreground"
          />
        </form>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-card border border-border text-sm font-bold text-muted-foreground outline-none cursor-pointer hover:bg-secondary"
          >
            <option>All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Salons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.data.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
                No salons found.
            </div>
        ) : (
            data.data.map((s, i) => (
            <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card p-6 rounded-3xl border border-border hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5 transition-all"
            >
                <div className="flex gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-secondary flex-shrink-0 relative">
                    {s.image ? (
                        <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-400">
                            <Scissors className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-foreground text-lg truncate">{s.name}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {s.city}
                        </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        s.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                        s.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                    }`}>
                        {s.status}
                    </span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                        <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                        - {/* Rating placeholder */}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <div className="text-xs font-bold text-muted-foreground">
                        Owner: <span className="text-foreground">{s.owner?.name || "Unknown"}</span>
                    </div>
                    </div>
                </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-bold text-foreground mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                    {s.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleApprove(s.id)}
                                disabled={isPending}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleReject(s.id)}
                                disabled={isPending}
                                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
                            >
                                Reject
                            </button>
                        </>
                    )}
                    {s.status === 'active' && (
                        <button
                            onClick={() => handleSuspend(s.id)}
                            disabled={isPending}
                            className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
                        >
                            Suspend
                        </button>
                    )}
                    {s.status === 'suspended' && (
                        <button
                            onClick={() => handleApprove(s.id)} // Reactivate
                            disabled={isPending}
                            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                            Reactivate
                        </button>
                    )}
                    <Link href={`/admin/salons/${s.id}`} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2">
                        View Details
                    </Link>
                    <Link href={`/app/salons/${s.id}`} target="_blank" className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-indigo-600 transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
                </div>
            </motion.div>
            ))
        )}
      </div>

       {/* Pagination Controls */}
       <div className="flex justify-between items-center mt-8">
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
