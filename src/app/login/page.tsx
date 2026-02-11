"use client";

import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] selection:bg-black/10">
      <Navbar />

      <main className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]" />
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-rose-500/[0.08] blur-[100px] rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-500/[0.08] blur-[100px] rounded-full"
          />
        </div>

        <div className="w-full max-w-[440px] px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-[32px] border border-[#e5e5e5] shadow-2xl shadow-black/5"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold font-display mb-2">Welcome Back</h1>
              <p className="text-[#6b6b6b] text-sm">
                Enter your details to access your Priisme account
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] transition-colors group-focus-within:text-[#1a1a1a]" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium">Password</label>
                  <a href="#" className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b] transition-colors group-focus-within:text-[#1a1a1a]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[#fafafa] border border-[#e5e5e5] outline-none focus:border-[#1a1a1a] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button className="w-full h-12 mt-4 rounded-2xl bg-[#1a1a1a] text-white font-medium hover:bg-[#333] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                Sign In
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e5e5e5]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#6b6b6b]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-[#e5e5e5] hover:bg-[#fafafa] transition-all active:scale-[0.98]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 h-12 rounded-2xl border border-[#e5e5e5] hover:bg-[#fafafa] transition-all active:scale-[0.98]">
                <Github className="w-5 h-5" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>

            <p className="text-center mt-8 text-sm text-[#6b6b6b]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#1a1a1a] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
