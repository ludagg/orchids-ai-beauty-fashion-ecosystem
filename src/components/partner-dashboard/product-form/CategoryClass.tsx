"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CATEGORIES: Record<string, string[]> = {
  "Clothing": ["Dresses", "Tops", "Pants", "Skirts", "Coats", "Jackets", "Activewear", "Swimwear", "Underwear"],
  "Beauty & Skincare": ["Moisturizers", "Serums", "Cleansers", "Masks", "Sunscreen", "Eye Care", "Lip Care"],
  "Hair Care": ["Shampoo", "Conditioner", "Hair Masks", "Hair Oil", "Styling", "Tools"],
  "Nail Care": ["Nail Polish", "Nail Art", "Nail Care", "Tools"],
  "Fragrances": ["Perfume", "Body Mist", "Deodorant"],
  "Accessories": ["Bags", "Jewelry", "Belts", "Scarves", "Sunglasses", "Hats", "Watches"],
  "Wellness": ["Supplements", "Massage", "Aromatherapy", "Other"],
  "Other": ["Other"]
}

export function CategorySection() {
  const { control, watch, setValue } = useFormContext()
  const mainCategory = watch("mainCategory")
  const subcategories = mainCategory ? (CATEGORIES[mainCategory] || []) : []
  const tags = watch("tags") || []
  const [tagInput, setTagInput] = useState("")

  const addTag = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
          e.preventDefault()
          const val = tagInput.trim()
          if (val && !tags.includes(val) && tags.length < 10) {
              setValue("tags", [...tags, val])
              setTagInput("")
          }
      }
  }

  const removeTag = (tag: string) => {
      setValue("tags", tags.filter((t: string) => t !== tag))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category & Classification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="mainCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Category</FormLabel>
                  <Select onValueChange={(val) => {
                      field.onChange(val);
                      setValue("subcategory", ""); // Reset subcategory
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(CATEGORIES).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!mainCategory}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <FormField
          control={control}
          name="productType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PHYSICAL" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Physical product (requires shipping)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="DIGITAL" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Digital product (no shipping)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2">
            <FormLabel>Tags (Press Enter to add)</FormLabel>
            <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="e.g. Summer, Cotton, Handmade"
                disabled={tags.length >= 10}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            {tags.length >= 10 && <p className="text-xs text-muted-foreground">Max 10 tags reached.</p>}
        </div>

      </CardContent>
    </Card>
  )
}
