"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  UserPlus,
  ArrowUpRight,
  Download,
  Trash2,
  CheckCircle2,
  XCircle
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    joined: "2024-05-12",
    lastLogin: "2 hours ago",
    avatar: "JD"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Salon Owner",
    status: "Active",
    joined: "2024-04-20",
    lastLogin: "1 day ago",
    avatar: "JS"
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Admin",
    status: "Active",
    joined: "2023-11-05",
    lastLogin: "30 min ago",
    avatar: "AJ"
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "User",
    status: "Suspended",
    joined: "2024-01-15",
    lastLogin: "2 months ago",
    avatar: "SW"
  }
];

export default function UsersAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Manage all platform users, roles, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900">12,482</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12%</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Now</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900">1,245</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Live</span>
          </div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">New this Week</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-900">452</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+5%</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-slate-200 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4 text-slate-600" />
            </button>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium px-4 py-2 outline-none">
              <option>All Roles</option>
              <option>User</option>
              <option>Salon Owner</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-700' :
                      user.role === 'Salon Owner' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      <span className="text-sm text-slate-700">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{user.joined}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Last: {user.lastLogin}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-slate-500">Showing <span className="font-medium text-slate-900">4</span> of <span className="font-medium text-slate-900">12,482</span> users</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-white transition-all disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium hover:bg-white transition-all">Next</button>
        </div>
      </div>
    </div>
  );
}
