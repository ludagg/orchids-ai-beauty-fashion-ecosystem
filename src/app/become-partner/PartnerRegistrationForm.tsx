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
import { Loader2, Upload, FileText, CheckCircle2, MapPin, X } from "lucide-react";

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
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${(step / 5) * 100}%` }}
            />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* STEP 1: PERSONAL INFO */}
        {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Personal Information</h2>
                    <p className="text-muted-foreground">Tell us about yourself, the business owner.</p>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="personal.name">Full Name</Label>
                        <Input id="personal.name" {...register("personal.name")} disabled />
                        {errors.personal?.name && <p className="text-red-500 text-sm">{errors.personal.name.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="personal.email">Email Address</Label>
                        <Input id="personal.email" {...register("personal.email")} disabled />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="personal.phone">Phone Number</Label>
                        <Input id="personal.phone" {...register("personal.phone")} placeholder="+1 234 567 890" />
                        {errors.personal?.phone && <p className="text-red-500 text-sm">{errors.personal.phone.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Profile Photo</Label>
                        <div className="flex items-center gap-4">
                            {formData.personal.profilePhoto ? (
                                <img src={formData.personal.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                                    <UserIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, "personal.profilePhoto", "image")}
                                    disabled={uploading === "personal.profilePhoto"}
                                />
                                <p className="text-xs text-muted-foreground mt-1">Recommended: Square JPG/PNG, max 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 2: BUSINESS INFO */}
        {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Business Details</h2>
                    <p className="text-muted-foreground">Tell us about your business.</p>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="business.name">Business Name</Label>
                        <Input id="business.name" {...register("business.name")} placeholder="e.g. Luxe Salon" />
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
                        <Input id="business.website" {...register("business.website")} placeholder="https://example.com" />
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
            </div>
        )}

        {/* STEP 3: ADDRESS */}
        {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Location</h2>
                    <p className="text-muted-foreground">Where can customers find you?</p>
                </div>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="address.street">Street Address</Label>
                        <Input id="address.street" {...register("address.street")} placeholder="123 Main St" />
                        {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address.city">City</Label>
                            <Input id="address.city" {...register("address.city")} placeholder="New York" />
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
                            <Input id="address.zipCode" {...register("address.zipCode")} placeholder="10001" />
                            {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address.country">Country</Label>
                            <Input id="address.country" {...register("address.country")} placeholder="United States" />
                            {errors.address?.country && <p className="text-red-500 text-sm">{errors.address.country.message}</p>}
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>We will use this address to automatically detect your location on the map so customers nearby can find you.</p>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 4: DOCUMENTS */}
        {step === 4 && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Verification Documents</h2>
                    <p className="text-muted-foreground">Upload official documents to verify your business.</p>
                </div>

                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="docs.registrationNumber">Business Registration Number (SIRET, EIN, etc.)</Label>
                        <Input id="docs.registrationNumber" {...register("docs.registrationNumber")} placeholder="Enter registration number" />
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
             </div>
        )}

        {/* STEP 5: LEGAL */}
        {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Review & Confirm</h2>
                    <p className="text-muted-foreground">Please review your information and accept the terms.</p>
                </div>

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

        <div className="flex justify-between pt-8 border-t">
            {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                    Back
                </Button>
            ) : (
                <div />
            )}

            {step < 5 ? (
                <Button type="button" onClick={nextStep} disabled={loading}>
                    Next Step
                </Button>
            ) : (
                <Button type="submit" disabled={loading || !formData.legal.terms || !formData.legal.confirm}>
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
  );
}

function UserIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
