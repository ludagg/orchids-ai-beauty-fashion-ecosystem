"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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

interface Variant {
    name: string
    price: string
    stock: string
}

interface Product {
  id: string
  name: string
  price: number // cents
  stock: number
  hasVariants: boolean
  variants?: any[]
  image?: string
  images?: string[]
  category?: string
  salonId: string
}

interface ProductManagerProps {
    salonId: string;
}

export function ProductManager({ salonId }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", description: "", category: "", brand: "", image: "" })
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([])
  const [currentVariant, setCurrentVariant] = useState<Variant>({ name: "", price: "", stock: "" })

  useEffect(() => {
    if (salonId) {
        fetchProducts();
    }
  }, [salonId]);

  const fetchProducts = async () => {
    try {
        // Attempt to fetch from shops API first since products are now linked to shops
        let res = await fetch(`/api/shops/${salonId}/products`);
        if (!res.ok) {
             // Fallback or retry if needed, but for now we assume salonId passed is actually shopId
             // or we might need to handle the case where it fails.
             // If this component is used for a "Salon" that has products (legacy), this might fail.
             throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
    } catch (error) {
        console.error(error);
        toast.error("Could not load products");
    } finally {
        setLoading(false);
    }
  };

  const addVariant = () => {
      if (!currentVariant.name || !currentVariant.price || !currentVariant.stock) {
          toast.error("Fill variant details");
          return;
      }
      setVariants([...variants, currentVariant]);
      setCurrentVariant({ name: "", price: "", stock: "" });
  };

  const removeVariant = (index: number) => {
      setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAdd = async () => {
    if (!newProduct.name) {
        toast.error("Product name is required");
        return;
    }

    if (!hasVariants && (!newProduct.price || !newProduct.stock)) {
         toast.error("Price and Stock are required");
         return;
    }

    if (hasVariants && variants.length === 0) {
        toast.error("Add at least one variant");
        return;
    }

    setIsSubmitting(true);
    try {
        const priceInCents = hasVariants ? 0 : Math.round(parseFloat(newProduct.price) * 100);
        const stockInt = hasVariants ? 0 : parseInt(newProduct.stock);

        const formattedVariants = variants.map(v => ({
            name: v.name,
            price: Math.round(parseFloat(v.price) * 100),
            stock: parseInt(v.stock),
            options: JSON.stringify({ name: v.name }) // Simple option storage
        }));

        // Note: We use shopId here (passed as salonId prop for now)
        const res = await fetch(`/api/shops/${salonId}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newProduct.name,
                price: priceInCents,
                stock: stockInt,
                description: newProduct.description,
                category: newProduct.category,
                brand: newProduct.brand,
                images: newProduct.image ? [newProduct.image] : [],
                variants: hasVariants ? formattedVariants : undefined
            })
        });

        if (!res.ok) {
             const err = await res.json();
             throw new Error(err.error || "Failed to add product");
        }

        const savedProduct = await res.json();
        setProducts([savedProduct, ...products]); // Add to top

        // Reset form
        setNewProduct({ name: "", price: "", stock: "", description: "", category: "", brand: "", image: "" });
        setHasVariants(false);
        setVariants([]);
        setIsAddOpen(false);
        toast.success("Product added");
    } catch (error: any) {
        toast.error(error.message || "Failed to add product");
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
        const res = await fetch(`/api/products/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
             throw new Error("Failed to delete product");
        }

        setProducts(products.filter(p => p.id !== id))
        toast.success("Product removed")
    } catch (error) {
        toast.error("Could not delete product");
    }
  }

  if (loading) {
      return <div className="text-center py-8 text-muted-foreground">Loading products...</div>
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
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Silk Serum"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product description"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label>Category</Label>
                    <Input
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="e.g. Hair Care"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Brand</Label>
                    <Input
                      value={newProduct.brand}
                      onChange={e => setNewProduct({...newProduct, brand: e.target.value})}
                      placeholder="e.g. Luxe"
                      disabled={isSubmitting}
                    />
                  </div>
              </div>

              <div className="grid gap-2">
                <Label>Image URL</Label>
                <Input
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                  <Switch checked={hasVariants} onCheckedChange={setHasVariants} id="has-variants" />
                  <Label htmlFor="has-variants">This product has variants (Size, Color)</Label>
              </div>

              {!hasVariants ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Price ($)</Label>
                      <Input
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        type="number"
                        placeholder="45"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Stock</Label>
                      <Input
                        value={newProduct.stock}
                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                        type="number"
                        placeholder="10"
                        min="0"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
              ) : (
                  <div className="space-y-4 border rounded-md p-3 bg-muted/20">
                      <div className="text-sm font-medium">Variants</div>
                      <div className="grid grid-cols-3 gap-2">
                          <Input
                              placeholder="Name (e.g. Red / S)"
                              value={currentVariant.name}
                              onChange={e => setCurrentVariant({...currentVariant, name: e.target.value})}
                          />
                          <Input
                              placeholder="Price"
                              type="number"
                              value={currentVariant.price}
                              onChange={e => setCurrentVariant({...currentVariant, price: e.target.value})}
                          />
                          <div className="flex gap-2">
                              <Input
                                  placeholder="Stock"
                                  type="number"
                                  value={currentVariant.stock}
                                  onChange={e => setCurrentVariant({...currentVariant, stock: e.target.value})}
                              />
                              <Button type="button" size="icon" onClick={addVariant}><Plus className="w-4 h-4"/></Button>
                          </div>
                      </div>

                      <div className="space-y-2">
                          {variants.map((v, i) => (
                              <div key={i} className="flex items-center justify-between text-sm bg-background p-2 rounded border">
                                  <span>{v.name}</span>
                                  <div className="flex items-center gap-3">
                                      <span>${v.price}</span>
                                      <span className="text-muted-foreground">Qty: {v.stock}</span>
                                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeVariant(i)}>
                                          <X className="w-3 h-3" />
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="relative group overflow-hidden border-muted">
             {product.images && product.images.length > 0 && (
                <div className="h-32 w-full overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
            )}
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                {(!product.images || product.images.length === 0) && (
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                )}
                 {product.category && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {product.category}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                    onClick={() => handleDelete(product.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <h4 className="font-semibold truncate">{product.name}</h4>
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>{product.hasVariants ? `${product.variants?.length || 0} variants` : `${product.stock} in stock`}</span>
                <span className="font-medium text-foreground">
                    {product.hasVariants && product.variants && product.variants.length > 0
                        ? `From $${(Math.min(...product.variants.map((v: any) => v.price)) / 100).toFixed(2)}`
                        : `$${(product.price / 100).toFixed(2)}`
                    }
                </span>
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
