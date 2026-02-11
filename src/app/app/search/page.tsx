"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Tag,
  ShoppingBag,
  Scissors,
  Star,
  MapPin,
  Navigation,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

// Mock Data - Products
const products = [
  {
    id: "1",
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop",
    price: "₹4,999",
    rating: 4.8,
    reviews: 124,
    category: "Apparel"
  },
  {
    id: "2",
    title: "Artisan Silk Saree",
    designer: "Kalyan Heritage",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=500&fit=crop",
    price: "₹12,499",
    rating: 4.9,
    reviews: 86,
    category: "Apparel"
  },
  {
    id: "3",
    title: "Neo-Tokyo Tech Jacket",
    designer: "Neo-Tokyo",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
    price: "₹7,299",
    rating: 4.7,
    reviews: 210,
    category: "Apparel"
  },
  {
    id: "4",
    title: "Handcrafted Leather Boots",
    designer: "WalkFree",
    image: "https://images.unsplash.com/photo-1520639889313-727216be3b37?w=400&h=500&fit=crop",
    price: "₹5,499",
    rating: 4.6,
    reviews: 45,
    category: "Footwear"
  },
  {
    id: "5",
    title: "Celestial Gold Necklace",
    designer: "Aura Jewels",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
    price: "₹18,999",
    rating: 4.9,
    reviews: 32,
    category: "Jewelry"
  },
  {
    id: "6",
    title: "Modernist Canvas Tote",
    designer: "Studio Épure",
    image: "https://images.unsplash.com/photo-1544816153-0973055cb755?w=400&h=500&fit=crop",
    price: "₹1,999",
    rating: 4.5,
    reviews: 156,
    category: "Accessories"
  }
];

// Mock Data - Salons
const salons = [
  {
    id: "1",
    name: "Aura Luxury Spa",
    location: "Indiranagar, Bangalore",
    rating: 4.9,
    reviews: 420,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=300&fit=crop",
    tags: ["Spa", "Facial", "Massage"],
    price: "$$$",
    distance: "1.2 km"
  },
  {
    id: "2",
    name: "The Grooming Co.",
    location: "Koramangala, Bangalore",
    rating: 4.8,
    reviews: 315,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
    tags: ["Haircut", "Beard", "Shave"],
    price: "$$",
    distance: "2.5 km"
  },
  {
    id: "3",
    name: "Noir Salon",
    location: "MG Road, Bangalore",
    rating: 4.7,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    tags: ["Coloring", "Styling", "Treatments"],
    price: "$$$$",
    distance: "3.8 km"
  },
  {
    id: "4",
    name: "Eco Beauty Hub",
    location: "HSR Layout, Bangalore",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=300&fit=crop",
    tags: ["Organic", "Skincare", "Eco-friendly"],
    price: "$$",
    distance: "5.1 km"
  }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.designer.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSalons = salons.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.location.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const hasResults = filteredProducts.length > 0 || filteredSalons.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      <section>
        <h1 className="text-3xl font-semibold font-display tracking-tight text-foreground">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          Found {filteredProducts.length} products and {filteredSalons.length} salons
        </p>
      </section>

      {/* Tabs */}
      <section className="flex gap-4 border-b border-border">
        {["All", "Products", "Salons"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {!hasResults && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
        </div>
      )}

      {/* Products Section */}
      {(activeTab === "All" || activeTab === "Products") && filteredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <ShoppingBag className="w-5 h-5" />
            <h2>Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <Link href={`/app/marketplace/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden mb-3 sm:mb-4 shadow-sm border border-border bg-secondary">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 text-foreground">
                        <Tag className="w-3 h-3 text-rose-500" />
                        New
                      </div>
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <h3 className="font-semibold text-sm sm:text-[15px] truncate text-foreground">{product.title}</h3>
                      <div className="hidden sm:flex items-center gap-1 text-xs font-bold bg-secondary px-2 py-0.5 rounded-full text-foreground">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{product.designer}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-base sm:text-lg text-rose-600">{product.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Salons Section */}
      {(activeTab === "All" || activeTab === "Salons") && filteredSalons.length > 0 && (
        <section className="space-y-4 pt-8">
           <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Scissors className="w-5 h-5" />
            <h2>Salons</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSalons.map((salon, i) => (
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
                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/90 backdrop-blur-md text-[10px] font-bold flex items-center gap-1 shadow-sm text-foreground">
                      <Navigation className="w-3 h-3 text-blue-600" />
                      {salon.distance}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors truncate">{salon.name}</h3>
                        <div className="flex items-center gap-1 text-sm font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {salon.rating}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {salon.location}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {salon.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 sm:mt-0 pt-4 border-t border-border sm:border-0">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest mb-0.5">Starting From</p>
                        <p className="font-bold text-foreground">{salon.price}</p>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5">
                        Book Now <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
