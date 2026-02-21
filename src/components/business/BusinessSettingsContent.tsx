"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Image as ImageIcon, Settings } from "lucide-react";
import { SalonImageManager } from "@/components/partner-dashboard/SalonImageManager";
import { SalonHoursManager } from "@/components/partner-dashboard/SalonHoursManager";

interface BusinessSettingsContentProps {
  salonId: string;
}

export default function BusinessSettingsContent({ salonId }: BusinessSettingsContentProps) {
  const [activeTab, setActiveTab] = useState("hours");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Salon Settings</h1>
      </div>
      <p className="text-muted-foreground">Manage your opening hours and gallery.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto justify-start bg-transparent border-b h-12 p-0 rounded-none mb-6">
          <TabsTrigger
            value="hours"
            className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <Clock className="w-4 h-4 mr-2" />
            Opening Hours
          </TabsTrigger>
          <TabsTrigger
            value="photos"
            className="flex-1 md:flex-none min-w-[120px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-medium transition-all"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
           <SalonHoursManager salonId={salonId} />
        </TabsContent>

        <TabsContent value="photos" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
           <SalonImageManager salonId={salonId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
