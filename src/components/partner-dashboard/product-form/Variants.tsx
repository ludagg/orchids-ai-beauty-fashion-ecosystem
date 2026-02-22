"use client"

import { useFormContext, useFieldArray, useWatch } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2, RefreshCw } from "lucide-react"
import { useEffect } from "react"
import { nanoid } from "nanoid"
import { ImageUpload } from "./ImageUpload"
import { ProductFormValues } from "./schema"

interface VariantsSectionProps {
    salonId: string;
    productId: string;
}

export function VariantsSection({ salonId, productId }: VariantsSectionProps) {
  const { control, register, setValue, getValues } = useFormContext<ProductFormValues>()

  // Field Arrays
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors"
  })

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizes"
  })

  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control,
    name: "variants"
  })

  const colors = useWatch({ control, name: "colors" })
  const sizes = useWatch({ control, name: "sizes" })

  useEffect(() => {
    // Generate combinations
    const currentVariants = getValues("variants") || [];
    const newVariants: any[] = [];

    if (colors && colors.length > 0 && sizes && sizes.length > 0) {
        colors.forEach(color => {
            sizes.forEach(size => {
                // Check if exists
                const existing = currentVariants.find(v => v.colorId === color.id && v.sizeId === size.id);
                if (existing) {
                    newVariants.push(existing);
                } else {
                    newVariants.push({
                        id: nanoid(),
                        name: `${color.name} / ${size.name}`,
                        sku: "",
                        price: (getValues("originalPrice") || 0) + (size.priceAdjustment || 0),
                        stock: 0,
                        colorId: color.id,
                        sizeId: size.id
                    });
                }
            });
        });
    } else if (colors && colors.length > 0) {
         // Only colors
         colors.forEach(color => {
             const existing = currentVariants.find(v => v.colorId === color.id && !v.sizeId);
             if (existing) {
                 newVariants.push(existing);
             } else {
                 newVariants.push({
                     id: nanoid(),
                     name: color.name,
                     sku: "",
                     price: getValues("originalPrice") || 0,
                     stock: color.stock || 0,
                     colorId: color.id
                 });
             }
         });
    } else if (sizes && sizes.length > 0) {
        // Only sizes
        sizes.forEach(size => {
             const existing = currentVariants.find(v => v.sizeId === size.id && !v.colorId);
             if (existing) {
                 newVariants.push(existing);
             } else {
                 newVariants.push({
                     id: nanoid(),
                     name: size.name,
                     sku: "",
                     price: (getValues("originalPrice") || 0) + (size.priceAdjustment || 0),
                     stock: size.stock || 0,
                     sizeId: size.id
                 });
             }
         });
    }

    if (newVariants.length !== currentVariants.length) {
         replaceVariants(newVariants);
    }
  }, [colors?.length, sizes?.length, replaceVariants, getValues]);

  const addColor = () => {
      appendColor({ id: nanoid(), name: "New Color", hex: "#000000", images: [], stock: 0 });
  }

  const addSize = () => {
      appendSize({ id: nanoid(), name: "M", stock: 0, priceAdjustment: 0 });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-4">
                {colorFields.map((field, index) => (
                    <Accordion type="single" collapsible key={field.id} className="border rounded-md px-4">
                        <AccordionItem value={field.id} className="border-0">
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4 flex-1">
                                    <FormLabel className="sr-only">Color Name</FormLabel>
                                    <Input
                                        {...register(`colors.${index}.name`)}
                                        placeholder="Color Name"
                                        className="max-w-[150px]"
                                    />
                                    <Input
                                        type="color"
                                        {...register(`colors.${index}.hex`)}
                                        className="w-12 h-10 p-1 cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                     <AccordionTrigger className="no-underline hover:no-underline">
                                         <span className="text-xs text-muted-foreground mr-2">Images & Details</span>
                                     </AccordionTrigger>
                                     <Button type="button" variant="ghost" size="icon" onClick={() => removeColor(index)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <AccordionContent className="pb-4 space-y-4">
                                {/* Color Specific Images */}
                                <div className="space-y-2">
                                    <FormLabel>Color Variant Photos</FormLabel>
                                    <FormField
                                        control={control}
                                        name={`colors.${index}.images`}
                                        render={({ field: imgField }) => (
                                            <ImageUpload
                                                value={imgField.value || []}
                                                onChange={imgField.onChange}
                                                maxFiles={5}
                                                salonId={salonId}
                                                productId={productId}
                                                type="variant"
                                                variantColor={colors?.[index]?.name || "default"}
                                            />
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ))}
            </div>
            <Button type="button" variant="outline" onClick={addColor} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Color
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                 {sizeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                        <Input
                            {...register(`sizes.${index}.name`)}
                            placeholder="Size (e.g. S, M, 42)"
                        />
                         <Input
                            type="number"
                            {...register(`sizes.${index}.priceAdjustment`)}
                            placeholder="+ Price"
                            className="max-w-[100px]"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(index)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" onClick={addSize} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Size
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Combinations</CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => {
                    // Force regenerate logic could be triggered by clearing and refilling variants
                    // but useEffect handles it.
                }}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {variantFields.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Variant</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>SKU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variantFields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">
                                    <Input {...register(`variants.${index}.name`)} className="border-none shadow-none focus-visible:ring-0 px-0 h-auto font-medium" readOnly />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" {...register(`variants.${index}.price`)} className="w-24" />
                                </TableCell>
                                <TableCell>
                                    <Input type="number" {...register(`variants.${index}.stock`)} className="w-24" />
                                </TableCell>
                                <TableCell>
                                    <Input {...register(`variants.${index}.sku`)} className="w-32" placeholder="SKU" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    Add colors and/or sizes to generate variants.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
