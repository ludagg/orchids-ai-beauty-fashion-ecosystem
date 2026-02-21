"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Search,
  MapPin,
  Star,
  ChevronRight,
  Clock,
  Calendar,
  Filter,
  Navigation,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const categories = ["All", "Hair", "Skin", "Spa", "Nails", "Grooming"];

interface Salon {
  id: string;
  name: string;
  address: string;
  city: string;
  image: string | null;
  logo: string | null;
  type: string;
  // Add other fields if needed
}

export default function SalonsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalons() {
      try {
        const response = await fetch('/api/salons');
        if (response.ok) {
          const data = await response.json();
          setSalons(data);
        } else {
          console.error("Failed to fetch salons");
        }
      } catch (error) {
        console.error("Error fetching salons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalons();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">Nearby Salons</h1>
          <p className="text-muted-foreground mt-1 text-base">Book verified beauty services instantly.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden sm:block">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Your Location"
              className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/5 transition-all outline-none w-48 text-foreground"
              defaultValue="Bangalore"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-all">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </section>

      {/* Search Bar - Mobile optimized */}
      <section className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for services or salon names..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border focus:border-primary shadow-sm transition-all outline-none text-lg text-foreground"
        />
      </section>

      {/* Categories Scroll */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-card border border-border text-muted-foreground hover:border-blue-600 hover:text-blue-600"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Salon List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {salons.map((salon, i) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/app/salons/${salon.id}`}
                className="flex flex-col sm:flex-row gap-5 p-4 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-foreground/5 transition-all group overflow-hidden"
              >
                <div className="w-full sm:w-48 h-56 sm:h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-secondary shadow-inner relative">
                  <img
                    src={salon.logo || salon.image || "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop"}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/90 backdrop-blur-md text-[10px] font-bold flex items-center gap-1 shadow-sm text-foreground">
                    <Navigation className="w-3 h-3 text-blue-600" />
                    2.0 km
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors truncate">{salon.name}</h3>
                      <div className="flex items-center gap-1 text-sm font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        5.0
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {salon.address}, {salon.city}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {[salon.type].map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 sm:mt-0 pt-4 border-t border-border sm:border-0">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-0.5">Starting From</p>
                      <p className="font-bold text-foreground">$$</p>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5">
                      Book Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>
      )}

      {/* Promotions Section */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200"
      >
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-card animate-pulse" />
            Limited Offer
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display mb-6 leading-tight">First Booking? <br/>Get 30% Off</h2>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Experience premium beauty services at any of our partner salons and enjoy exclusive discounts on your first visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 rounded-2xl bg-card text-blue-600 font-bold hover:bg-card/90 transition-all flex items-center justify-center gap-2">
              Claim Offer <ChevronRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-2xl bg-card/10 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-card/20 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-card/10 blur-[80px] rounded-full rotate-12" />
        <div className="absolute bottom-[-20%] right-[10%] w-[30%] h-[40%] bg-blue-400/20 blur-[60px] rounded-full" />
      </motion.div>
    </div>
  );
}
