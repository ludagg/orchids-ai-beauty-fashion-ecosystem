"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate signup
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex selection:bg-black/10">
      {/* Left Side: Imagery & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a1a1a]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=1600&fit=crop"
            alt="Fashion Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-1" />

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <Link href="/" className="text-2xl font-semibold tracking-tight font-display">
            Priisme
          </Link>

          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-semibold font-display mb-6 leading-tight"
            >
              Le futur de la mode est <span className="italic text-emerald-400">personnalisé.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-white/70 leading-relaxed"
            >
              Créez votre compte pour accéder à des recommandations sur mesure
              et explorer un écosystème de mode intelligent.
            </motion.p>
          </div>

          <div className="flex gap-8 text-sm text-white/50">
            <span>© 2026 Priisme</span>
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 relative bg-[#fafafa]">
        <Link
          href="/"
          className="absolute top-8 left-8 lg:hidden text-2xl font-semibold tracking-tight font-display"
        >
          Priisme
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] mx-auto"
        >
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight font-display mb-2">S'inscrire</h1>
            <p className="text-[#6b6b6b]">Commencez votre voyage avec Priisme.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e5e5e5] bg-white text-sm font-medium hover:bg-[#fafafa] transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e5e5e5] bg-white text-sm font-medium hover:bg-[#fafafa] transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.96.95-2.05 1.44-3.26 1.44-1.18 0-2.19-.44-3.25-1.44-1.07-1.01-2.15-1.52-3.32-1.52-1.18 0-2.26.51-3.35 1.52-1.01 1-2 1.48-3.09 1.48-.92 0-1.78-.4-2.58-1.2C.54 19.36 0 18.06 0 16.66c0-1.36.46-2.6 1.39-3.72 1.58-1.9 3.65-2.85 6.2-2.85 1.09 0 2.05.34 2.89 1.03.45.36.85.8 1.2 1.3.35-.5.75-.94 1.2-1.3.84-.69 1.81-1.03 2.89-1.03 2.55 0 4.62.95 6.21 2.85.92 1.12 1.39 2.36 1.39 3.72 0 1.4-.54 2.7-1.63 3.9-.84.92-1.77 1.41-2.79 1.41-1.04 0-2.07-.46-3.09-1.39-.46-.42-.92-.63-1.37-.63s-.92.21-1.39.63c-.15.15-.3.3-.46.46l.01.01zM12.03 7.25c-.15 0-.3 0-.45-.01-.3-.02-.61-.03-.92-.03-1.55 0-2.97.58-4.05 1.58-1.13 1.05-1.76 2.44-1.76 3.93 0 .15.01.3.02.45.02.3.03.61.03.92 0 1.55-.58 2.97-1.58 4.05-1.05 1.13-2.44 1.76-3.93 1.76-.15 0-.3-.01-.45-.02-.3-.02-.61-.03-.92-.03-1.55 0-2.97.58-4.05 1.58-1.13 1.05-1.76 2.44-1.76 3.93 0 .15.01.3.02.45.02.3.03.61.03.92 0 1.55-.58 2.97-1.58 4.05-1.05 1.13-2.44 1.76-3.93 1.76-.15 0-.3-.01-.45-.02-.3-.02-.61-.03-.92-.03C.11 20.31 0 18.73 0 17.15c0-4.02 3.26-7.28 7.28-7.28.15 0 .3 0 .45.01.3.02.61.03.92.03 1.55 0 2.97-.58 4.05-1.58 1.13-1.05 1.76-2.44 1.76-3.93 0-.15-.01-.3-.02-.45-.02-.3-.03-.61-.03-.92 0-1.55.58-2.97 1.58-4.05 1.05-1.13 2.44-1.76 3.93-1.76.15 0 .3.01.45.02.3.02.61.03.92.03 1.58 0 3.16-.11 4.74-.32z"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#e5e5e5]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#fafafa] px-2 text-[#6b6b6b]">Ou continuer avec</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a] ml-1">Nom complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] group-focus-within:text-[#1a1a1a] transition-colors" />
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-[#e5e5e5] text-[15px] outline-none focus:border-[#1a1a1a] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a] ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] group-focus-within:text-[#1a1a1a] transition-colors" />
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-[#e5e5e5] text-[15px] outline-none focus:border-[#1a1a1a] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a1a1a] ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] group-focus-within:text-[#1a1a1a] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border border-[#e5e5e5] text-[15px] outline-none focus:border-[#1a1a1a] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  S'inscrire
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[#6b6b6b] text-sm">
              Vous avez déjà un compte ?{" "}
              <Link href="/login" className="text-[#1a1a1a] font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
