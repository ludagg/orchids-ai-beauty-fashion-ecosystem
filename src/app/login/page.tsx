"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 selection:bg-black/10">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/[0.05] blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-500/[0.05] blur-[100px] rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px]"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-black/5 border border-[#e5e5e5]">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight font-display mb-2">Se connecter</h1>
            <p className="text-[#6b6b6b]">Bon retour parmi nous ! Veuillez entrer vos coordonnées.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] group-focus-within:text-[#1a1a1a] transition-colors" />
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] text-[15px] outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-[#1a1a1a]">Mot de passe</label>
                <a href="#" className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] hover:underline transition-all">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] group-focus-within:text-[#1a1a1a] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] text-[15px] outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#e5e5e5] text-center">
            <p className="text-[#6b6b6b] text-sm">
              Vous n'avez pas de compte ?{" "}
              <Link href="/signup" className="text-[#1a1a1a] font-semibold hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
