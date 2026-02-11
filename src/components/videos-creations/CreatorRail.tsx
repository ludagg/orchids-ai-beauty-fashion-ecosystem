"use client";

import { motion } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface Creator {
  id: string;
  name: string;
  avatar: string;
  isLive?: boolean;
}

interface CreatorRailProps {
  creators: Creator[];
}

export default function CreatorRail({ creators }: CreatorRailProps) {
  return (
    <div className="overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-4 sm:gap-6 min-w-max">
        {/* Add Story / Create Button */}
        <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-secondary border-2 border-dashed border-border flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-colors">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Create</span>
        </div>

        {creators.map((creator) => (
          <Link key={creator.id} href={`/app/videos-creations/creator/${creator.id}`} className="group">
            <div className="flex flex-col items-center gap-2">
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] p-[2px] ${creator.isLive ? 'bg-gradient-to-tr from-rose-500 to-violet-500 animate-spin-slow' : 'bg-transparent'}`}>
                <div className={`w-full h-full rounded-[22px] overflow-hidden border-2 ${creator.isLive ? 'border-background' : 'border-border group-hover:border-primary'} transition-colors`}>
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {creator.isLive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-500 text-[8px] font-bold text-white uppercase tracking-wider shadow-sm z-10 border border-background">
                        Live
                    </div>
                )}
              </div>
              <span className="text-xs font-bold text-foreground max-w-[70px] truncate text-center group-hover:text-primary transition-colors">
                  {creator.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
