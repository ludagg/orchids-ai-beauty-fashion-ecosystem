'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession, authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBusinessAction } from '../actions';
import { Scissors, ShoppingBag, CheckCircle2, ChevronRight, ChevronLeft, Building2, MapPin, Hash, Phone, Loader2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [businessData, setBusinessData] = useState({
    type: searchParams.get('type') || 'SALON', // 'SALON' | 'BOUTIQUE'
    name: '',
    siret: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    description: ''
  });

  // Automatically skip step 1 if logged in
  useEffect(() => {
    if (!isSessionLoading && session?.user) {
       if (step === 1) setStep(2);
    }
  }, [session, isSessionLoading, step]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: authData.email,
        password: authData.password,
        name: authData.name,
        // We can't set role directly here easily unless allowed by config,
        // but we'll handle role assignment in the final step via server action
        // or update it after signup.
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      toast.success("Account created!");
      // The session will update, triggering the useEffect to move to step 2
      // But we might need to wait for auto-login
      // better-auth usually auto-logs in after signup.
    } catch (err) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async () => {
    if (!businessData.name || !businessData.siret || !businessData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await createBusinessAction({
        ...businessData,
        // If user is just created, session might not be ready in server action context immediately
        // if we rely on cookies that are just set.
        // But usually it's fine.
      });

      if (result.success) {
        toast.success("Business created successfully!");
        router.push('/salon-dashboard'); // Redirect to dashboard
      } else {
        toast.error(result.error || "Failed to create business");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isSessionLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between relative px-4">
           <div className="absolute left-0 top-1/2 w-full h-1 bg-border -z-10 rounded-full" />
           <div className={`absolute left-0 top-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }} />

           {[1, 2, 3, 4].map((s) => (
             <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all ${
               step >= s ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted text-muted-foreground'
             }`}>
               {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
             </div>
           ))}
        </div>

        <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-xl"
        >
          {/* Step 1: Account */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold font-display">Create your Partner Account</h2>
                <p className="text-muted-foreground">Join the Rare professional network.</p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={authData.email}
                    onChange={(e) => setAuthData({...authData, email: e.target.value})}
                    placeholder="partner@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                        type="password"
                        value={authData.password}
                        onChange={(e) => setAuthData({...authData, password: e.target.value})}
                        placeholder="••••••••"
                        required
                        minLength={8}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                        type="password"
                        value={authData.confirmPassword}
                        onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                        placeholder="••••••••"
                        required
                    />
                    </div>
                </div>

                <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <a href="/auth?mode=signin&redirect=/business/onboarding" className="text-primary hover:underline">Log in</a>
                </p>
              </form>
            </div>
          )}

          {/* Step 2: Type Selection */}
          {step === 2 && (
            <div className="space-y-8">
               <div className="text-center">
                <h2 className="text-2xl font-bold font-display">What kind of partner are you?</h2>
                <p className="text-muted-foreground">Select the category that best fits your business.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <button
                    onClick={() => setBusinessData({...businessData, type: 'SALON'})}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-primary group ${businessData.type === 'SALON' ? 'border-primary bg-primary/5' : 'border-border'}`}
                 >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${businessData.type === 'SALON' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
                        <Scissors className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Salon / Spa</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        I offer beauty services, appointments, and treatments.
                    </p>
                 </button>

                 <button
                    onClick={() => setBusinessData({...businessData, type: 'BOUTIQUE'})}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-primary group ${businessData.type === 'BOUTIQUE' ? 'border-primary bg-primary/5' : 'border-border'}`}
                 >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${businessData.type === 'BOUTIQUE' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">Boutique / Brand</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        I sell beauty products, cosmetics, or fashion items.
                    </p>
                 </button>
              </div>

              <div className="flex justify-between">
                 {/* No back button here if session exists, but let's allow going back conceptually or logout */}
                 <Button variant="ghost" onClick={() => {}}>
                    {/* Placeholder */}
                 </Button>
                 <Button onClick={() => setStep(3)} className="gap-2">
                    Next Step <ChevronRight className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <div className="space-y-6">
               <div className="text-center">
                <h2 className="text-2xl font-bold font-display">Tell us about your business</h2>
                <p className="text-muted-foreground">We need a few details to verify your establishment.</p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label>Business Name</Label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={businessData.name}
                            onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
                            className="pl-10"
                            placeholder="e.g. Rare Beauty Salon"
                        />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>SIRET / Registration Number</Label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={businessData.siret}
                            onChange={(e) => setBusinessData({...businessData, siret: e.target.value})}
                            className="pl-10"
                            placeholder="14-digit SIRET number"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Required for professional verification.</p>
                 </div>

                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                        value={businessData.description}
                        onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                        placeholder="A short tagline for your business"
                    />
                 </div>
              </div>

              <div className="flex justify-between pt-4">
                 <Button variant="outline" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                 </Button>
                 <Button onClick={() => setStep(4)} disabled={!businessData.name || !businessData.siret}>
                    Next Step <ChevronRight className="w-4 h-4" />
                 </Button>
              </div>
            </div>
          )}

          {/* Step 4: Address & Contact */}
          {step === 4 && (
             <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-display">Where can customers find you?</h2>
                    <p className="text-muted-foreground">Your location and contact details.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={businessData.address}
                                onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                                className="pl-10"
                                placeholder="123 Fashion Street"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                value={businessData.city}
                                onChange={(e) => setBusinessData({...businessData, city: e.target.value})}
                                placeholder="Paris"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Zip Code</Label>
                            <Input
                                value={businessData.zipCode}
                                onChange={(e) => setBusinessData({...businessData, zipCode: e.target.value})}
                                placeholder="75001"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={businessData.phone}
                                onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                                className="pl-10"
                                placeholder="+33 1 23 45 67 89"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 text-sm text-muted-foreground">
                    <p>By clicking "Submit", you agree to our Partner Terms of Service. Your application will be reviewed within 24 hours.</p>
                </div>

                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(3)} disabled={loading}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={handleBusinessSubmit} disabled={loading || !businessData.address || !businessData.city} className="min-w-[140px]">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                    </Button>
                </div>
             </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
