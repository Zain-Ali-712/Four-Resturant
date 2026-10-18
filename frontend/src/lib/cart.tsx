"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { getItem } from "./menu";

// Frontend-only cart for the pitch. Persists per browser; there is no backend yet.

export type CartLine = { id: string; qty: number };

type CartContextValue = {
  lines: (CartLine & { name: string; price: number; from: boolean; image: string | null })[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  lastAdded: { id: string; at: number } | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "four-cart-v1";
const EMPTY: CartLine[] = [];

// A tiny external store over localStorage. The server snapshot is always empty, and
// useSyncExternalStore swaps in the saved cart after hydration without a mismatch.
let lines: CartLine[] | null = null;
const listeners = new Set<() => void>();

function read(): CartLine[] {
  if (lines) return lines;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    lines = Array.isArray(saved) ? saved.filter((l) => getItem(l?.id) && l.qty > 0) : EMPTY;
  } catch {
    lines = EMPTY;
  }
  return lines!;
}

function write(next: CartLine[]) {
  lines = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null);

  const add = useCallback((id: string, qty = 1) => {
    const prev = read();
    const found = prev.find((l) => l.id === id);
    write(found ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l)) : [...prev, { id, qty }]);
    setLastAdded({ id, at: Date.now() });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const prev = read();
    write(qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  }, []);

  const clear = useCallback(() => write([]), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = raw.flatMap((l) => {
      const item = getItem(l.id);
      return item ? [{ ...l, name: item.name, price: item.price, from: item.from, image: item.image }] : [];
    });
    return {
      lines: resolved,
      count: resolved.reduce((n, l) => n + l.qty, 0),
      subtotal: resolved.reduce((n, l) => n + l.qty * l.price, 0),
      open,
      setOpen,
      add,
      setQty,
      clear,
      lastAdded,
    };
  }, [raw, open, add, setQty, clear, lastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
