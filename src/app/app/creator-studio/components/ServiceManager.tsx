"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Scissors, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

interface Service {
  id: string
  name: string
  price: string
  duration: string
}

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([
    { id: "1", name: "Haircut & Style", price: "60", duration: "60 min" },
    { id: "2", name: "Balayage", price: "150", duration: "120 min" },
  ])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" })

  const handleAdd = () => {
    if (!newService.name || !newService.price) return

    setServices([
      ...services,
      { ...newService, id: Math.random().toString(36).substr(2, 9) }
    ])
    setNewService({ name: "", price: "", duration: "" })
    setIsAddOpen(false)
    toast.success("Service added")
  }

  const handleDelete = (id: string) => {
    setServices(services.filter(s => s.id !== id))
    toast.success("Service removed")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h3 className="text-lg font-semibold">Services</h3>
            <p className="text-sm text-muted-foreground">Manage your salon services</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Service Name</Label>
                <Input
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                  placeholder="e.g. Manicure"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Price ($)</Label>
                  <Input
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: e.target.value})}
                    type="number"
                    placeholder="50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Duration</Label>
                  <Input
                    value={newService.duration}
                    onChange={e => setNewService({...newService, duration: e.target.value})}
                    placeholder="e.g. 45 min"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="relative group overflow-hidden border-muted">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Scissors className="w-5 h-5" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(service.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h4 className="font-semibold truncate">{service.name}</h4>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{service.duration}</span>
                <span className="font-medium text-foreground">${service.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/50 rounded-lg border-2 border-dashed">
                <p>No services added yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
