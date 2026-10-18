"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { BRAND, NAV } from "@/lib/brand";
import { Logo } from "@/components/brand/Logo";
import { Socials } from "@/components/brand/Socials";

export function Header() {
  const pathname = usePathname();
  const { count, setOpen: setCartOpen, lastAdded } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Pages without a red hero need a solid bar, or the cream logo vanishes on cream.
  const solid = scrolled || pathname.startsWith("/checkout");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Lenis eases out in tiny steps, so only a clear move in either direction changes state.
      if (y > 400 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y <= 400) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes (adjusting state during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Lets sticky page bars (the menu's category tabs) close the gap the header leaves.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden && !open);
  }, [hidden, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-(--ease-out-expo) ${
          hidden && !open ? "-translate-y-full" : ""
        } ${solid ? "bg-red/95 shadow-[0_8px_30px_-12px_rgba(60,0,0,.5)] backdrop-blur" : "bg-transparent"}`}
      >
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-6 px-4 sm:h-20 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" aria-label="FOUR home" className="justify-self-start text-cream transition-transform hover:scale-[1.03]">
            <Logo className="h-7 w-auto sm:h-9" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 rounded-full bg-black/15 p-1 ring-1 ring-cream/15 backdrop-blur-md lg:flex">
            {NAV.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-colors ${
                    active ? "text-red" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-cream shadow-[0_6px_18px_-8px_rgba(0,0,0,.45)]" transition={{ type: "spring", bounce: 0.25, duration: 0.6 }} />
                  )}
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-self-end gap-2">
            <Socials className="hidden gap-0.5 xl:flex" itemClassName="size-9 text-cream/80 hover:bg-cream/10 hover:text-cream" />
            <span className="mx-1 hidden h-5 w-px bg-cream/20 xl:block" />
            <a href={BRAND.phoneHref} className="mr-1 hidden text-sm font-semibold whitespace-nowrap text-cream/80 transition hover:text-cream md:block xl:hidden 2xl:block">
              {BRAND.phone}
            </a>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="group relative flex h-11 items-center gap-2 rounded-full bg-cream px-4 text-sm font-bold text-red transition hover:bg-white"
            >
              <motion.span key={lastAdded?.at} animate={lastAdded ? { rotate: [0, -18, 14, -8, 0], scale: [1, 1.25, 1] } : undefined} transition={{ duration: 0.6 }}>
                <ShoppingBag className="size-[18px]" strokeWidth={2.4} />
              </motion.span>
              <span className="hidden sm:inline">Order</span>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="grid min-w-6 place-items-center rounded-full bg-red px-1.5 text-xs leading-6 text-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full text-cream transition hover:bg-cream/10 lg:hidden"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-red px-6 pt-28 pb-10 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.7 }}>
                  <Link href={n.href} className="display block py-2 text-6xl text-cream">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto space-y-1 text-cream/80">
              <a href={BRAND.phoneHref} className="block text-lg font-semibold text-cream">
                {BRAND.phone}
              </a>
              <p>{BRAND.hours}</p>
              <Socials className="-ml-2 pt-4" itemClassName="size-12 bg-cream/10 text-cream hover:bg-cream hover:text-red" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
