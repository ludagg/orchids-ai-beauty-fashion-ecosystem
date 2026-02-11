"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

// Mock data lookup (in a real app, this would be a fetch)
const products = [
  {
    id: "1",
    title: "Summer Minimalist Dress",
    designer: "Studio Épure",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&h=1000&fit=crop"
    ],
    price: "₹4,999",
    rating: 4.8,
    reviews: 124,
    description: "A timeless minimalist piece crafted from premium sustainable cotton. Designed for maximum comfort without compromising on style. Features a relaxed silhouette and subtle architectural details.",
    details: [
      "100% Organic Cotton",
      "Breathable fabric",
      "Relaxed fit",
      "Sustainable production",
      "Machine washable"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#f5f5dc" },
      { name: "Black", hex: "#1a1a1a" },
      { name: "Olive", hex: "#556b2f" }
    ]
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <Link
        href="/app/marketplace"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <section className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[40px] overflow-hidden bg-[#f5f5f5] border border-[#e5e5e5] shadow-sm"
          >
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  activeImage === i ? "border-[#1a1a1a] shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info */}
        <section className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-rose-600 uppercase tracking-widest">{product.designer}</p>
              <div className="flex gap-2">
                <button className="p-2.5 rounded-full border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors">
                  <Share2 className="w-4 h-4 text-[#6b6b6b]" />
                </button>
                <button className="p-2.5 rounded-full border border-[#e5e5e5] hover:bg-[#f5f5f5] transition-colors">
                  <Heart className="w-4 h-4 text-[#6b6b6b]" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-display tracking-tight text-[#1a1a1a]">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold border border-amber-200/50">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {product.rating}
              </div>
              <p className="text-sm text-[#6b6b6b] font-medium">{product.reviews} verified reviews</p>
            </div>
            <p className="text-3xl font-bold text-[#1a1a1a] mt-4">{product.price}</p>
          </div>

          <p className="text-[#6b6b6b] leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Configuration */}
          <div className="space-y-6 pt-4">
            {/* Color Selection */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#1a1a1a]">Color: <span className="font-normal text-[#6b6b6b]">{selectedColor}</span></p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color.name ? "border-[#1a1a1a] ring-2 ring-[#1a1a1a]/10" : "border-transparent"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <Check className={`w-4 h-4 mx-auto mt-1.5 ${color.name === 'Black' ? 'text-white' : 'text-[#1a1a1a]'}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#1a1a1a]">Select Size</p>
                <button className="text-xs font-bold text-rose-600 hover:underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] h-12 rounded-xl text-sm font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg shadow-black/10"
                        : "bg-white text-[#1a1a1a] border-[#e5e5e5] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#1a1a1a]">Quantity</p>
              <div className="flex items-center w-32 h-12 rounded-xl border border-[#e5e5e5] bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex-1 h-full flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex-1 h-full flex items-center justify-center hover:bg-[#f5f5f5] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex-[2] h-14 rounded-2xl bg-[#1a1a1a] text-white font-bold text-lg hover:bg-[#333] transition-all active:scale-[0.98] shadow-xl shadow-black/10 flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </button>
            <button className="flex-1 h-14 rounded-2xl border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold text-lg hover:bg-[#fafafa] transition-all active:scale-[0.98]">
              Wishlist
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#e5e5e5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#1a1a1a]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#6b6b6b]">Authentic Product</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#1a1a1a]">
                <Truck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#6b6b6b]">Free Shipping</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[#1a1a1a]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-[#6b6b6b]">15 Day Returns</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
