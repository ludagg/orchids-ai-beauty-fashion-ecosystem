"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, User, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface StaffMember {
  id: string;
  name: string;
  role: string | null;
  image: string | null;
  bio: string | null;
  isActive: boolean;
  services: { serviceId: string; service: { id: string; name: string } }[];
}

interface Service {
  id: string;
  name: string;
}

interface StaffManagerProps {
  salonId: string;
}

export function StaffManager({ salonId }: StaffManagerProps) {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    bio: "",
    serviceIds: [] as string[],
  });

  useEffect(() => {
    Promise.all([fetchStaff(), fetchServices()]).finally(() => setLoading(false));
  }, [salonId]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`/api/salons/${salonId}/staff`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data);
      }
    } catch (error) {
      console.error("Failed to fetch staff", error);
      toast.error("Failed to load staff");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`/api/salons/${salonId}/services`);
      if (res.ok) {
        const data = await res.json();
        setServicesList(data);
      }
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  const handleOpenDialog = (staff?: StaffMember) => {
    if (staff) {
      setEditingStaff(staff);
      setFormData({
        name: staff.name,
        role: staff.role || "",
        image: staff.image || "",
        bio: staff.bio || "",
        serviceIds: staff.services.map((s) => s.serviceId),
      });
    } else {
      setEditingStaff(null);
      setFormData({
        name: "",
        role: "",
        image: "",
        bio: "",
        serviceIds: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const isSelected = prev.serviceIds.includes(serviceId);
      if (isSelected) {
        return { ...prev, serviceIds: prev.serviceIds.filter((id) => id !== serviceId) };
      } else {
        return { ...prev, serviceIds: [...prev.serviceIds, serviceId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setSubmitting(true);
    try {
      const url = editingStaff
        ? `/api/salons/${salonId}/staff/${editingStaff.id}`
        : `/api/salons/${salonId}/staff`;

      const method = editingStaff ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save staff");
      }

      await fetchStaff(); // Refresh list
      setIsDialogOpen(false);
      toast.success(editingStaff ? "Staff updated" : "Staff added");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;

    try {
      const res = await fetch(`/api/salons/${salonId}/staff/${staffId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setStaffList(staffList.filter((s) => s.id !== staffId));
      toast.success("Staff member removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete staff");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="group relative flex flex-col items-center p-6 rounded-xl border bg-card hover:shadow-md transition-all"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => handleOpenDialog(staff)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(staff.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Avatar className="w-24 h-24 mb-4 border-2 border-border">
              <AvatarImage src={staff.image || ""} alt={staff.name} className="object-cover" />
              <AvatarFallback>
                <User className="w-10 h-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            <h4 className="font-bold text-lg text-foreground text-center">{staff.name}</h4>
            <p className="text-sm text-muted-foreground font-medium mb-2">{staff.role || "Staff Member"}</p>

            {staff.bio && (
                <p className="text-sm text-muted-foreground text-center line-clamp-2 mb-4 px-2">
                    {staff.bio}
                </p>
            )}

            <div className="flex flex-wrap justify-center gap-1 mt-auto w-full">
              {staff.services.length > 0 ? (
                staff.services.slice(0, 3).map((s) => (
                  <Badge key={s.serviceId} variant="secondary" className="text-[10px]">
                    {s.service.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">No services assigned</span>
              )}
              {staff.services.length > 3 && (
                <Badge variant="outline" className="text-[10px]">
                  +{staff.services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        ))}

        {staffList.length === 0 && (
          <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
            <User className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium">No staff members yet</p>
            <p className="text-sm">Add your team members to let clients book them directly.</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Julie"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Senior Stylist"
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Photo URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief introduction..."
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label>Assigned Services</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-md">
                {servicesList.length === 0 ? (
                    <p className="text-sm text-muted-foreground col-span-2 text-center py-4">No services available. Create services first.</p>
                ) : (
                    servicesList.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                        id={`service-${service.id}`}
                        checked={formData.serviceIds.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label
                        htmlFor={`service-${service.id}`}
                        className="text-sm font-normal cursor-pointer"
                        >
                        {service.name}
                        </Label>
                    </div>
                    ))
                )}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingStaff ? "Save Changes" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
