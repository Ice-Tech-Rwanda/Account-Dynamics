"use client";

import { useEffect, useState } from "react";

export const CART_KEY = "it_cart_v1";
export const WISHLIST_KEY = "it_wishlist_v1";
export const CART_EVENT = "it:cart-changed";

export function getCartCount(): number {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const items = JSON.parse(raw) as { quantity?: number }[];
    return items.reduce((n, i) => n + (Number(i.quantity) || 1), 0);
  } catch {
    return 0;
  }
}

export function notifyCartChanged() {
  window.dispatchEvent(new Event(CART_EVENT));
}

export function useCartCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount());
    update();
    window.addEventListener(CART_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return count;
}
