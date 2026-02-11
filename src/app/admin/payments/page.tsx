"use client";

import { motion } from "framer-motion";
import {
  IndianRupee,
  Download,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Wallet
} from "lucide-react";
import { useState } from "react";

const transactions = [
  { id: "TXN-89421", user: "Rahul Sharma", type: "Marketplace", amount: "₹4,999", method: "Visa •••• 4242", status: "Success", date: "Oct 24, 2026, 10:30 AM" },
  { id: "TXN-89422", user: "Aura Luxury Spa", type: "Payout", amount: "₹12,500", method: "Bank Transfer", status: "Pending", date: "Oct 24, 2026, 11:15 AM" },
  { id: "TXN-89423", user: "Priya Patel", type: "Salon Booking", amount: "₹2,499", method: "UPI", status: "Success", date: "Oct 24, 2026, 12:00 PM" },
  { id: "TXN-89424", user: "Studio Épure", type: "Payout", amount: "₹42,000", method: "Bank Transfer", status: "Success", date: "Oct 23, 2026, 04:30 PM" },
  { id: "TXN-89425", user: "Vikram Singh", type: "Marketplace", amount: "₹850", method: "Mastercard •••• 5555", status: "Failed", date: "Oct 23, 2026, 02:15 PM" },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Transactions</h1>
          <p className="text-slate-500 mt-1">Track platform revenue, vendor payouts, and transaction logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Ledger
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            Process Payouts
          </button>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "₹4.2M", change: "+12.5%", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Payouts", value: "₹840k", change: "24 vendors", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Active Escrow", value: "₹1.2M", change: "842 orders", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Refunds (30d)", value: "₹42k", change: "-2.4%", icon: ArrowDownRight, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s, i) => (
          <div key={s.label} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-2">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by transaction ID, user or vendor..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-lg text-sm transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <select className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-slate-50 border-transparent text-sm font-bold text-slate-600 outline-none">
            <option>All Methods</option>
            <option>Card</option>
            <option>UPI</option>
            <option>Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{tx.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tx.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      tx.type === 'Payout' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{tx.amount}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{tx.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.method.includes('Visa') || tx.method.includes('Mastercard') ? <CreditCard className="w-4 h-4 text-slate-400" /> : <Banknote className="w-4 h-4 text-slate-400" />}
                      <span className="text-xs font-medium text-slate-600">{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.status === 'Success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : tx.status === 'Pending' ? <Clock className="w-4 h-4 text-amber-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                      <span className={`text-xs font-bold ${
                        tx.status === 'Success' ? 'text-emerald-600' : tx.status === 'Pending' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
