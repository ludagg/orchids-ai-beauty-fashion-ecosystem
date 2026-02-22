"use client"

import { useState, useEffect, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productFormSchema, ProductFormValues } from "./schema"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { nanoid } from "nanoid"

import { BasicInfoSection } from "./BasicInfo"
import { CategorySection } from "./CategoryClass"
import { PricingStockSection } from "./PricingStock"
import { VariantsSection } from "./Variants"
import { MediaSection } from "./Media"
import { PhysicalDetailsSection } from "./PhysicalDetails"
import { ShippingSection } from "./Shipping"
import { SeoVisibilitySection } from "./SeoVisibility"

interface ProductFormProps {
    salonId: string;
    initialData?: ProductFormValues & { id?: string };
    onSuccess?: () => void;
}

export function ProductForm({ salonId, initialData, onSuccess }: ProductFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeTab, setActiveTab] = useState("basic")
    const [draftStatus, setDraftStatus] = useState<"saved" | "saving" | "error" | null>(null)

    // Generate draft ID if new product
    const [draftId] = useState(() => initialData?.id || nanoid())
    const isCreatedRef = useRef(!!initialData?.id);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: initialData || {
            name: "",
            brand: "",
            description: "",
            mainCategory: "",
            subcategory: "",
            productType: "PHYSICAL",
            originalPrice: 0,
            totalStock: 0,
            trackInventory: true,
            lowStockThreshold: 5,
            visibility: "DRAFT",
            featured: false,
            freeShipping: false,
            colors: [],
            sizes: [],
            variants: [],
            galleryUrls: [],
            tags: [],
            shippingRegions: []
        },
        mode: "onChange"
    })

    const { formState, watch, handleSubmit, getValues } = form
    const { isDirty, isValid } = formState

    // Auto-save logic
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (type === 'change') {
                setDraftStatus("saving");
                const timer = setTimeout(() => {
                    handleAutoSave(value);
                }, 2000); // 2 seconds debounce
                return () => clearTimeout(timer);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const handleAutoSave = async (data: any) => {
        if (!data.name) return;

        try {
            const isUpdate = isCreatedRef.current;
            const url = isUpdate
                ? `/api/products/${draftId}`
                : `/api/salons/${salonId}/products`;

            const method = isUpdate ? "PATCH" : "POST";

            const payload = { ...data };
            if (!isUpdate) {
                (payload as any).id = draftId;
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                 throw new Error("Auto-save failed");
            }

            // Mark as created after successful POST
            if (!isUpdate) {
                isCreatedRef.current = true;
            }

            setDraftStatus("saved");
        } catch (error) {
            console.error("Auto-save failed", error);
            setDraftStatus("error");
        }
    };

    // Manual Submit (Publish or Save Draft)
    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true)
        try {
            const isUpdate = isCreatedRef.current;
            const url = isUpdate
                ? `/api/products/${draftId}`
                : `/api/salons/${salonId}/products`;

            const method = isUpdate ? "PATCH" : "POST";

            const payload = { ...data };
            if (!isUpdate) {
                (payload as any).id = draftId;
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save product");
            }

            if (!isUpdate) {
                isCreatedRef.current = true;
            }

            toast.success("Product saved successfully");
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {initialData ? "Edit Product" : "Add New Product"}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Fill in the details below. {draftStatus === 'saved' && <span className="text-green-600 flex items-center gap-1 inline-flex"><CheckCircle2 className="w-3 h-3"/> Saved</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" type="button" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Update Product" : "Create Product"}
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b h-12 p-0 rounded-none overflow-x-auto no-scrollbar flex">
                        <TabsTrigger value="basic" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Basic</TabsTrigger>
                        <TabsTrigger value="category" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Category</TabsTrigger>
                        <TabsTrigger value="pricing" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Pricing</TabsTrigger>
                        <TabsTrigger value="variants" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Variants</TabsTrigger>
                        <TabsTrigger value="media" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Media</TabsTrigger>
                        <TabsTrigger value="physical" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Physical</TabsTrigger>
                        <TabsTrigger value="shipping" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">Shipping</TabsTrigger>
                        <TabsTrigger value="seo" className="flex-none min-w-[80px] h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground transition-all">SEO</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-6">
                        <TabsContent value="basic">
                            <BasicInfoSection />
                        </TabsContent>
                        <TabsContent value="category">
                            <CategorySection />
                        </TabsContent>
                        <TabsContent value="pricing">
                            <PricingStockSection />
                        </TabsContent>
                        <TabsContent value="variants">
                            <VariantsSection salonId={salonId} productId={draftId} />
                        </TabsContent>
                        <TabsContent value="media">
                            <MediaSection salonId={salonId} productId={draftId} />
                        </TabsContent>
                        <TabsContent value="physical">
                            <PhysicalDetailsSection />
                        </TabsContent>
                        <TabsContent value="shipping">
                            <ShippingSection />
                        </TabsContent>
                        <TabsContent value="seo">
                            <SeoVisibilitySection />
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                     <Button type="button" variant="ghost" onClick={() => {
                         // Simple logic for tabs navigation could be added here
                     }}>
                        Previous
                     </Button>
                     <Button type="button" onClick={() => {
                         // Simple logic for tabs navigation could be added here
                     }}>
                        Next
                     </Button>
                </div>
            </form>
        </FormProvider>
    )
}
