"use client"

import { useState, useEffect } from "react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Service {
  id: string
  name: string
  price: number // in cents
  duration: number // in minutes
  description?: string | null
  category?: string | null
  image?: string | null
  salonId: string
}

interface ServiceManagerProps {
    salonId: string;
}

export function ServiceManager({ salonId }: ServiceManagerProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)
  const [newService, setNewService] = useState({ name: "", price: "", duration: "", description: "", category: "", image: "" })

  useEffect(() => {
    fetchServices();
  }, [salonId]);

  const fetchServices = async () => {
    try {
        const res = await fetch(`/api/salons/${salonId}/services`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
    } catch (error) {
        console.error(error);
        toast.error("Could not load services");
    } finally {
        setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newService.name || !newService.price || !newService.duration) {
        toast.error("Please fill all fields");
        return;
    }

    setIsSubmitting(true);
    try {
        const priceInCents = Math.round(parseFloat(newService.price) * 100);
        const durationInMin = parseInt(newService.duration);

        if (isNaN(priceInCents) || isNaN(durationInMin)) {
             toast.error("Invalid price or duration");
             return;
        }

        const res = await fetch(`/api/salons/${salonId}/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newService.name,
                price: priceInCents,
                duration: durationInMin,
                description: newService.description,
                category: newService.category,
                image: newService.image
            })
        });

        if (!res.ok) {
             const err = await res.json();
             throw new Error(err.error || "Failed to add service");
        }

        const savedService = await res.json();
        setServices([...services, savedService]);
        setNewService({ name: "", price: "", duration: "", description: "", category: "", image: "" });
        setIsAddOpen(false);
        toast.success("Service added");
    } catch (error: any) {
        toast.error(error.message || "Failed to add service");
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/services/${serviceToDelete}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete service");
        setServices(services.filter(s => s.id !== serviceToDelete));
        toast.success("Service removed");
        setIsDeleteDialogOpen(false);
    } catch (error) {
        toast.error("Could not delete service");
    } finally {
        setIsDeleting(false);
    }
  }

  if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spinner className="w-8 h-8 text-muted-foreground" />
        </div>
      )
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
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  placeholder="Brief description of the service"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input
                      value={newService.category}
                      onChange={e => setNewService({...newService, category: e.target.value})}
                      placeholder="e.g. Nails"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Image URL</Label>
                    <Input
                      value={newService.image}
                      onChange={e => setNewService({...newService, image: e.target.value})}
                      placeholder="https://..."
                      disabled={isSubmitting}
                    />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Price ($)</Label>
                  <Input
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: e.target.value})}
                    type="number"
                    placeholder="50"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Duration (min)</Label>
                  <Input
                    value={newService.duration}
                    onChange={e => setNewService({...newService, duration: e.target.value})}
                    type="number"
                    placeholder="45"
                    min="1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 text-current" />
                      Adding...
                    </>
                  ) : "Add Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="relative group overflow-hidden border-muted">
            {service.image && (
                <div className="h-32 w-full overflow-hidden">
                    <img src={service.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
            )}
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                {!service.image && (
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Scissors className="w-5 h-5" />
                    </div>
                )}
                {service.category && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {service.category}
                    </span>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        onClick={() => { setServiceToDelete(service.id); setIsDeleteDialogOpen(true); }}
                        aria-label={`Delete ${service.name}`}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete service</TooltipContent>
                </Tooltip>
              </div>
              <h4 className="font-semibold truncate">{service.name}</h4>
              {service.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">{service.description}</p>
              )}
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{service.duration} min</span>
                <span className="font-medium text-foreground">${(service.price / 100).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {services.length === 0 && (
            <div className="col-span-full">
                <Empty className="py-12 border-2 border-dashed rounded-xl bg-muted/20">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Scissors className="w-6 h-6 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>No services yet</EmptyTitle>
                        <EmptyDescription>
                            Add your salon services to let clients book them directly.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the service.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Spinner className="mr-2 h-4 w-4 text-destructive-foreground animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
