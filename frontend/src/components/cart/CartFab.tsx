"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPKR } from "@/lib/menu";
import { FoodImage } from "@/components/menu/FoodImage";

/**
 * Floating tray in the bottom-right corner. It shows up once something is in the
 * order, so the cart is visible while people browse, and opens the full cart drawer.
 */
export function CartFab() {
  const { count, subtotal, lines, open, setOpen, lastAdded } = useCart();
  const pathname = usePathname();
  const show = count > 0 && !open && !pathname.startsWith("/checkout");
  const thumbs = lines.slice(-3).reverse();

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open your order: ${count} item${count === 1 ? "" : "s"}, ${formatPKR(subtotal)}`}
          initial={{ y: 120, scale: 0.6, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 120, scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="group fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-cream shadow-[0_24px_50px_-14px_rgba(28,13,14,.7)] ring-1 ring-cream/10 sm:right-6 sm:bottom-6"
        >
          {/* Bounces each time something is added. */}
          <motion.span
            key={lastAdded?.at}
            animate={lastAdded ? { rotate: [0, -16, 12, -6, 0], scale: [1, 1.18, 1] } : undefined}
            transition={{ duration: 0.6 }}
            className="relative grid size-12 place-items-center rounded-full bg-red"
          >
            <ShoppingBag className="size-5" strokeWidth={2.4} />
            <motion.span
              key={count}
              initial={{ scale: 1.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 14 }}
              className="absolute -top-1 -right-1 grid h-6 min-w-6 place-items-center rounded-full bg-gold px-1.5 text-xs font-extrabold text-ink ring-2 ring-ink"
            >
              {count}
            </motion.span>
          </motion.span>

          <span className="hidden -space-x-3 sm:flex">
            {thumbs.map((l) => (
              <span key={l.id} className="size-9 overflow-hidden rounded-full ring-2 ring-ink">
                <FoodImage src={l.image} alt="" sizes="36px" className="size-full [&_.script]:hidden [&_svg]:h-4" />
              </span>
            ))}
          </span>

          <span className="text-left leading-tight">
            <span className="block text-[11px] font-bold tracking-[0.18em] text-cream/55 uppercase">Your order</span>
            <span className="block font-bold tabular-nums">{formatPKR(subtotal)}</span>
          </span>
          <ChevronUp className="size-4 text-cream/60 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
