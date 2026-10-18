"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Star, UtensilsCrossed } from "lucide-react";
import { MENU } from "@/lib/menu";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/brand/Logo";

const EASE = [0.16, 1, 0.3, 1] as const;
const total = MENU.reduce((n, c) => n + c.items.length, 0);

// FOUR's dishes around the title: the Miami Catch cutout and Fish & Four (real photos),
// and the generated burger and pizza art modelled on their own dishes. `z` sets depth.
const ORBIT = [
  { src: "/img/hero/miami-catch.webp", w: 1031, h: 887, cls: "-right-[4%] top-[16%] w-[34vw] max-w-[420px]", r: -10, z: 0, d: 0.25 },
  { src: "/img/pizza/malai-boti-top.webp", w: 1400, h: 1400, cls: "-left-[9%] -bottom-[18%] w-[38vw] max-w-[460px]", r: 20, z: 0, d: 0.4 },
  { src: "/img/feature/fish-four.webp", w: 640, h: 803, cls: "right-[12%] -bottom-[6%] w-[14vw] max-w-[180px] hidden md:block", r: 14, z: 1, d: 0.55 },
  { src: "/img/feature/burger-closed.webp", w: 800, h: 661, cls: "left-[9%] top-[20%] w-[12vw] max-w-[150px] hidden md:block", r: -12, z: 1, d: 0.7 },
  { src: "/img/feature/burger-closed.webp", w: 800, h: 661, cls: "left-[38%] top-[13%] w-[5vw] max-w-[70px] hidden lg:block", r: 8, z: 2, d: 0.9 },
] as const;

export function MenuHero() {
  const { scrollY } = useScroll();
  const near = useTransform(scrollY, [0, 700], [0, 180]);
  const far = useTransform(scrollY, [0, 700], [0, 70]);
  const rot = useTransform(scrollY, [0, 700], [0, 50]);
  const mark = useTransform(scrollY, [0, 700], [0, 120]);

  return (
    <section className="grain relative h-[92svh] min-h-[600px] overflow-hidden bg-red text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,var(--color-red-hot)_0%,var(--color-red)_38%,var(--color-red-deep)_76%,var(--color-maroon)_100%)]" />
      <div
        className="pointer-events-none absolute -inset-x-1/4 -bottom-[28%] h-[70%] origin-bottom opacity-50 [mask-image:radial-gradient(60%_70%_at_50%_70%,black,transparent)]"
        style={{
          transform: "perspective(1000px) rotateX(74deg)",
          backgroundImage: "repeating-radial-gradient(circle at 50% 55%, transparent 0 70px, rgba(51,5,10,.55) 70px 73px)",
        }}
      />

      {/* Quiet signature, centred along the bottom edge. */}
      <motion.div className="pointer-events-none absolute bottom-[3%] left-1/2 w-[60vw] -translate-x-1/2 md:w-[34vw]" style={{ y: mark }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 0.4, ease: EASE }}>
          <Logo className="w-full text-cream/[0.09]" title="" />
        </motion.div>
      </motion.div>

      {ORBIT.map((o, i) => (
        <motion.div key={i} className={`pointer-events-none absolute ${o.cls}`} style={{ y: o.z ? far : near, rotate: i === 1 ? rot : undefined }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.2, rotate: o.r - 40 }}
            animate={{ opacity: o.z === 2 ? 0.8 : o.z ? 0.9 : 1, scale: 1, rotate: o.r }}
            transition={{ type: "spring", stiffness: 50, damping: 14, delay: o.d }}
            style={{ filter: o.z ? "saturate(.95) brightness(.97)" : undefined }}
          >
            <Image
              src={o.src}
              alt=""
              width={o.w}
              height={o.h}
              priority={i === 0}
              sizes="(min-width: 768px) 420px, 40vw"
              className="w-full animate-[float-y_7s_ease-in-out_infinite] drop-shadow-[0_30px_30px_rgba(40,0,0,.45)]"
            />
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
          className="mb-5 inline-flex items-center gap-3 rounded-full border border-cream/20 bg-maroon/40 px-4 py-1.5 text-xs font-bold tracking-[0.3em] text-gold uppercase backdrop-blur"
        >
          <span className="h-px w-6 bg-gold/60" /> Raya, DHA Lahore <span className="h-px w-6 bg-gold/60" />
        </motion.p>
        <h1 className="display text-[clamp(3.5rem,10vw,9rem)] drop-shadow-[0_10px_30px_rgba(51,5,10,.45)]">
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span className="block whitespace-nowrap" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE }}>
              Savour our
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span className="script block text-[1.25em] text-cream normal-case" initial={{ y: "110%", rotate: -8 }} animate={{ y: 0, rotate: -3 }} transition={{ duration: 1.2, delay: 0.1, ease: EASE }}>
              Menu
            </motion.span>
          </span>
        </h1>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
          className="mt-8 flex flex-wrap justify-center gap-2 text-sm font-semibold"
        >
          {[
            { Icon: UtensilsCrossed, text: `${total} items · ${MENU.length} categories` },
            { Icon: Clock, text: BRAND.hours },
            { Icon: Star, text: `${BRAND.google.rating} on Google` },
          ].map(({ Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 ring-1 ring-cream/15 backdrop-blur">
              <Icon className="size-4 text-gold" /> {text}
            </li>
          ))}
        </motion.ul>

      </div>
    </section>
  );
}
