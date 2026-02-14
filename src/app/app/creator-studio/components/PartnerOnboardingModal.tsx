"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export type PartnerType = "SALON" | "BOUTIQUE" | "BOTH"

export interface PartnerData {
  businessName: string
  description: string
  address: string
  city: string
  zipCode: string
  type: PartnerType
}

interface PartnerOnboardingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: PartnerData) => void
}

export function PartnerOnboardingModal({
  isOpen,
  onOpenChange,
  onComplete,
}: PartnerOnboardingModalProps) {
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

    if (formData.businessName.length < 2) {
      toast.error("Business name must be at least 2 characters long")
      return
    }

    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long")
      return
    }

    if (formData.address.length < 5) {
      toast.error("Address must be at least 5 characters long")
      return
    }

    if (formData.city.length < 2) {
      toast.error("City must be at least 2 characters long")
      return
    }

    if (formData.zipCode.length < 3) {
      toast.error("Zip code must be at least 3 characters long")
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
        throw new Error(errorData.error || "Failed to create salon");
      }

      const data = await response.json()

      onComplete(formData)
      onOpenChange(false)
      toast.success("Welcome, Partner! You can now manage your services and products.")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Become a Partner</DialogTitle>
          <DialogDescription>
            Join our network of salons and boutiques. Fill out your business details to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
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
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Complete Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
