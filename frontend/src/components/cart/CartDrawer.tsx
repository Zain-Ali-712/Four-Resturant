"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/menu";
import { getLenis } from "@/components/motion/SmoothScroll";
import { FoodImage } from "@/components/menu/FoodImage";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, count } = useCart();

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-paper shadow-2xl"
            data-lenis-prevent
          >
            <div className="flex items-center justify-between bg-red px-6 py-5 text-cream">
              <h2 className="display text-3xl">Your order</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="grid size-10 place-items-center rounded-full hover:bg-cream/10">
                <X />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <ShoppingBag className="size-12 text-red/40" />
                <p className="script text-3xl text-red">Your tray is empty</p>
                <p className="text-ink/60">Pick something from the menu and it lands here.</p>
                <Link href="/menu" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-red px-6 py-3 font-bold text-cream">
                  Browse the menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.id} layout exit={{ opacity: 0, x: 60 }} className="flex gap-4 py-4">
                        <FoodImage src={l.image} alt={l.name} sizes="80px" className="size-20 shrink-0 rounded-2xl [&_.script]:text-xs [&_svg]:h-6" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold leading-tight">{l.name}</p>
                          <p className="text-sm text-ink/60">
                            {l.from ? "Starting size · " : ""}
                            {formatPKR(l.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Remove one ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15 hover:border-red hover:text-red">
                              <Minus className="size-4" />
                            </button>
                            <span className="w-5 text-center font-bold tabular-nums">{l.qty}</span>
                            <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Add one ${l.name}`} className="grid size-8 place-items-center rounded-full border border-ink/15 hover:border-red hover:text-red">
                              <Plus className="size-4" />
                            </button>
                          </div>
                        </div>
                        <p className="font-bold tabular-nums">{formatPKR(l.qty * l.price)}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="space-y-4 border-t border-ink/10 bg-cream-warm px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-ink/70">
                      Subtotal · {count} item{count === 1 ? "" : "s"}
                    </span>
                    <span className="display text-3xl text-red">{formatPKR(subtotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="block rounded-full bg-red py-4 text-center text-lg font-bold text-cream transition hover:bg-red-hot"
                  >
                    Checkout
                  </Link>
                  <p className="text-center text-xs text-ink/50">Ordering straight from FOUR&apos;s kitchen.</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
