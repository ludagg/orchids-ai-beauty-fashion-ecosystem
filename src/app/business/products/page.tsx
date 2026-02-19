"use client";

import { motion } from "framer-motion";
import {
  Package,
  Plus,
  Search,
  MoreVertical,
  IndianRupee,
  Star,
  CheckCircle2,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Settings,
  Loader2,
  Box
} from "lucide-react";
import { useState, useEffect } from "react";
import { useBusiness } from "@/hooks/use-business";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number; // cents
  stock: number;
  rating: number | null;
  reviews: number | null;
  isActive: boolean;
  images: string[] | null;
  brand?: string;
  description?: string;
};

export default function ProductsPage() {
  const { salon } = useBusiness();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "General",
    brand: "",
    price: 0,
    stock: 1,
    description: "",
    image: "",
  });

  const fetchProducts = async () => {
    if (!salon?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/products?salonId=${salon.id}&includeInactive=true`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [salon?.id]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon?.id) return;

    try {
      setIsSubmitting(true);
      const priceInCents = Math.round(newProduct.price * 100);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonId: salon.id,
          name: newProduct.name,
          category: newProduct.category,
          brand: newProduct.brand,
          price: priceInCents,
          stock: newProduct.stock,
          description: newProduct.description,
          images: newProduct.image ? [newProduct.image] : [],
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add product");
      }

      toast.success("Product added successfully");
      setIsAddOpen(false);
      setNewProduct({
        name: "",
        category: "General",
        brand: "",
        price: 0,
        stock: 1,
        description: "",
        image: "",
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground mt-1">Manage your boutique inventory.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 w-fit">
              <Plus className="w-4 h-4" />
              Add New Product
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new item to your boutique inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g. Luxury Shampoo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    placeholder="e.g. L'Oreal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    placeholder="e.g. Hair Care"
                  />
                </div>
                <div className="space-y-2">
                   <Label htmlFor="image">Image URL</Label>
                    <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://..."
                    />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product details..."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-foreground text-white border-foreground"
                  : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat as string}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-blue-500 outline-none text-sm transition-all text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group p-6 bg-card border border-border rounded-[32px] hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all shadow-sm"
          >
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-[20px] overflow-hidden bg-muted flex-shrink-0 shadow-inner">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground text-lg truncate">{product.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                        product.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground/50'
                      }`}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <p className="text-sm text-blue-500 font-bold uppercase tracking-widest mt-0.5">{product.brand || product.category || "General"}</p>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground/50 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                    <Box className="w-3.5 h-3.5" />
                    {product.stock} units
                  </div>
                  {product.rating && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-muted flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatPrice(product.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 rounded-2xl bg-muted text-foreground hover:bg-blue-600 hover:text-white transition-all group/btn">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-3 rounded-2xl bg-muted text-foreground hover:bg-rose-600 hover:text-white transition-all group/btn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 rounded-2xl bg-foreground text-white text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-foreground/5">
                  View Stats
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Button Card */}
        <motion.button
          onClick={() => setIsAddOpen(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-[32px] border-2 border-dashed border-border hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-4 group shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-muted group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-muted-foreground group-hover:text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-foreground">Add New Product</h3>
            <p className="text-sm text-muted-foreground mt-1">Add a new item to inventory</p>
          </div>
        </motion.button>
      </div>

      {/* Pro Tip */}
      <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-card/10 blur-[60px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-3xl bg-card/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
            <Settings className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-display">Inventory Optimization</h3>
            <p className="text-white/70 mt-2 max-w-xl leading-relaxed">
              Track low stock items automatically. Set reorder points to never miss a sale.
            </p>
          </div>
          <button className="px-8 py-4 rounded-2xl bg-card text-indigo-700 font-bold hover:bg-indigo-50 transition-all active:scale-95 shadow-xl whitespace-nowrap">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
