"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { imageSize } from "@/lib/menu";
import { SplitHeading } from "@/components/motion/Reveal";
import { Doodles } from "@/components/brand/Doodles";

// Real photos only: Google Maps uploads of the restaurant, and FOUR's Instagram posts.
const COLS = [
  ["exterior-night", "doodle-wall", "ig-smash"],
  ["red-panel", "ig-pizza-box", "interior-lights", "menu-card"],
  ["ig-sky", "interior", "burger-tower"],
] as const;
const ALT: Record<string, string> = {
  "exterior-night": "FOUR's glass front and red sign at night, Raya Fairways",
  "doodle-wall": "Chalk doodle wall inside FOUR",
  "ig-smash": "A beef smash burger on FOUR wrap paper",
  "red-panel": "Red FOUR light panel above the black-and-white floor",
  "ig-pizza-box": "Pizza in a FOUR box",
  "interior-lights": "Dining room with curved ceiling lights",
  "menu-card": "FOUR's printed menu",
  "ig-sky": "Miami Catch burger floating in the sky, from FOUR's Instagram",
  interior: "Dining room tables at FOUR",
  "burger-tower": "A tower of smash burgers on red",
};

function Column({ ids, y }: { ids: readonly string[]; y: MotionValue<string> }) {
  return (
    <motion.div style={{ y }} className="flex flex-col gap-4">
      {ids.map((id) => {
        const src = `/img/gallery/${id}.webp`;
        const [w, h] = imageSize(src);
        return (
          <div key={id} className="group overflow-hidden rounded-3xl">
            <Image src={src} alt={ALT[id]} width={w} height={h} sizes="(min-width: 768px) 22vw, 45vw" className="w-full transition-transform duration-700 group-hover:scale-105" />
          </div>
        );
      })}
    </motion.div>
  );
}

export function Visit() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-6%", "4%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["14%", "-18%"]);

  return (
    <section ref={ref} className="isolate relative overflow-hidden bg-char py-24 text-cream md:py-32">
      <Doodles kinds={["stamp", "arrow", "hand", "sparkle", "shake", "dots"]} variant={0} className="text-gold/[0.08]" />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-gold uppercase">Visit us</p>
          <SplitHeading className="display text-[clamp(3rem,7vw,6rem)]" lines={["Raya,", <span key="d" className="script text-red-hot normal-case">DHA Lahore</span>]} />
          <ul className="mt-10 space-y-6">
            <li className="flex gap-4">
              <MapPin className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">{BRAND.address}</p>
                <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-cream/70 hover:text-cream">
                  Open in Google Maps <ArrowUpRight className="size-4" />
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">{BRAND.hours}</p>
                <p className="text-sm text-cream/70">Wheelchair-accessible entrance and restroom</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="mt-1 size-5 shrink-0 text-gold" />
              <div>
                <a href={BRAND.phoneHref} className="font-semibold hover:underline">
                  {BRAND.phone}
                </a>
                <p className="text-sm text-cream/70">Delivering across {BRAND.deliveryArea}</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="grid h-[880px] grid-cols-2 gap-4 overflow-hidden md:grid-cols-3">
          <Column ids={COLS[0]} y={y1} />
          <Column ids={COLS[1]} y={y2} />
          <div className="hidden md:block">
            <Column ids={COLS[2]} y={y3} />
          </div>
        </div>
      </div>
    </section>
  );
}
