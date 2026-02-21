"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PartnerLanding from "./PartnerLanding";
import PartnerRegistrationForm from "@/app/become-partner/PartnerRegistrationForm";

interface PartnerWrapperProps {
  user: any; // Using any for now to match the existing user prop type in form
}

export default function PartnerWrapper({ user }: PartnerWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldStart = searchParams.get('start') === 'true';

  const [view, setView] = useState<'landing' | 'form'>('landing');

  useEffect(() => {
    if (shouldStart && user) {
        setView('form');
    }
  }, [shouldStart, user]);

  const handleStart = () => {
    if (!user) {
      // Store intention to register by adding query param
      router.push("/auth?callbackUrl=/become-partner?start=true");
    } else {
      setView('form');
    }
  };

  if (view === 'landing') {
    return <PartnerLanding onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <PartnerRegistrationForm user={user} />
      </div>
    </div>
  );
}
