"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, ShoppingBag, Heart, Check, ChevronLeft, ChevronRight, Share2, Shield, Truck, RotateCcw, MessageCircle, Package, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CartItem, Product } from "@/domains/shop/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";
import { ReviewSection } from "./ReviewSection";
import { RelatedProducts } from "./RelatedProducts";

interface ProductDetailClientProps {
  product: Product
  allProducts: Product[]
  contactInfo?: { whatsapp: string }
}

export default function ProductDetailClient({ product, allProducts, contactInfo }: ProductDetailClientProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (p: Product, variant?: string) => {
    setCart((prev) => {
      const key = p.id + (variant || "");
      const existing = prev.find((i) => i.productId + (i.variant || "") === key);
      if (existing) return prev.map((i) => i.productId + (i.variant || "") === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: p.id, name: p.name, price: p.price, quantity: 1, image: p.images[0], variant }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i).filter((i) => i.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const whatsapp = contactInfo?.whatsapp ?? "+250700000000";
  const whatsappMessage = encodeURIComponent(
    `Hi ${siteConfig.name}! I'd like to order:\n${cart.map((i) => `- ${i.name} x${i.quantity} = RWF ${(i.price * i.quantity).toLocaleString()}`).join("\n")}\nTotal: RWF ${total.toLocaleString()}`
  );

  return (
    <>
      <div className="overflow-x-hidden">
        {/* Breadcrumb */}
        <div className="px-4 pt-6 pb-2 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-brand transition-colors">
              <ArrowLeft className="size-3.5" /> Back to Shop
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        <section className="px-4 pb-16 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 pt-4">
              {/* Image Gallery */}
              <div className="space-y-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
                  <Image
                    src={product.images[imgIndex] || "/shop/board.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIndex((i) => (i - 1 + product.images.length) % product.images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        onClick={() => setImgIndex((i) => (i + 1) % product.images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </>
                  )}
                  {product.comparePrice && (
                    <Badge variant="destructive" className="absolute top-4 left-4 text-[10px] uppercase tracking-wider shadow-md">Sale</Badge>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                          i === imgIndex ? "border-brand opacity-100" : "border-transparent opacity-60 hover:opacity-80"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider self-start mb-3">{product.category}</Badge>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-[1.08]">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`size-3.5 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-slate-200 dark:text-slate-700"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-900 dark:text-white">{product.rating}</span>
                  <span className="text-xs text-slate-400">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl sm:text-3xl font-black text-brand">RWF {product.price.toLocaleString()}</span>
                  {product.comparePrice && (
                    <span className="text-sm text-slate-400 line-through">RWF {product.comparePrice.toLocaleString()}</span>
                  )}
                  {product.comparePrice && (
                    <Badge variant="accent" className="text-[9px]">
                      Save {Math.round((1 - product.price / product.comparePrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{product.description}</p>

                {/* Add to Cart */}
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => addToCart(product)}
                    variant="brand"
                    size="xl"
                    className="flex-1 rounded-xl gap-2 text-sm"
                  >
                    {added ? <><Check className="size-5" /> Added!</> : <><ShoppingCart className="size-5" /> Add to Cart</>}
                  </Button>
                  <Button variant="outline" size="xl" className="rounded-xl">
                    <Heart className="size-5" />
                  </Button>
                  <Button variant="outline" size="xl" className="rounded-xl">
                    <Share2 className="size-5" />
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-3">
                  {[
                    { icon: Shield, label: "Secure Payment", text: "Safe & encrypted" },
                    { icon: Truck, label: "Free Delivery", text: "In Kigali" },
                    { icon: RotateCcw, label: "Easy Returns", text: "7-day policy" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <item.icon className="size-5 mx-auto text-brand mb-1" />
                      <p className="text-[11px] font-bold text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-[9px] text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
              <ReviewSection reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Related Products */}
            <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
              <RelatedProducts current={product} products={allProducts} onAddToCart={(p) => addToCart(p)} />
            </div>
          </div>
        </section>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="size-4 text-brand" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cart ({count})</h2>
                </div>
                <button onClick={() => setCartOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="size-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                      <Package className="size-7 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Your cart is empty</p>
                    <p className="text-xs text-slate-500 mt-1">Add some products to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <motion.div
                        key={item.productId + (item.variant || "")}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3"
                      >
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                          <Image src={item.image || "/shop/board.jpg"} alt={item.name} width={64} height={64} className="object-cover h-full w-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-brand font-bold mt-0.5">RWF {item.price.toLocaleString()}</p>
                          {item.variant && <p className="text-[10px] text-slate-400 mt-0.5">{item.variant}</p>}
                          <div className="flex items-center gap-1.5 mt-2">
                            <button onClick={() => updateQuantity(item.productId, -1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <Minus className="size-2.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, 1)} className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                              <Plus className="size-2.5" />
                            </button>
                            <button onClick={() => removeFromCart(item.productId)} className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-4 flex-shrink-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtotal</span>
                      <span>RWF {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Delivery</span>
                      <span className="text-brand font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total</span>
                      <span>RWF {total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="brand" className="w-full rounded-xl gap-2 h-10 text-xs">
                        <MessageCircle className="size-4" /> Order via WhatsApp
                      </Button>
                    </a>
                    <Button variant="outline" className="w-full rounded-xl gap-2 h-9 text-xs">
                      <Check className="size-3.5" /> Proceed to Checkout
                    </Button>
                  </div>
                  <p className="mt-2 text-[10px] text-center text-slate-400">Secure checkout &bull; Free delivery in Kigali</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
