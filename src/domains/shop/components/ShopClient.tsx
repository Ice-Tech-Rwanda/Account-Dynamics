"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import type { Product, CartItem } from "@/domains/shop/domain";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductFilters } from "./ProductFilters";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { CartDrawer } from "./CartDrawer";
import { CART_KEY, WISHLIST_KEY, notifyCartChanged } from "@/lib/cart";

interface Props {
  initialProducts: Product[];
  contactInfo?: { whatsapp: string };
}

export default function ShopClient({ initialProducts, contactInfo }: Props) {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const products = useMemo(() => initialProducts || [], [initialProducts]);

  // hydrate cart + wishlist from localStorage
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(CART_KEY);
        if (raw) setCart(JSON.parse(raw));
        const wl = localStorage.getItem(WISHLIST_KEY);
        if (wl) setWishlist(JSON.parse(wl));
      } catch {
        // ignore
      }
    });
  }, []);

  // debounce search input to reduce re-renders and improve perceived performance
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // persist cart + wishlist
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    notifyCartChanged();
  }, [cart]);

  const filtered = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [search, category, sort, products]);

  // Announce results for screen readers when filtered count changes
  const announce = `${filtered.length} products shown`;

  const addToCart = (product: Product, variant?: string) => {
    setCart((prev) => {
      const key = product.id + (variant || "");
      const existing = prev.find((i) => i.productId + (i.variant || "") === key);
      if (existing) {
        return prev.map((i) =>
          i.productId + (i.variant || "") === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0], variant }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i).filter((i) => i.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]);
  };

  return (
    <div>
      <section className="py-16 sm:py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          {/* Cart button */}
          <div className="flex items-center justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Products</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Browse Collection
              </h2>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cart.reduce((s, i) => s + i.quantity, 0)} items`} 
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand hover:bg-brand/20 transition-all"
            >
              <ShoppingBag className="size-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white shadow-md" aria-live="polite">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </motion.button>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <ProductFilters
              products={products}
              search={searchInput}
              category={category}
              sort={sort}
              onSearchChange={(v) => setSearchInput(v)}
              onCategoryChange={setCategory}
              onSortChange={setSort}
              onReset={() => { setSearchInput(""); setSearch(""); setCategory("all"); setSort("default") }}
            />
            {/* ARIA live region for announcements */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
              {announce}
            </div>
          </div>

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  onAddToCart={addToCart}
                  onQuickView={setQuickView}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No products match your filters"
              description="Try adjusting your search, category, or sort options."
              action={
                <button
                  onClick={() => { setSearch(""); setSearchInput(""); setCategory("all"); setSort("default") }}
                  className="text-xs text-brand font-medium hover:underline"
                >
                  Clear all filters
                </button>
              }
            />
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickView}
        onClose={() => setQuickView(null)}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        isWishlisted={quickView ? wishlist.includes(quickView.id) : false}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        contactInfo={contactInfo}
      />
    </div>
  );
}
