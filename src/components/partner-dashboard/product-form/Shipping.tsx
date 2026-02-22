"use client"

import { useFormContext, useWatch } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function ShippingSection() {
  const { control, watch, setValue } = useFormContext()
  const freeShipping = watch("freeShipping")
  const productType = watch("productType")
  const regions = watch("shippingRegions") || []
  const [regionInput, setRegionInput] = useState("")

  const addRegion = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
          e.preventDefault()
          const val = regionInput.trim()
          if (val && !regions.includes(val)) {
              setValue("shippingRegions", [...regions, val])
              setRegionInput("")
          }
      }
  }

  const removeRegion = (region: string) => {
      setValue("shippingRegions", regions.filter((r: string) => r !== region))
  }

  if (productType === "DIGITAL") {
      return (
          <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                  Shipping is not applicable for digital products.
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Delivery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="processingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select processing time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1_day">Ships within 24 hours</SelectItem>
                  <SelectItem value="2_3_days">Ships within 2-3 days</SelectItem>
                  <SelectItem value="1_week">Ships within 1 week</SelectItem>
                  <SelectItem value="custom">Made to order (Custom)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
            <FormField
              control={control}
              name="freeShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Free Shipping
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!freeShipping && (
                <FormField
                  control={control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Cost (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            )}
        </div>

        <div className="grid gap-2">
            <FormLabel>Shipping Regions (Press Enter to add)</FormLabel>
            <Input
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                onKeyDown={addRegion}
                placeholder="e.g. India, USA"
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {regions.map((region: string) => (
                    <Badge key={region} variant="secondary" className="gap-1">
                        {region}
                        <button type="button" onClick={() => removeRegion(region)} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>

        <FormField
          control={control}
          name="returnPolicy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_returns">No returns</SelectItem>
                  <SelectItem value="7_days">7-day returns</SelectItem>
                  <SelectItem value="15_days">15-day returns</SelectItem>
                  <SelectItem value="30_days">30-day returns</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="returnConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Conditions</FormLabel>
              <FormControl>
                <Textarea
                    placeholder="e.g. Item must be unused and in original packaging."
                    {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
