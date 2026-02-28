"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  ShoppingBag,
  Star,
  Heart,
  Loader2,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Salon {
  id: string;
  name: string;
  city: string;
  type: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  images?: string[];
  rating?: number;
  salon?: { name: string };
}

// ─────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────
export default function DiscoverPage() {
  const [topSalons, setTopSalons] = useState<Salon[]>([]);
  const [marketplacePicks, setMarketplacePicks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Données mock du dashboard (à remplacer par vrai fetch si dispo)
  const loyaltyPoints = 120;
  const loyaltyTarget = 150;
  const loyaltyProgress = (loyaltyPoints / loyaltyTarget) * 100;
  const nextBooking = { salon: "BERA Hair & Beauty", date: "Apr 27, 4:00 PM" };

  useEffect(() => {
    async function fetchData() {
      try {
        const [salonsRes, productsRes] = await Promise.all([
          fetch("/api/salons?limit=4"),
          fetch("/api/products?limit=4"),
        ]);
        if (salonsRes.ok) setTopSalons(await salonsRes.json());
        if (productsRes.ok) setMarketplacePicks(await productsRes.json());
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-background pb-20 lg:pb-10 p-6 lg:p-8">

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-7"
      >
        <h1 className="text-3xl font-bold font-display text-foreground">Hi Joe!</h1>
        <p className="text-muted-foreground text-sm mt-1">Let&apos;s get you beauty ready</p>
      </motion.div>

      {/* ── Main grid : left | right ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="flex flex-col gap-5">

          {/* Hero – Book your next appointment */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-[160px] flex items-center"
          >
            {/* Decorative right area */}
            <div className="absolute right-0 top-0 h-full w-[220px] bg-secondary/60 rounded-l-[80px]" />

            {/* Illustration (SVG léger, remplaçable par une vraie image) */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none select-none">
              <svg width="140" height="110" viewBox="0 0 150 110" fill="none">
                <ellipse cx="75" cy="45" rx="28" ry="34" fill="#d4cec6" stroke="#ccc" strokeWidth="1.5"/>
                <ellipse cx="75" cy="45" rx="22" ry="27" fill="#edeae4"/>
                <rect x="70" y="77" width="10" height="16" rx="3" fill="#bbb"/>
                <rect x="60" y="91" width="30" height="5" rx="2.5" fill="#bbb"/>
                <rect x="112" y="55" width="10" height="30" rx="3" fill="#c9a8a8"/>
                <rect x="114" y="48" width="6" height="10" rx="2" fill="#c97a7a"/>
                <rect x="20" y="50" width="6" height="38" rx="3" fill="#c9b87a"/>
                <rect x="21" y="46" width="4" height="10" rx="2" fill="#8b7355"/>
                <rect x="95" y="62" width="18" height="26" rx="4" fill="#b8c4d4"/>
                <rect x="101" y="56" width="6" height="8" rx="2" fill="#8fa0b4"/>
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 p-7 max-w-xs">
              <h2 className="text-xl font-bold text-foreground leading-snug mb-1">
                Book your next appointment
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Check out top-rated salons near you
              </p>
              <Link href="/app/search?tab=salons">
                <Button className="rounded-full px-5 gap-2 shadow-sm">
                  <MapPin className="w-4 h-4" />
                  Find a Salon
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Top Rated Salons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5"
          >
            <SectionHeader title="Top Rated Salons" href="/app/search?tab=salons" />

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topSalons.slice(0, 2).map((salon, i) => (
                  <SalonCard key={salon.id} salon={salon} index={i} />
                ))}
                {topSalons.length === 0 && (
                  <p className="text-muted-foreground text-sm col-span-2">No salons found.</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5"
          >
            <SectionHeader
              title="Dashboard"
              href="/app/dashboard"
              icon={<CheckSquare className="w-4 h-4 text-primary" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Loyalty Points */}
              <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    Loyalty Points: {loyaltyPoints}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {loyaltyTarget - loyaltyPoints} more points to next reward
                  </p>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loyaltyProgress}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-foreground rounded-full"
                  />
                </div>
              </div>

              {/* My Bookings */}
              <div className="rounded-xl border border-border p-4 flex flex-col gap-3">
                <h4 className="font-bold text-sm text-foreground">My Bookings</h4>
                <div className="rounded-lg border border-border/70 p-3 bg-secondary/30">
                  <p className="font-semibold text-sm text-foreground">{nextBooking.salon}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{nextBooking.date}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
        {/* ════════════════ END LEFT ════════════════ */}

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <div className="flex flex-col gap-5">

          {/* Top Rated Salons – Categories */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5"
          >
            <SectionHeader title="Top Rated Salons" href="/app/search?tab=salons" />

            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-center text-foreground leading-tight">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="bg-card rounded-2xl border border-border shadow-sm p-5"
          >
            <h3 className="font-bold text-sm text-foreground mb-4">Marketplace</h3>

            {/* Banner produits */}
            <div className="rounded-xl bg-secondary/60 h-[130px] mb-4 flex items-center justify-center overflow-hidden relative">
              {marketplacePicks[0]?.images?.[0] ? (
                <img
                  src={marketplacePicks[0].images[0]}
                  alt="Marketplace"
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                  <rect x="18" y="18" width="24" height="52" rx="6" fill="#b8c4d4"/>
                  <rect x="24" y="12" width="12" height="10" rx="3" fill="#8fa0b4"/>
                  <rect x="52" y="36" width="30" height="30" rx="6" fill="#d4cec6"/>
                  <rect x="52" y="28" width="30" height="12" rx="4" fill="#bbb4ac"/>
                  <rect x="92" y="26" width="14" height="44" rx="5" fill="#c9a8a8"/>
                  <rect x="116" y="24" width="32" height="40" rx="5" fill="#edeae4"/>
                  <rect x="116" y="24" width="32" height="12" rx="4" fill="#d4d0c8"/>
                  <rect x="158" y="34" width="12" height="30" rx="4" fill="#c9d4b8"/>
                  <rect x="160" y="28" width="8" height="8" rx="3" fill="#a8b890"/>
                </svg>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Check out trending beauty products
            </p>

            <Link href="/app/marketplace">
              <Button className="rounded-full w-full gap-2">
                <ShoppingBag className="w-4 h-4" />
                Browse
              </Button>
            </Link>
          </motion.div>

        </div>
        {/* ════════════════ END RIGHT ════════════════ */}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Catégories
// ─────────────────────────────────────────────
const CATEGORIES = [
  { label: "French Manicure", icon: "💅", href: "/app/search?style=manicure" },
  { label: "Hairstyles", icon: "✂️", href: "/app/search?style=hair" },
  { label: "Skincare Routine", icon: "🧴", href: "/app/search?style=skincare" },
];

// ─────────────────────────────────────────────
// Section Header
// ─────────────────────────────────────────────
function SectionHeader({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <Link
        href={href}
        className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors group"
      >
        View All
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────
// Salon Card (adapté wireframe)
// ─────────────────────────────────────────────
function SalonCard({ salon, index }: { salon: Salon; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        href={`/app/salons/${salon.id}`}
        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group bg-background"
      >
        {/* Thumbnail */}
        <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
          {salon.image ? (
            <img
              src={salon.image}
              alt={salon.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Star className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{salon.name}</p>
          <div className="h-1.5 bg-muted rounded-full mt-1.5 w-4/5" />
          <div className="h-1.5 bg-muted rounded-full mt-1 w-3/5" />
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Open Now
          </span>
          <span className="px-3 py-1 rounded-full border border-border text-[11px] font-semibold text-foreground hover:bg-foreground hover:text-background transition-colors">
            Book
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
