"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MENU, priceLabel } from "@/lib/menu";
import { AddToCart } from "@/components/cart/AddToCart";
import { FoodImage } from "@/components/menu/FoodImage";
import { SplitHeading } from "@/components/motion/Reveal";
import { Doodles } from "@/components/brand/Doodles";

// Items with a real photo, Foodpanda's "Popular" ones first. The homepage rail is the
// shop window, so it skips items that would fall back to the branded placeholder.
const withPhoto = MENU.flatMap((c) => c.items.map((i) => ({ ...i, category: c.name }))).filter((i) => i.image);
const RAIL = [...withPhoto.filter((i) => i.popular), ...withPhoto.filter((i) => !i.popular)].slice(0, 10);

export function PopularRail() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-38%"]);

  return (
    <section ref={ref} className="isolate relative overflow-hidden bg-paper py-24 md:py-32">
      <Doodles kinds={["burger", "sparkle", "fries", "squiggle", "shake", "heart"]} variant={1} className="text-red/[0.1]" />
      <div className="mx-auto mb-12 flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-8">
        <div>
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-red uppercase">Most ordered</p>
          <SplitHeading className="display text-[clamp(2.8rem,7vw,6rem)] text-ink" lines={["Lahore's", <span key="b" className="text-red">favourites</span>]} />
        </div>
        <div className="max-w-sm md:text-right">
          <p className="text-ink/60">Foodpanda&apos;s most-ordered picks first, then more from the kitchen. Drag the row or keep scrolling.</p>
          <Link href="/menu" className="group mt-3 inline-flex items-center gap-2 font-bold text-red">
            Full menu <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <motion.ul style={{ x }} className="flex w-max gap-5 px-4 sm:px-8" drag="x" dragConstraints={{ left: -1600, right: 0 }} dragElastic={0.08}>
        {RAIL.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: (i % 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10 }}
            className="group w-[78vw] shrink-0 overflow-hidden rounded-[2rem] bg-cream-warm ring-1 ring-red/10 sm:w-[340px]"
          >
            <div className="relative overflow-hidden">
              <FoodImage src={item.image} alt={item.name} sizes="340px" className="pointer-events-none aspect-[5/4] w-full transition-transform duration-700 group-hover:scale-110" />
              {item.popular && <span className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink uppercase">Popular</span>}
            </div>
            <div className="space-y-2 p-6">
              <p className="text-xs font-bold tracking-[0.2em] text-red/70 uppercase">{item.category}</p>
              <h3 className="display text-2xl leading-none">{item.name}</h3>
              <p className="line-clamp-2 min-h-10 text-sm text-ink/60">{item.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-bold text-red">{priceLabel(item)}</span>
                <AddToCart id={item.id} name={item.name} compact />
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
