"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { BRAND, REVIEWS, REVIEW_TAGS } from "@/lib/brand";
import { Doodles } from "@/components/brand/Doodles";

function CountUp({ to, decimals = 0, className }: { to: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className}>
      {v.toLocaleString("en-PK", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

export function Reviews() {
  const fivePct = Math.round((BRAND.google.fiveStar / BRAND.google.reviews) * 100);
  return (
    <section className="isolate relative overflow-hidden bg-cream-warm py-24 md:py-32">
      <Doodles kinds={["stamp", "sparkle", "hand", "arrow", "heart", "dots"]} variant={3} className="text-red/[0.1]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-2 text-sm font-bold tracking-[0.3em] text-red uppercase">Google reviews</p>
          <h2 className="display text-3xl text-ink md:text-4xl">
            What Lahore <span className="script text-red normal-case">is saying</span>
          </h2>
          <div className="flex items-end gap-4">
            <CountUp to={BRAND.google.rating} decimals={1} className="display text-[clamp(6rem,16vw,12rem)] text-red tabular-nums" />
            <div className="mb-6 flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.span key={i} initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 260, damping: 14 }}>
                  <Star className="size-7 fill-gold text-gold" />
                </motion.span>
              ))}
            </div>
          </div>
          <p className="max-w-sm text-lg text-ink/70">
            From <CountUp to={BRAND.google.reviews} className="font-bold text-ink tabular-nums" /> reviews on Google Maps, and {fivePct}% of them are five stars.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {REVIEW_TAGS.map(([tag, n], i) => (
              <motion.li
                key={tag}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-full border border-red/20 bg-paper px-4 py-2 text-sm"
              >
                {tag} <span className="font-bold text-red">{n}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative h-[520px] overflow-hidden [mask-image:linear-gradient(transparent,black_15%,black_85%,transparent)]">
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1].map((col) => (
              <div key={col} className={`flex flex-col gap-4 ${col ? "hidden sm:flex" : ""} ${col ? "animate-[marquee-y_30s_linear_infinite_reverse]" : "animate-[marquee-y_26s_linear_infinite]"}`}>
                {/* Doubled so the -50% loop is seamless; the second column runs in reverse order. */}
                {(col ? [...REVIEWS].reverse() : [...REVIEWS]).concat(col ? [...REVIEWS].reverse() : [...REVIEWS]).map((r, i) => (
                  <figure key={`${r.name}-${i}`} className="rounded-3xl bg-paper p-6 shadow-[0_20px_40px_-30px_rgba(110,18,22,.5)] ring-1 ring-red/10">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: r.stars }, (_, k) => (
                        <Star key={k} className="size-4 fill-gold text-gold" />
                      ))}
                    </div>
                    <blockquote className="text-ink/80">&ldquo;{r.text}&rdquo;</blockquote>
                    <figcaption className="mt-4 text-sm font-bold text-red">{r.name}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
