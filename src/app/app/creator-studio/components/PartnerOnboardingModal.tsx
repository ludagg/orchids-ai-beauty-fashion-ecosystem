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
  const [formData, setFormData] = useState<PartnerData>({
    businessName: "",
    description: "",
    address: "",
    type: "SALON",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.businessName || !formData.description || !formData.address) {
      toast.error("Please fill in all fields")
      return
    }

    onComplete(formData)
    onOpenChange(false)
    toast.success("Welcome, Partner! You can now manage your services and products.")
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Fashion Ave, Paris"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="grid gap-3">
            <Label>Business Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(val) =>
                setFormData({ ...formData, type: val as PartnerType })
              }
              className="grid grid-cols-3 gap-4"
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
            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
