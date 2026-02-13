"use client";

import StudioSidebar from "@/components/creator-studio/StudioSidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function CreatorStudioLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <StudioSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0 z-40 relative">
           <div className="font-display font-semibold text-lg">
             Creator <span className="text-primary italic">Studio</span>
           </div>
           <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
             <Menu className="w-6 h-6" />
           </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background lg:hidden flex flex-col animate-in slide-in-from-right-10 duration-200">
            <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
               <div className="font-display font-semibold text-lg">Menu</div>
               <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground">
                 <X className="w-6 h-6" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-background">
               <nav className="space-y-1">
                 <Link href="/app/creator-studio" className="block px-4 py-3 rounded-xl text-lg font-medium hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                 <Link href="/app/creator-studio/content" className="block px-4 py-3 rounded-xl text-lg font-medium hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Content</Link>
                 <Link href="/app/creator-studio/analytics" className="block px-4 py-3 rounded-xl text-lg font-medium hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Analytics</Link>
                 <Link href="/app/creator-studio/community" className="block px-4 py-3 rounded-xl text-lg font-medium hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Community</Link>
                 <Link href="/app/creator-studio/earn" className="block px-4 py-3 rounded-xl text-lg font-medium hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Earn</Link>

                 <div className="h-px bg-border my-4" />

                 <Link href="/app" className="block px-4 py-3 rounded-xl text-lg font-medium text-muted-foreground hover:bg-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Exit Studio</Link>
               </nav>
            </div>
          </div>
        )}

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
            {children}
        </main>
      </div>
    </div>
  );
}
