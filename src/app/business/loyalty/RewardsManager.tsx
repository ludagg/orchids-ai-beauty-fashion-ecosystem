"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Tag, Percent, ShoppingBag, Ticket } from "lucide-react";
import { useForm } from "react-hook-form";

interface Reward {
    id: string;
    name: string;
    description: string | null;
    cost: number;
    type: string;
    value: number | null;
    quantity: number | null;
    isActive: boolean | null;
    createdAt: Date | string | null;
}

interface RewardsManagerProps {
    salonId: string;
    initialRewards: Reward[];
}

export function RewardsManager({ salonId, initialRewards }: RewardsManagerProps) {
    const [rewards, setRewards] = useState(initialRewards);
    const [isOpen, setIsOpen] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm({
        defaultValues: {
            name: "",
            description: "",
            cost: 100,
            type: "discount_percent",
            value: 10,
            quantity: undefined as number | undefined
        }
    });

    useEffect(() => {
        register("type");
    }, [register]);

    const onSubmit = async (data: any) => {
        try {
            const res = await fetch(`/api/salons/${salonId}/rewards`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    cost: parseInt(data.cost),
                    value: data.value ? parseInt(data.value) : undefined,
                    quantity: data.quantity ? parseInt(data.quantity) : undefined
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create reward");
            }

            const newReward = await res.json();
            setRewards([newReward, ...rewards]);
            setIsOpen(false);
            reset();
            toast.success("Reward created successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        // Implement delete logic (API call needed)
        // For now, just optimistically update or show toast
        toast.info("Deleting rewards is not implemented in this demo.");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Active Rewards</CardTitle>
                        <CardDescription>Rewards currently available to your customers</CardDescription>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Reward
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Reward</DialogTitle>
                                <DialogDescription>Offer something special to your loyal customers.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Reward Name</Label>
                                    <Input id="name" {...register("name", { required: true })} placeholder="e.g. 10% Off Next Booking" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" {...register("description")} placeholder="Details about the reward..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cost">Point Cost</Label>
                                        <Input id="cost" type="number" {...register("cost", { required: true, min: 1 })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Type</Label>
                                        <Select onValueChange={(val) => setValue("type", val)} defaultValue="discount_percent">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="discount_percent">Percentage Discount</SelectItem>
                                                <SelectItem value="discount_fixed">Fixed Amount Off</SelectItem>
                                                <SelectItem value="free_service">Free Service</SelectItem>
                                                <SelectItem value="product">Free Product</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="value">Value (if applicable)</Label>
                                        <Input id="value" type="number" {...register("value")} placeholder="e.g. 10 for 10%" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity Limit (Optional)</Label>
                                        <Input id="quantity" type="number" {...register("quantity")} placeholder="Leave empty for unlimited" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>Create Reward</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rewards.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No rewards created yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rewards.map((reward) => (
                                    <TableRow key={reward.id}>
                                        <TableCell className="font-medium">
                                            {reward.name}
                                            {reward.description && <p className="text-xs text-muted-foreground line-clamp-1">{reward.description}</p>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {reward.type.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{reward.cost} pts</TableCell>
                                        <TableCell>{reward.quantity === null ? '∞' : reward.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(reward.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
