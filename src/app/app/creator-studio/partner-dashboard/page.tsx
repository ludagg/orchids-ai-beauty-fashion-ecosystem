"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LayoutDashboard, Scissors, ShoppingBag } from "lucide-react";
import { ServiceManager } from "../components/ServiceManager";
import { ProductManager } from "../components/ProductManager";
import { Suspense, useState, useEffect } from "react";

function PartnerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "SALON";
  const businessName = searchParams.get("businessName") || "My Business";
  const salonId = searchParams.get("salonId");

  // Determine initial active tab based on type
  const [activeTab, setActiveTab] = useState(() => {
    if (type === "BOUTIQUE") return "products";
    return "services";
  });

  const showServices = type === "SALON" || type === "BOTH";
  const showProducts = type === "BOUTIQUE" || type === "BOTH";

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
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto justify-start bg-transparent border-b h-12 p-0 rounded-none mb-6 overflow-x-auto no-scrollbar">
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
        </TabsList>

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
            <ProductManager />
          </TabsContent>
        )}
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
