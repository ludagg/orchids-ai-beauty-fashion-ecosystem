"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

type Salon = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  zipCode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  image: string | null;
  type: "SALON" | "BOUTIQUE" | "BOTH";
  openingHours: any[]; // Define more strictly if needed
  images: any[];
};

type BusinessContextType = {
  salon: Salon | null;
  loading: boolean;
  refreshSalon: () => Promise<void>;
};

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchSalon = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/salons/mine");
      if (res.status === 401) {
        // Not logged in
        // Middleware usually handles this, but just in case
        return;
      }
      if (res.status === 404) {
        setSalon(null);
      } else if (res.ok) {
        const data = await res.json();
        setSalon(data);
      }
    } catch (error) {
      console.error("Failed to fetch salon", error);
      toast.error("Failed to load business profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalon();
  }, []);

  return (
    <BusinessContext.Provider value={{ salon, loading, refreshSalon: fetchSalon }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
