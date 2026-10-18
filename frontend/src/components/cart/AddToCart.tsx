"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";

/**
 * Add button that turns into a stepper once the dish is in the order, so people can
 * fix a mis-tap or change the quantity right where they are, without opening the cart.
 */
export function AddToCart({
  id,
  name,
  variant = "solid",
  className = "",
  label = "Add to order",
  compact,
}: {
  id: string;
  name: string;
  variant?: "solid" | "cream" | "outline";
  className?: string;
  label?: string;
  compact?: boolean;
}) {
  const { add, setQty, lines } = useCart();
  const qty = lines.find((l) => l.id === id)?.qty ?? 0;

  const styles = {
    solid: "bg-red text-cream shadow-[0_10px_24px_-12px_rgba(200,20,26,.8)]",
    cream: "bg-cream text-red shadow-[0_10px_24px_-12px_rgba(51,5,10,.6)]",
    outline: "border-2 border-current text-red",
  }[variant];
  const press = "transition-colors hover:bg-black/10 active:bg-black/20";

  return (
    <span className={`relative inline-flex ${className}`}>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 520, damping: 36 }}
        className={`inline-flex items-center overflow-hidden rounded-full font-bold ${compact ? "h-11" : "h-12 w-full"} ${styles}`}
      >
        {qty === 0 ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => add(id)}
            aria-label={`Add ${name} to order`}
            className={`flex h-full items-center justify-center gap-2 ${compact ? "w-11" : "w-full px-6"} ${press}`}
          >
            <Plus className="size-5" strokeWidth={3} />
            {!compact && label}
          </motion.button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setQty(id, qty - 1)}
              aria-label={qty === 1 ? `Remove ${name} from order` : `Remove one ${name}`}
              className={`grid h-full w-11 shrink-0 place-items-center ${press}`}
            >
              {qty === 1 ? <Trash2 className="size-4" strokeWidth={2.4} /> : <Minus className="size-5" strokeWidth={3} />}
            </button>
            <span className={`flex flex-1 items-center justify-center gap-1 px-1 whitespace-nowrap tabular-nums ${compact ? "min-w-7" : ""}`} aria-live="polite">
              <motion.span key={qty} initial={{ y: -12, opacity: 0, scale: 1.4 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 22 }}>
                {qty}
              </motion.span>
              {!compact && <span className="font-semibold opacity-80">in order</span>}
            </span>
            <button type="button" onClick={() => add(id)} aria-label={`Add one more ${name}`} className={`grid h-full w-11 shrink-0 place-items-center ${press}`}>
              <Plus className="size-5" strokeWidth={3} />
            </button>
          </>
        )}
      </motion.div>
    </span>
  );
}
