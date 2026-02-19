"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Store, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useBusiness } from "@/hooks/use-business";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(3, "Zip code is required"),
  type: z.enum(["SALON", "BOUTIQUE"], {
    required_error: "Please select a business type",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterBusinessPage() {
  const router = useRouter();
  const { refreshSalon } = useBusiness();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      zipCode: "",
      type: "SALON",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register business");
      }

      toast.success("Business registered successfully!");
      await refreshSalon(); // Refresh context
      router.push("/business");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl bg-background border border-border rounded-[32px] shadow-sm p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">Partner Registration</h1>
          <p className="text-muted-foreground">
            Tell us about your business to get started with Rare.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Business Details
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <input
                    {...form.register("name")}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all"
                    placeholder="e.g. Aura Spa"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Type</label>
                  <select
                    {...form.register("type")}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option value="SALON">Salon (Services)</option>
                    <option value="BOUTIQUE">Boutique (Products)</option>
                  </select>
                  {form.formState.errors.type && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...form.register("description")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all resize-none"
                  placeholder="Tell customers what makes your business special..."
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-red-500 font-medium">{form.formState.errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <input
                  {...form.register("address")}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all"
                  placeholder="Street address"
                />
                {form.formState.errors.address && (
                  <p className="text-xs text-red-500 font-medium">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input
                    {...form.register("city")}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all"
                    placeholder="City"
                  />
                  {form.formState.errors.city && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zip Code</label>
                  <input
                    {...form.register("zipCode")}
                    className="w-full px-4 py-3 rounded-xl bg-muted border-transparent focus:bg-background focus:border-primary outline-none transition-all"
                    placeholder="Zip Code"
                  />
                  {form.formState.errors.zipCode && (
                    <p className="text-xs text-red-500 font-medium">{form.formState.errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Complete Registration
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
