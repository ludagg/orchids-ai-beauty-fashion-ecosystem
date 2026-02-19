"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Store, Scissors, ArrowRight, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Schemas
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const businessSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "Zip Code is required"),
  type: z.enum(["salon", "shop"]),
});

type UserFormData = z.infer<typeof userSchema>;
type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as "salon" | "shop" | null;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState<"salon" | "shop">(initialType || "salon");

  // Forms
  const { register: registerUser, handleSubmit: handleSubmitUser, formState: { errors: userErrors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  });

  const { register: registerBusiness, handleSubmit: handleSubmitBusiness, setValue: setBusinessValue, formState: { errors: businessErrors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
        type: initialType || "salon"
    }
  });

  useEffect(() => {
    if (initialType) {
        setBusinessType(initialType);
        setBusinessValue("type", initialType);
    }
  }, [initialType, setBusinessValue]);


  const onUserSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        // We set the role implicitly via callback or just user for now,
        // but typically better-auth might not allow setting role directly on signup without admin.
        // For this demo, we assume the API creation step will check user and maybe upgrade role or we rely on logic.
        // Actually, better-auth with drizzle adapter usually defaults to 'user'.
        // We might need a way to set role.
        // If we can't set role on signup, we might need a separate API call or hook.
        // Let's proceed with signup first.
      });

      if (error) {
        toast.error(error.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Login is usually automatic or requires verification.
      // Assuming automatic for now or we just proceed to step 2 (session might take a moment)
      // We will wait a bit or try to sign in.

      // Let's try to sign in immediately just in case
       await authClient.signIn.email({
         email: data.email,
         password: data.password,
       });

      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const onBusinessSubmit = async (data: BusinessFormData) => {
    setIsLoading(true);
    try {
      const endpoint = data.type === "salon" ? "/api/salons" : "/api/shops";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: data.name,
            description: data.description,
            address: data.address,
            city: data.city,
            zipCode: data.zipCode,
            // image: ... (skip image upload for now)
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create business");
      }

      // Success
      toast.success(`${data.type === 'salon' ? 'Salon' : 'Shop'} created successfully!`);

      // Redirect to dashboard (mock path for now as dashboard migration is next task)
      // But for now let's go to business home or app
      setTimeout(() => {
          router.push("/app");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create business");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold mb-2">Join Rare for Business</h1>
            <p className="text-muted-foreground">Step {step} of 2</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{step === 1 ? "Create your account" : "Business Details"}</CardTitle>
                <CardDescription>
                    {step === 1
                        ? "First, let's get you set up with a partner account."
                        : `Tell us about your ${businessType}.`
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <form onSubmit={handleSubmitUser(onUserSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...registerUser("name")} placeholder="John Doe" />
                            {userErrors.name && <p className="text-xs text-red-500">{userErrors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...registerUser("email")} placeholder="john@example.com" />
                            {userErrors.email && <p className="text-xs text-red-500">{userErrors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...registerUser("password")} />
                            {userErrors.password && <p className="text-xs text-red-500">{userErrors.password.message}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : "Continue"}
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmitBusiness(onBusinessSubmit)} className="space-y-4">
                         {/* Type Selector (if not fixed) */}
                         <div className="grid grid-cols-2 gap-4 mb-6">
                            <div
                                onClick={() => { setBusinessType("salon"); setBusinessValue("type", "salon"); }}
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${businessType === 'salon' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                            >
                                <Scissors className={`w-6 h-6 ${businessType === 'salon' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="font-medium text-sm">Salon</span>
                            </div>
                            <div
                                onClick={() => { setBusinessType("shop"); setBusinessValue("type", "shop"); }}
                                className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${businessType === 'shop' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                            >
                                <Store className={`w-6 h-6 ${businessType === 'shop' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="font-medium text-sm">Shop</span>
                            </div>
                         </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input id="businessName" {...registerBusiness("name")} placeholder={businessType === 'salon' ? "Luxe Hair Studio" : "Chic Boutique"} />
                            {businessErrors.name && <p className="text-xs text-red-500">{businessErrors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...registerBusiness("description")} placeholder="Tell us about your business..." />
                            {businessErrors.description && <p className="text-xs text-red-500">{businessErrors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...registerBusiness("address")} placeholder="123 Main St" />
                            {businessErrors.address && <p className="text-xs text-red-500">{businessErrors.address.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...registerBusiness("city")} placeholder="Paris" />
                                {businessErrors.city && <p className="text-xs text-red-500">{businessErrors.city.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input id="zipCode" {...registerBusiness("zipCode")} placeholder="75001" />
                                {businessErrors.zipCode && <p className="text-xs text-red-500">{businessErrors.zipCode.message}</p>}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : "Complete Registration"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
