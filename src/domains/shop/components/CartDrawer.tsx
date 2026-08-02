"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus, MessageCircle, Trash2, Package, Check } from "lucide-react";
import type { CartItem } from "@/domains/shop/domain";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

interface Props {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemove: (productId: string) => void
  contactInfo?: { whatsapp: string }
}

export function CartDrawer({ open, onClose, items, onUpdateQuantity, onRemove, contactInfo }: Props) {
  const whatsapp = contactInfo?.whatsapp ?? "+250700000000";

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const whatsappMessage = encodeURIComponent(
    `Hi ${siteConfig.name}! I'd like to order:\n${items.map((i) => `- ${i.name} x${i.quantity} = RWF ${(i.price * i.quantity).toLocaleString()}`).join("\n")}\nTotal: RWF ${total.toLocaleString()}`
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-brand" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cart ({count})</h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-4 text-slate-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                    <Package className="size-7 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Your cart is empty</p>
                  <p className="text-xs text-slate-500 mt-1">Add some products to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
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
                        {item.variant && (
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.variant}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.productId, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Minus className="size-2.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.productId, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Plus className="size-2.5" />
                          </button>
                          <button
                            onClick={() => onRemove(item.productId)}
                            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
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
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="brand" className="w-full rounded-xl gap-2 h-10 text-xs">
                      <MessageCircle className="size-4" /> Order via WhatsApp
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full rounded-xl gap-2 h-9 text-xs">
                    <Check className="size-3.5" /> Proceed to Checkout
                  </Button>
                </div>
                <p className="mt-2 text-[10px] text-center text-slate-400">
                  Secure checkout &bull; Free delivery in Kigali
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}