"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LayoutDashboard, Scissors, ShoppingBag, Calendar, Image as ImageIcon, Clock, Star, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ServiceManager } from "../components/ServiceManager";
import { ProductManager } from "../components/ProductManager";
import { BookingManager } from "../components/BookingManager";
import { SalonImageManager } from "../components/SalonImageManager";
import { SalonHoursManager } from "../components/SalonHoursManager";
import { SalonReviewsManager } from "../components/SalonReviewsManager";
import { Suspense, useState } from "react";

function PartnerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "SALON";
  const businessName = searchParams.get("businessName") || "My Business";
  const salonId = searchParams.get("salonId");

  // Determine initial active tab based on type
  const [activeTab, setActiveTab] = useState(() => {
    if (type === "BOUTIQUE") return "products";
    return "bookings"; // Default to bookings for quick access
  });

  const showServices = type === "SALON" || type === "BOTH";
  const showProducts = type === "BOUTIQUE" || type === "BOTH";
  const showBookings = type === "SALON" || type === "BOTH"; // Only salons receive bookings for now

  // Handle back navigation to preserve partner state via query params
  const handleBack = () => {
    router.push(`/app/creator-studio?partner=true&type=${type}&businessName=${encodeURIComponent(businessName)}`);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen pb-20 pt-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-2" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Studio</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8" />
            Partner Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your {type === "BOTH" ? "Salon & Boutique" : type === "SALON" ? "Salon" : "Boutique"} offerings for {businessName}.
          </p>
        </div>

        <Link
          href="/app/conversations"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Inbox
        </Link>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto justify-start bg-transparent border-b h-12 p-0 rounded-none mb-6 overflow-x-auto no-scrollbar">
          {showBookings && (
            <TabsTrigger
              value="bookings"
              className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
          )}

          {showServices && (
            <TabsTrigger
              value="services"
              className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          )}

          {showProducts && (
            <TabsTrigger
              value="products"
              className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
          )}

           <TabsTrigger
            value="photos"
            className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Photos
          </TabsTrigger>

          <TabsTrigger
            value="hours"
            className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Clock className="w-4 h-4 mr-2" />
            Hours
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Star className="w-4 h-4 mr-2" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {showBookings && (
          <TabsContent value="bookings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <BookingManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
          </TabsContent>
        )}

        {showServices && (
          <TabsContent value="services" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <ServiceManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
          </TabsContent>
        )}

        {showProducts && (
          <TabsContent value="products" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <ProductManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
          </TabsContent>
        )}

         <TabsContent value="photos" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <SalonImageManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
        </TabsContent>

        <TabsContent value="hours" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <SalonHoursManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
             {salonId ? (
                <SalonReviewsManager salonId={salonId} />
             ) : (
                <div className="p-8 text-center text-muted-foreground border rounded-md">
                    <p>Salon ID is missing. Please return to the studio and try again.</p>
                </div>
             )}
        </TabsContent>

      </Tabs>
    </div>
  );
}

export default function PartnerDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>}>
      <PartnerDashboardContent />
    </Suspense>
  );
}
