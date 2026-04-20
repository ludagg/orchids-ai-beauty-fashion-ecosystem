"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PartnerType, PartnerData } from "@/components/profile/PartnerOnboardingModal"

export default function BusinessRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PartnerData>({
    businessName: "",
    description: "",
    address: "",
    city: "",
    zipCode: "",
    type: "SALON",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName || !formData.description || !formData.address || !formData.city || !formData.zipCode) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/salons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.businessName,
          description: formData.description,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          type: formData.type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create business");
      }

      const data = await response.json()

      toast.success("Welcome, Partner! You can now manage your business.")
      router.push("/business")
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Register your Business</h1>
        <p className="text-muted-foreground mt-2">
           Join Priisme to manage your salon or boutique and reach more customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="grid gap-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="e.g. Luxe Salon & Spa"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your business..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address Line 1</Label>
            <Input
              id="address"
              placeholder="123 Fashion Ave"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Paris"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="75001"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label>Business Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(val) =>
                setFormData({ ...formData, type: val as PartnerType })
              }
              className="grid grid-cols-3 gap-4"
              disabled={loading}
            >
              <div>
                <RadioGroupItem value="SALON" id="salon" className="peer sr-only" />
                <Label
                  htmlFor="salon"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                >
                  <span className="text-sm font-semibold">Salon</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="BOUTIQUE" id="boutique" className="peer sr-only" />
                <Label
                  htmlFor="boutique"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                >
                  <span className="text-sm font-semibold">Boutique</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="BOTH" id="both" className="peer sr-only" />
                <Label
                  htmlFor="both"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                >
                  <span className="text-sm font-semibold">Both</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Creating..." : "Create Business Profile"}
          </Button>
      </form>
    </div>
  )
}
