"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag, Trash2, Edit, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { ProductForm } from "./product-form/ProductForm"
import { ProductFormValues } from "./product-form/schema"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductManagerProps {
    salonId: string;
}

export function ProductManager({ salonId }: ProductManagerProps) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"list" | "form">("list")
  const [editingProduct, setEditingProduct] = useState<ProductFormValues & { id: string } | undefined>(undefined)

  useEffect(() => {
    if (salonId) {
        fetchProducts();
    }
  }, [salonId, view]); // Refetch when switching back to list

  const fetchProducts = async () => {
    try {
        const res = await fetch(`/api/salons/${salonId}/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
    } catch (error) {
        console.error(error);
        toast.error("Could not load products");
    } finally {
        setLoading(false);
    }
  };

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

  const handleEdit = (product: any) => {
      // Map API data to form values
      // Ensure dates are Date objects
      const formData: ProductFormValues & { id: string } = {
          ...product,
          saleStartDate: product.saleStartDate ? new Date(product.saleStartDate) : null,
          saleEndDate: product.saleEndDate ? new Date(product.saleEndDate) : null,
          publishDate: product.publishDate ? new Date(product.publishDate) : null,
          // Ensure arrays are arrays
          tags: product.tags || [],
          colors: product.colors || [],
          sizes: product.sizes || [],
          variants: product.variants || [],
          galleryUrls: product.galleryUrls || [],
          shippingRegions: product.shippingRegions || [],
      };
      setEditingProduct(formData);
      setView("form");
  }

  const handleCreate = () => {
      setEditingProduct(undefined);
      setView("form");
  }

  if (view === "form") {
      return (
          <div className="space-y-4">
              <Button variant="ghost" onClick={() => setView("list")} className="gap-2 pl-0">
                  <ArrowLeft className="w-4 h-4" /> Back to Products
              </Button>
              <ProductForm
                salonId={salonId}
                initialData={editingProduct}
                onSuccess={() => {
                    setView("list");
                    fetchProducts();
                }}
              />
          </div>
      )
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
        <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="relative group overflow-hidden border-muted hover:border-primary/50 transition-colors">
             {product.mainImageUrl ? (
                <div className="h-48 w-full overflow-hidden bg-muted">
                    <img src={product.mainImageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
            ) : (
                <div className="h-48 w-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>
            )}

            <CardContent className="p-5">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-1">
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-primary"
                            onClick={() => handleEdit(product)}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit product</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete product</TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-start justify-between mb-2">
                 {product.mainCategory && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                        {product.mainCategory}
                    </span>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
                    product.status === 'ACTIVE' ? 'border-green-200 text-green-700 bg-green-50' :
                    product.status === 'PENDING_REVIEW' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                    'border-muted text-muted-foreground bg-muted/50'
                }`}>
                    {product.status?.replace('_', ' ') || 'DRAFT'}
                </span>
              </div>

              <h4 className="font-semibold truncate text-lg">{product.name}</h4>
              <p className="text-sm text-muted-foreground truncate mb-2">{product.brand}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                    {product.variants?.length > 0
                        ? `${product.variants.length} variants`
                        : `${product.totalStock} in stock`}
                </span>
                <span className="font-bold text-foreground">
                    {/* Price is in cents */}
                    ₹{(product.originalPrice / 100).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
         {products.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No products yet</h3>
                <p className="mb-6 max-w-sm mx-auto">Start building your inventory by adding your first product.</p>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
