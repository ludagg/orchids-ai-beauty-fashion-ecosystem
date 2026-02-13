"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag, Trash2 } from "lucide-react"
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

interface Product {
  id: string
  name: string
  price: string
  stock: string
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Silk Hair Serum", price: "45", stock: "12" },
    { id: "2", name: "Organic Shampoo", price: "32", stock: "24" },
  ])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" })

  const handleAdd = () => {
    if (!newProduct.name || !newProduct.price) return

    setProducts([
      ...products,
      { ...newProduct, id: Math.random().toString(36).substr(2, 9) }
    ])
    setNewProduct({ name: "", price: "", stock: "" })
    setIsAddOpen(false)
    toast.success("Product added")
  }

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
    toast.success("Product removed")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <p className="text-sm text-muted-foreground">Manage your boutique inventory</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Silk Serum"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Price ($)</Label>
                  <Input
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    type="number"
                    placeholder="45"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Stock</Label>
                  <Input
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                    type="number"
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="relative group overflow-hidden border-muted">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ShoppingBag className="w-5 h-5" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(product.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h4 className="font-semibold truncate">{product.name}</h4>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{product.stock} in stock</span>
                <span className="font-medium text-foreground">${product.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
         {products.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/50 rounded-lg border-2 border-dashed">
                <p>No products added yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
