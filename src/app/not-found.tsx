"use client";

import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] rounded-full animate-pulse delay-700" />
        {/* Radial Grid Pattern */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0.5px,transparent_0.5px)] bg-[length:32px_32px] [mask-image:radial-gradient(circle_at_center,white,transparent_85%)] opacity-[0.05]"
          aria-hidden="true"
        />
      </div>

      <Empty className="border-none bg-transparent gap-0">
        <EmptyHeader className="max-w-2xl">
          <EmptyMedia className="mb-0">
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
              <div className="text-[120px] md:text-[180px] font-bold font-display leading-none opacity-[0.05] select-none">
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
                  <Ghost size={100} strokeWidth={1.5} aria-hidden="true" />
                </motion.div>
              </div>
            </motion.div>
          </EmptyMedia>
          <EmptyTitle className="text-4xl md:text-6xl font-bold font-display tracking-tight text-balance mt-4">
            Perdu dans le <br />
            <span className="italic text-muted-foreground">Cosmos du Style.</span>
          </EmptyTitle>
          <EmptyDescription className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed mt-6">
            La page que vous recherchez s&apos;est égarée dans le vide intersidéral ou n&apos;a jamais existé dans cette dimension.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="flex-row flex-wrap justify-center gap-4 mt-12 max-w-none">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="lg" className="rounded-full px-8 font-bold shadow-xl shadow-primary/20 h-14" aria-label="Retourner à la page d'accueil">
                <Link href="/">
                  <Home size={20} className="mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Revenir à la page principale</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold border-2 h-14" aria-label="Explorer la marketplace">
                <Link href="/app/marketplace">
                  <Search size={20} className="mr-2" />
                  Explorer le Style
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Découvrir les dernières tendances</TooltipContent>
          </Tooltip>
        </EmptyContent>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-16"
        >
          <button
            onClick={() => window.history.back()}
            className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-4 py-2"
            aria-label="Retourner à la page précédente"
          >
            <ArrowLeft size={16} />
            Retourner en arrière
          </button>
        </motion.div>
      </Empty>
    </div>
  );
}
