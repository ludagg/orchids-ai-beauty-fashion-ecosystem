"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Loader2, Upload, FileText, CheckCircle2, MapPin, X,
    User, Building2, FileCheck, Check, ChevronRight,
    Mail, Phone, Globe, Building, Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Schema (matching API)
const partnerSchema = z.object({
  personal: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(8, "Phone number is required"),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
  }),
  business: z.object({
    name: z.string().min(2, "Business name is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().max(500, "Description too long"),
    website: z.string().optional(),
    logo: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().min(3, "Zip code is required"),
  }),
  docs: z.object({
    registrationNumber: z.string().min(2, "Registration number is required"),
    idUrl: z.string().url("ID document is required"),
    proofUrl: z.string().url("Business proof is required"),
  }),
  gallery: z.array(z.string().url()).min(2, "Minimum 2 photos required").max(10, "Maximum 10 photos allowed"),
  legal: z.object({
    terms: z.boolean().refine(val => val === true, "You must accept the terms"),
    confirm: z.boolean().refine(val => val === true, "You must confirm accuracy"),
  })
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const categories = [
  "Hair Salon", "Nail Bar", "Spa", "Barbershop", "Fashion Store",
  "Beauty Store", "Makeup Artist", "Other"
];

const STEPS = [
    { id: 1, label: "Personal Info", icon: User, description: "Your details" },
    { id: 2, label: "Business Details", icon: Building2, description: "About your salon" },
    { id: 3, label: "Location", icon: MapPin, description: "Address & Map" },
    { id: 4, label: "Documents", icon: FileCheck, description: "Verification" },
    { id: 5, label: "Review", icon: CheckCircle2, description: "Final check" },
];

export default function PartnerRegistrationForm({ user }: { user: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // key being uploaded

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      personal: {
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        profilePhoto: user?.image || "",
      },
      business: {
        name: "",
        category: "",
        description: "",
        website: "",
        logo: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      docs: {
        registrationNumber: "",
        idUrl: "",
        proofUrl: "",
      },
      gallery: [],
      legal: {
        terms: false,
        confirm: false,
      }
    }
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = form;
  const formData = watch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: any, type: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        toast.error("File size too large (max 10MB)");
        return;
    }

    setUploading(fieldPath);
    const data = new FormData();
    data.append("file", file);
    data.append("type", type);

    try {
        const res = await fetch("/api/upload/partner", {
            method: "POST",
            body: data,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        setValue(fieldPath, url);
        toast.success("File uploaded!");
    } catch (error) {
        console.error(error);
        toast.error("Upload failed. Please try again.");
    } finally {
        setUploading(null);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      if (formData.gallery.length + files.length > 10) {
          toast.error("Maximum 10 photos allowed");
          return;
      }

      setUploading("gallery");
      const urls: string[] = [];

      try {
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const data = new FormData();
              data.append("file", file);
              data.append("type", "image");

              const res = await fetch("/api/upload/partner", {
                  method: "POST",
                  body: data,
              });

              if (res.ok) {
                  const { url } = await res.json();
                  urls.push(url);
              }
          }

          setValue("gallery", [...formData.gallery, ...urls]);
          toast.success(`${urls.length} photos uploaded!`);
      } catch (error) {
          console.error(error);
          toast.error("Some uploads failed.");
      } finally {
          setUploading(null);
      }
  };

  const removeGalleryImage = (index: number) => {
      const newGallery = [...formData.gallery];
      newGallery.splice(index, 1);
      setValue("gallery", newGallery);
  };

  const nextStep = async () => {
      let valid = false;
      if (step === 1) valid = await trigger("personal");
      if (step === 2) valid = await trigger("business");
      if (step === 3) valid = await trigger("address");
      if (step === 4) valid = await trigger("docs");

      if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data: PartnerFormData) => {
      setLoading(true);
      try {
          const res = await fetch("/api/salons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });

          if (!res.ok) {
              const err = await res.json();
              throw new Error(err.error || "Failed to submit application");
          }

          toast.success("Application submitted successfully!");
          router.push("/business");
      } catch (error: any) {
          toast.error(error.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-card rounded-[32px] shadow-sm overflow-hidden border border-border min-h-[600px]">
        <div className="grid lg:grid-cols-12 min-h-[600px]">
            {/* Sidebar / Stepper */}
            <div className="lg:col-span-4 bg-muted/30 p-8 lg:border-r border-border">
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Registration</h2>
                    <p className="text-sm text-muted-foreground">Complete these steps to become a partner.</p>
                </div>

                <div className="space-y-2">
                    {STEPS.map((s) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isCompleted = step > s.id;

                        return (
                            <div
                                key={s.id}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
                                    isActive ? "bg-background shadow-sm border border-border" : "text-muted-foreground"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors border",
                                    isActive ? "bg-primary text-primary-foreground border-primary" :
                                    isCompleted ? "bg-emerald-500 text-white border-emerald-500" : "bg-background border-border"
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className={cn("text-sm font-semibold", isActive && "text-foreground")}>{s.label}</p>
                                    <p className="text-xs text-muted-foreground">{s.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Form Area */}
            <div className="lg:col-span-8 p-8 lg:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-8">

                    {/* Header for current step */}
                    <div className="space-y-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step + "-header"}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-3xl font-display font-bold">{STEPS[step - 1].label}</h2>
                                <p className="text-muted-foreground text-lg">
                                    {step === 1 && "Tell us about yourself, the business owner."}
                                    {step === 2 && "Tell us about your business and services."}
                                    {step === 3 && "Where can customers find you?"}
                                    {step === 4 && "Upload official documents to verify your business."}
                                    {step === 5 && "Please review your information and accept the terms."}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >

                            {/* STEP 1: PERSONAL INFO */}
                            {step === 1 && (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="personal.name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="personal.name" className="pl-9" {...register("personal.name")} disabled />
                                        </div>
                                        {errors.personal?.name && <p className="text-red-500 text-sm">{errors.personal.name.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="personal.email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="personal.email" className="pl-9" {...register("personal.email")} disabled />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="personal.phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="personal.phone" className="pl-9" {...register("personal.phone")} placeholder="+1 234 567 890" />
                                        </div>
                                        {errors.personal?.phone && <p className="text-red-500 text-sm">{errors.personal.phone.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Profile Photo</Label>
                                        <div className="flex items-center gap-4">
                                            {formData.personal.profilePhoto ? (
                                                <img src={formData.personal.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                                    <User className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, "personal.profilePhoto", "image")}
                                                    disabled={uploading === "personal.profilePhoto"}
                                                    className="cursor-pointer file:cursor-pointer"
                                                />
                                                <p className="text-xs text-muted-foreground mt-1">Recommended: Square JPG/PNG, max 5MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: BUSINESS INFO */}
                            {step === 2 && (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="business.name">Business Name</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="business.name" className="pl-9" {...register("business.name")} placeholder="e.g. Luxe Salon" />
                                        </div>
                                        {errors.business?.name && <p className="text-red-500 text-sm">{errors.business.name.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="business.category">Category</Label>
                                        <Select onValueChange={(val) => setValue("business.category", val)} defaultValue={formData.business.category}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.business?.category && <p className="text-red-500 text-sm">{errors.business.category.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="business.description">Description</Label>
                                        <Textarea
                                            id="business.description"
                                            {...register("business.description")}
                                            placeholder="Describe your services and what makes your business unique..."
                                            className="h-24"
                                        />
                                        <p className="text-xs text-muted-foreground text-right">{formData.business.description.length}/500</p>
                                        {errors.business?.description && <p className="text-red-500 text-sm">{errors.business.description.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="business.website">Website (Optional)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="business.website" className="pl-9" {...register("business.website")} placeholder="https://example.com" />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Business Logo</Label>
                                        <div className="flex items-center gap-4">
                                            {formData.business.logo ? (
                                                <img src={formData.business.logo} alt="Logo" className="w-16 h-16 rounded-lg object-contain border bg-white" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center border border-dashed">
                                                    <span className="text-xs text-muted-foreground">No Logo</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e, "business.logo", "image")}
                                                    disabled={uploading === "business.logo"}
                                                    className="cursor-pointer file:cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Gallery Photos (Min 2, Max 10)</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                                            {formData.gallery.map((url, i) => (
                                                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group">
                                                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(i)}
                                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.gallery.length < 10 && (
                                                <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer bg-muted/20 transition-colors">
                                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                                    <span className="text-xs text-muted-foreground font-medium">Add Photos</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleGalleryUpload}
                                                        disabled={uploading === "gallery"}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {errors.gallery && <p className="text-red-500 text-sm">{errors.gallery.message}</p>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: ADDRESS */}
                            {step === 3 && (
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="address.street">Street Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="address.street" className="pl-9" {...register("address.street")} placeholder="123 Main St" />
                                        </div>
                                        {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="address.city">City</Label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="address.city" className="pl-9" {...register("address.city")} placeholder="New York" />
                                            </div>
                                            {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address.state">State / Region</Label>
                                            <Input id="address.state" {...register("address.state")} placeholder="NY" />
                                            {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="address.zipCode">Postal Code</Label>
                                            <div className="relative">
                                                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="address.zipCode" className="pl-9" {...register("address.zipCode")} placeholder="10001" />
                                            </div>
                                            {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address.country">Country</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input id="address.country" className="pl-9" {...register("address.country")} placeholder="United States" />
                                            </div>
                                            {errors.address?.country && <p className="text-red-500 text-sm">{errors.address.country.message}</p>}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p>We will use this address to automatically detect your location on the map so customers nearby can find you.</p>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: DOCUMENTS */}
                            {step === 4 && (
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="docs.registrationNumber">Business Registration Number (SIRET, EIN, etc.)</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="docs.registrationNumber" className="pl-9" {...register("docs.registrationNumber")} placeholder="Enter registration number" />
                                        </div>
                                        {errors.docs?.registrationNumber && <p className="text-red-500 text-sm">{errors.docs.registrationNumber.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Owner ID Document (Passport / Driver's License)</Label>
                                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors">
                                            {formData.docs.idUrl ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    <span>ID Document Uploaded</span>
                                                    <button type="button" onClick={() => setValue("docs.idUrl", "")} className="text-xs text-red-500 underline ml-2">Change</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileText className="w-10 h-10 text-muted-foreground mb-3" />
                                                    <p className="text-sm font-medium mb-1">Click to upload ID Document</p>
                                                    <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 10MB)</p>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => handleFileUpload(e, "docs.idUrl", "document")}
                                                        disabled={uploading === "docs.idUrl"}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        {uploading === "docs.idUrl" && <p className="text-xs text-primary animate-pulse">Uploading...</p>}
                                        {errors.docs?.idUrl && <p className="text-red-500 text-sm">{errors.docs.idUrl.message}</p>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Business Proof (Utility Bill / Registration Cert)</Label>
                                        <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors relative">
                                            {formData.docs.proofUrl ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    <span>Business Proof Uploaded</span>
                                                    <button type="button" onClick={() => setValue("docs.proofUrl", "")} className="text-xs text-red-500 underline ml-2">Change</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileText className="w-10 h-10 text-muted-foreground mb-3" />
                                                    <p className="text-sm font-medium mb-1">Click to upload Business Proof</p>
                                                    <p className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 10MB)</p>
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => handleFileUpload(e, "docs.proofUrl", "document")}
                                                        disabled={uploading === "docs.proofUrl"}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        {uploading === "docs.proofUrl" && <p className="text-xs text-primary animate-pulse">Uploading...</p>}
                                        {errors.docs?.proofUrl && <p className="text-red-500 text-sm">{errors.docs.proofUrl.message}</p>}
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: LEGAL */}
                            {step === 5 && (
                                <div className="space-y-4">
                                    <div className="bg-muted/30 p-6 rounded-xl space-y-4 text-sm">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-muted-foreground">Business:</span>
                                            <span className="col-span-2 font-semibold">{formData.business.name} ({formData.business.category})</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-muted-foreground">Owner:</span>
                                            <span className="col-span-2 font-semibold">{formData.personal.name}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-muted-foreground">Address:</span>
                                            <span className="col-span-2">{formData.address.street}, {formData.address.city}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="legal.terms"
                                                checked={formData.legal.terms}
                                                onCheckedChange={(c) => setValue("legal.terms", c === true)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="legal.terms"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    I agree to the <span className="text-primary underline cursor-pointer">Partner Terms & Conditions</span>
                                                </label>
                                            </div>
                                        </div>
                                        {errors.legal?.terms && <p className="text-red-500 text-sm ml-7">{errors.legal.terms.message}</p>}

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="legal.confirm"
                                                checked={formData.legal.confirm}
                                                onCheckedChange={(c) => setValue("legal.confirm", c === true)}
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label
                                                    htmlFor="legal.confirm"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    I confirm that all provided information is accurate and I am authorized to represent this business.
                                                </label>
                                            </div>
                                        </div>
                                        {errors.legal?.confirm && <p className="text-red-500 text-sm ml-7">{errors.legal.confirm.message}</p>}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between pt-8 border-t">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={prevStep}
                            disabled={step === 1 || loading}
                            className={step === 1 ? "invisible" : ""}
                        >
                            Back
                        </Button>

                        {step < 5 ? (
                            <Button type="button" onClick={nextStep} disabled={loading} className="px-8">
                                Next Step
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={loading || !formData.legal.terms || !formData.legal.confirm} className="px-8">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}
