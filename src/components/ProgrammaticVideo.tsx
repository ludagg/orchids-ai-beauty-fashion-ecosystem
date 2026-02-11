"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShoppingBag,
  Scan,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function ProgrammaticVideo() {
  const [scene, setScene] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setScene(2), 5000);
    const timer2 = setTimeout(() => setScene(3), 12000);
    const timer3 = setTimeout(() => setScene(4), 22000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center text-white font-sans">
      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.div
            key="scene1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center z-10"
          >
            <motion.h1
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="text-5xl md:text-7xl font-semibold tracking-tighter mb-4"
            >
              Priisme
            </motion.h1>
            <motion.p
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.8, duration: 0.8 }}
               className="text-xl md:text-2xl text-gray-400 font-light"
            >
              Fashion Reimagined with Intelligence
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
              className="mt-8 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent w-64 mx-auto"
            />
          </motion.div>
        )}

        {scene === 2 && (
          <motion.div
            key="scene2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl px-6 z-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {[
                { icon: Sparkles, title: "AI Stylist", color: "text-rose-500" },
                { icon: Scan, title: "Virtual Try-on", color: "text-blue-500" },
                { icon: ShoppingBag, title: "Live Commerce", color: "text-emerald-500" }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 + 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10`}>
                    <feature.icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                </motion.div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-center mt-16 text-gray-400 text-lg max-w-xl mx-auto"
            >
              The most advanced beauty & fashion ecosystem, right in your pocket.
            </motion.p>
          </motion.div>
        )}

        {scene === 3 && (
          <motion.div
            key="scene3"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-[280px] h-[520px] sm:h-[580px] rounded-[3rem] border-[8px] border-white/10 bg-gray-900 overflow-hidden shadow-2xl z-10 scale-90 sm:scale-100"
          >
            {/* Mockup UI */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="w-20 h-4 bg-white/10 rounded-full" />
                <div className="w-8 h-8 rounded-full bg-white/10" />
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="w-full h-32 sm:h-40 rounded-2xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-white/5"
                />
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="h-24 sm:h-32 rounded-2xl bg-white/5 border border-white/5"
                  />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="h-24 sm:h-32 rounded-2xl bg-white/5 border border-white/5"
                  />
                </div>
                <motion.div
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ delay: 1.2 }}
                   className="w-full h-10 sm:h-12 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs sm:text-sm"
                >
                  Try On Virtually
                </motion.div>
              </div>
            </div>
            {/* Cursor animation */}
            <motion.div
              animate={{
                x: [140, 180, 140],
                y: [400, 430, 400],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 2
              }}
              className="absolute w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 pointer-events-none"
            />
          </motion.div>
        )}

        {scene === 4 && (
          <motion.div
            key="scene4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center px-6 z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-semibold mb-6"
            >
              Experience the Future.
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-base md:text-lg mb-10 max-w-md mx-auto font-light"
            >
              Join early adopters and redefine your style journey with Priisme.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors cursor-pointer group text-sm md:text-base">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-20">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${s === scene ? "w-8 bg-white" : "w-2 bg-white/20"}`}
          />
        ))}
      </div>

      {/* Background ambient light */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-rose-500 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-blue-500 blur-[120px] rounded-full"
        />
      </div>
    </div>
  );
}
