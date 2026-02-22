"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function PricingStockSection() {
  const { control, watch } = useFormContext()
  const trackInventory = watch("trackInventory")
  const originalPrice = watch("originalPrice")
  const salePrice = watch("salePrice")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing & Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="originalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormDescription>Base selling price.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price (₹) (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="1" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>
                    {originalPrice && field.value && parseFloat(field.value) < parseFloat(originalPrice)
                        ? "Discounted price shown."
                        : "Leave empty if not on sale."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {salePrice && (
            <div className="grid grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                <FormField
                  control={control}
                  name="saleStartDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Sale Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="saleEndDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Sale End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                  <FormControl>
                    <Input placeholder="Auto-generated if empty" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="totalStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} disabled={!trackInventory} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="flex items-center space-x-2">
            <FormField
              control={control}
              name="trackInventory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Track Inventory
                    </FormLabel>
                    <FormDescription>
                      Automatically reduce stock when orders are placed.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
        </div>

        {trackInventory && (
            <FormField
              control={control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Alert Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormDescription>
                    Get notified when stock falls below this number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}
      </CardContent>
    </Card>
  )
}
