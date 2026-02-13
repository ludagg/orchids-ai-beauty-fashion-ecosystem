"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ShoppingBag, Video, Scissors, Sparkles, Users } from "lucide-react";
import Link from "next/link";

// Mock Data
const MOCK_RESULTS = {
  salons: [
    { id: 1, name: "Luxe Beauty Lounge", location: "Koramangala, Bangalore", rating: 4.9, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop" },
    { id: 2, name: "The Grooming Co.", location: "Indiranagar, Bangalore", rating: 4.8, image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop" },
    { id: 3, name: "Urban sanctuary", location: "Whitefield, Bangalore", rating: 4.7, image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=400&fit=crop" },
  ],
  marketplace: [
    { id: 1, name: "Silk Evening Gown", brand: "Studio Épure", price: "₹15,999", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop" },
    { id: 2, name: "Leather Biker Jacket", brand: "Neo-Tokyo", price: "₹8,499", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop" },
    { id: 3, name: "Velvet Blazer", brand: "Kalyan Heritage", price: "₹6,299", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f684?w=400&h=500&fit=crop" },
  ],
  videos: [
    { id: 1, title: "Summer Makeup Routine", creator: "BeautyBySam", views: "12K", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=400&fit=crop" },
    { id: 2, title: "Hair Styling 101", creator: "HairMasters", views: "8.5K", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&h=400&fit=crop" },
  ],
  creators: [
    { id: 1, name: "Ananya Sharma", handle: "@ananya_style", followers: "124K", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
    { id: 2, name: "Marcus Chen", handle: "@marcus_cuts", followers: "89K", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    { id: 3, name: "Elena Rodriguez", handle: "@elena_mua", followers: "210K", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
    { id: 4, name: "David Kim", handle: "@stylebydavid", followers: "45K", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
  ],
  styles: [
    { id: 1, title: "Boho Chic", creator: "@sarastyle", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop" },
    { id: 2, title: "Urban Edge", creator: "@cityvibe", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop" },
  ]
};

const TABS = [
  { id: "all", label: "All Results" },
  { id: "creators", label: "Creators", icon: Users },
  { id: "salons", label: "Salons", icon: Scissors },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "videos", label: "Videos", icon: Video },
  { id: "styles", label: "Styles", icon: Sparkles },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  // Simulate search delay
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 800);
    return () => clearTimeout(timer);
  }, [query, activeTab]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        <p className="text-muted-foreground">
          Found {Object.values(MOCK_RESULTS).flat().length} results across all categories.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-secondary/50 rounded-2xl h-64" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">

           {/* Creators Section */}
           {(activeTab === "all" || activeTab === "creators") && (
            <section>
              {activeTab === "all" && (
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" /> Creators
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOCK_RESULTS.creators.map((creator) => (
                  <Link href={`/app/videos-creations/creator/${creator.id}`} key={creator.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-shadow group flex items-center space-x-4 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img src={creator.image} alt={creator.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{creator.handle}</p>
                        <p className="text-xs font-medium text-primary mt-1">{creator.followers} followers</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Salons Section */}
          {(activeTab === "all" || activeTab === "salons") && (
            <section>
              {activeTab === "all" && (
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-rose-500" /> Salons
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_RESULTS.salons.map((salon) => (
                  <motion.div
                    key={salon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={salon.image} alt={salon.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">{salon.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold bg-secondary px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {salon.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {salon.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Marketplace Section */}
          {(activeTab === "all" || activeTab === "marketplace") && (
            <section>
              {activeTab === "all" && (
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-500" /> Marketplace
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {MOCK_RESULTS.marketplace.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-secondary relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                    <p className="font-bold text-sm mt-1">{item.price}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Videos Section */}
          {(activeTab === "all" || activeTab === "videos") && (
            <section>
               {activeTab === "all" && (
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-violet-500" /> Videos
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_RESULTS.videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer flex"
                  >
                    <div className="w-40 aspect-video overflow-hidden flex-shrink-0">
                      <img src={video.image} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex flex-col justify-center">
                      <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.creator}</p>
                      <p className="text-xs text-muted-foreground mt-2">{video.views} views</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
