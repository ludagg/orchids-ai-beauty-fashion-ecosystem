"use client";

import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-2xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="relative inline-block"
        >
          <div className="text-[150px] md:text-[200px] font-bold font-display leading-none opacity-[0.03] select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-primary"
            >
              <Ghost size={120} strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-6 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold font-display tracking-tight"
          >
            Lost in the <br />
            <span className="italic text-muted-foreground">Style Cosmos.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
          >
            The page you&apos;re looking for has either drifted away or never existed in this dimension.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            href="/app/marketplace"
            className="w-full sm:w-auto px-8 py-4 bg-muted text-foreground border border-border rounded-full font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all active:scale-95"
          >
            <Search size={20} />
            Search Style
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-12"
        >
          <button
            onClick={() => window.history.back()}
            className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
