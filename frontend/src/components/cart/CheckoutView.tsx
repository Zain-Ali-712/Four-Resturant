"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Bike, Check, Store } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/brand";
import { formatPKR } from "@/lib/menu";
import { HandMark } from "@/components/brand/Logo";

// Dummy checkout for the pitch: validates and shows a confirmation, but sends nothing.

type Mode = "delivery" | "pickup";
type Pay = "cod" | "card";

const field = "h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 outline-none transition focus:border-red focus:ring-4 focus:ring-red/10";

export function CheckoutView() {
  const { lines, subtotal, count, clear } = useCart();
  const [mode, setMode] = useState<Mode>("delivery");
  const [pay, setPay] = useState<Pay>("cod");
  const [placed, setPlaced] = useState<{ ref: string; total: number; items: number; mode: Mode } | null>(null);

  if (placed) return <Confirmation {...placed} />;

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="script text-5xl text-red">Your tray is empty</p>
        <Link href="/menu" className="rounded-full bg-red px-6 py-3 font-bold text-cream">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <form
      className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!e.currentTarget.reportValidity()) return;
        setPlaced({ ref: `FR-${Math.floor(10000 + Math.random() * 89999)}`, total: subtotal, items: count, mode });
        clear();
        window.scrollTo({ top: 0 });
      }}
    >
      <div className="space-y-10">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm font-bold text-red">
          <ArrowLeft className="size-4" /> Back to menu
        </Link>

        <fieldset>
          <legend className="display mb-4 text-3xl">How do you want it?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["delivery", "Delivery", Bike, BRAND.deliveryArea],
                ["pickup", "Pickup", Store, "From Raya Fairways Phase 6"],
              ] as const
            ).map(([value, label, Icon, sub]) => (
              <label key={value} className={`relative cursor-pointer rounded-3xl border-2 p-5 transition ${mode === value ? "border-red bg-red/5" : "border-ink/10 hover:border-red/40"}`}>
                <input type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)} className="sr-only" />
                <Icon className={`mb-3 size-7 ${mode === value ? "text-red" : "text-ink/50"}`} />
                <p className="font-bold">{label}</p>
                <p className="text-sm text-ink/60">{sub}</p>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="display mb-4 text-3xl">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">Name</span>
              <input required name="name" autoComplete="name" className={field} />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-semibold">Phone</span>
              <input required name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+\s\-]{10,15}" placeholder="03xx xxxxxxx" className={field} />
            </label>
          </div>
          <AnimatePresence initial={false}>
            {mode === "delivery" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                <label className="block space-y-1.5">
                  <span className="text-sm font-semibold">Address in DHA Phase 6 or 7</span>
                  <input required name="address" autoComplete="street-address" placeholder="House, street, sector" className={field} />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold">Notes for the kitchen (optional)</span>
            <textarea name="notes" rows={3} className={`${field} h-auto py-3`} placeholder="Extra sauce, no onions…" />
          </label>
        </fieldset>

        <fieldset>
          <legend className="display mb-4 text-3xl">Payment</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["cod", mode === "delivery" ? "Cash on delivery" : "Pay at the counter"],
                ["card", "Card (coming soon)"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className={`flex items-center gap-3 rounded-2xl border-2 p-4 ${value === "card" ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${pay === value ? "border-red" : "border-ink/10"}`}>
                <input type="radio" name="pay" value={value} checked={pay === value} disabled={value === "card"} onChange={() => setPay(value)} className="accent-[var(--color-red)]" />
                <span className="font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-[2rem] bg-cream-warm ring-1 ring-red/10">
          <div className="bg-red px-6 py-5 text-cream">
            <p className="display text-2xl">Order summary</p>
          </div>
          <ul className="divide-y divide-ink/10 px-6">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  <b>{l.qty}×</b> {l.name}
                </span>
                <span className="font-semibold tabular-nums">{formatPKR(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-ink/10 px-6 py-5">
            <div className="flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex items-baseline justify-between pt-2">
              <span className="font-bold">Total{mode === "delivery" ? " before delivery" : ""}</span>
              <span className="display text-3xl text-red tabular-nums">{formatPKR(subtotal)}</span>
            </div>
            <button type="submit" className="mt-4 w-full rounded-full bg-red py-4 text-lg font-bold text-cream transition hover:bg-red-hot active:scale-[0.98]">
              Place order
            </button>
            <p className="pt-1 text-center text-xs text-ink/50">Demo checkout — no order is sent.</p>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Confirmation({ ref, total, items, mode }: { ref: string; total: number; items: number; mode: Mode }) {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 pb-24 text-center">
      <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12 }} className="relative mb-8 grid size-36 place-items-center rounded-full bg-red text-cream">
        <HandMark className="h-20 w-auto" title="" />
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="absolute -right-1 -bottom-1 grid size-12 place-items-center rounded-full bg-gold text-ink">
          <Check strokeWidth={3} />
        </motion.span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="script text-6xl text-red">
        Order placed!
      </motion.h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-4 space-y-2 text-ink/70">
        <p>
          Order <b className="text-ink">{ref}</b> · {items} item{items === 1 ? "" : "s"} · <b className="text-ink">{formatPKR(total)}</b>
        </p>
        <p>{mode === "delivery" ? "In the live site, FOUR's team would confirm the delivery with you here." : "In the live site, you'd be told here when it's ready to pick up from Raya."}</p>
        <p className="pt-2 text-xs text-ink/40">This is a demo for the website pitch. No real order was sent.</p>
      </motion.div>
      <Link href="/menu" className="mt-8 rounded-full bg-red px-8 py-4 font-bold text-cream">
        Back to the menu
      </Link>
    </div>
  );
}
