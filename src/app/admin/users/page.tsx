"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  CheckCircle2,
  UserX
} from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "user" | "salon_owner" | "admin";
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
}

const users: User[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/100?u=1",
    role: "user",
    status: "active",
    joinedDate: "2024-01-15",
    totalOrders: 12,
    totalSpent: 24500
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 98765 43211",
    avatar: "https://i.pravatar.cc/100?u=2",
    role: "salon_owner",
    status: "active",
    joinedDate: "2023-11-20",
    totalOrders: 8,
    totalSpent: 18200
  },
  {
    id: "3",
    name: "Anita Desai",
    email: "anita.desai@email.com",
    phone: "+91 98765 43212",
    avatar: "https://i.pravatar.cc/100?u=3",
    role: "user",
    status: "active",
    joinedDate: "2024-02-01",
    totalOrders: 5,
    totalSpent: 12300
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43213",
    avatar: "https://i.pravatar.cc/100?u=4",
    role: "user",
    status: "suspended",
    joinedDate: "2023-08-10",
    totalOrders: 3,
    totalSpent: 5600
  }
];

const roleColors = {
  user: "bg-blue-50 text-blue-700 border-blue-100",
  salon_owner: "bg-violet-50 text-violet-700 border-violet-100",
  admin: "bg-rose-50 text-rose-700 border-rose-100"
};

const statusColors = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  suspended: "bg-amber-50 text-amber-700 border-amber-100",
  banned: "bg-rose-50 text-rose-700 border-rose-100"
};

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage platform users and their permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, change: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Users", value: users.filter(u => u.status === "active").length, change: "+8%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Salon Owners", value: users.filter(u => u.role === "salon_owner").length, change: "+5%", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Suspended", value: users.filter(u => u.status === "suspended").length, change: "-2%", color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                {stat.change}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-slate-900 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-slate-900 transition-all outline-none font-medium"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="salon_owner">Salon Owners</option>
            <option value="admin">Admins</option>
          </select>
          <button className="px-4 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${roleColors[user.role]}`}>
                      {user.role.replace("_", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColors[user.status]}`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-3.5 h-3.5" />
                        Joined {new Date(user.joinedDate).toLocaleDateString()}
                      </div>
                      <p className="text-slate-500">
                        {user.totalOrders} orders • ₹{user.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.status === "active" ? (
                        <>
                          <button
                            className="p-2 rounded-lg hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-all"
                            title="Suspend User"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          className="p-2 rounded-lg hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-all"
                          title="Activate User"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> of <span className="font-bold text-slate-900">{users.length}</span> users
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-all">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
