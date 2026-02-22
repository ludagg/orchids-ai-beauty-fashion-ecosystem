import { z } from "zod";

export const productFormSchema = z.object({
  id: z.string().optional(), // For updates
  name: z.string().min(1, "Product name is required").max(150, "Max 150 characters"),
  brand: z.string().min(1, "Brand name is required"),
  description: z.string().min(1, "Description is required").max(2000, "Max 2000 characters"),
  shortDescription: z.string().max(200, "Max 200 characters").optional(),

  mainCategory: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  productType: z.enum(["PHYSICAL", "DIGITAL"]),
  tags: z.array(z.string()).max(10, "Max 10 tags").optional(),

  originalPrice: z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  saleStartDate: z.date().optional().nullable(),
  saleEndDate: z.date().optional().nullable(),
  sku: z.string().optional(),
  totalStock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  trackInventory: z.boolean().default(true),

  // Dynamic Variants
  colors: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Color name required"),
    hex: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex code"),
    images: z.array(z.string().url()).optional(), // URLs
    stock: z.coerce.number().int().min(0).default(0) // Stock for this color if no sizes
  })).optional(),

  sizes: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Size name required"),
    stock: z.coerce.number().int().min(0).default(0),
    priceAdjustment: z.coerce.number().int().default(0) // cents
  })).optional(),

  variants: z.array(z.object({
    id: z.string(),
    name: z.string(), // e.g. "Red / L"
    sku: z.string().optional(),
    price: z.coerce.number().int().min(0),
    stock: z.coerce.number().int().min(0),
    colorId: z.string().optional(),
    sizeId: z.string().optional()
  })).optional(),

  // Media
  mainImageUrl: z.string().url("Main image is required"),
  galleryUrls: z.array(z.string().url()).min(2, "At least 2 gallery images required").max(10),
  videoUrl: z.string().url().optional().nullable(),

  // Physical
  weightGrams: z.coerce.number().int().min(0).optional(),
  dimensions: z.object({
    length: z.coerce.number().min(0).optional(),
    width: z.coerce.number().min(0).optional(),
    height: z.coerce.number().min(0).optional(),
  }).optional(),
  material: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  careInstructions: z.string().optional(),

  // Shipping
  processingTime: z.string().optional(),
  shippingRegions: z.array(z.string()).optional(),
  freeShipping: z.boolean().default(false),
  shippingCost: z.coerce.number().min(0).optional(),
  returnPolicy: z.string().optional(),
  returnConditions: z.string().optional(),

  // SEO
  slug: z.string().optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  visibility: z.enum(["PUBLIC", "DRAFT", "SCHEDULED"]).default("DRAFT"),
  publishDate: z.date().optional().nullable(),
  featured: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
