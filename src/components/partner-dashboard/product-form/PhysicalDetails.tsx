"use client"

import { useFormContext, useWatch } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PhysicalDetailsSection() {
  const { control } = useFormContext()
  const productType = useWatch({ control, name: "productType" })

  if (productType === "DIGITAL") {
      return (
          <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                  Physical details are not required for digital products.
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Physical Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="weightGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (g)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="e.g. 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={control}
              name="countryOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country of Origin</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="space-y-2">
            <FormLabel>Dimensions (cm)</FormLabel>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="dimensions.length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Length" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="dimensions.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Width" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="dimensions.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="number" min="0" placeholder="Height" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <FormField
          control={control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material / Fabric</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 100% Cotton" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="careInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Care Instructions</FormLabel>
              <FormControl>
                <Textarea
                    placeholder="e.g. Machine wash cold"
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
