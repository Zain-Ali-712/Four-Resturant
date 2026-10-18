"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { REVIEW_TAGS } from "@/lib/brand";
import { mustGetItem, priceLabel } from "@/lib/menu";
import { AddToCart } from "@/components/cart/AddToCart";
import { Smoke } from "@/components/motion/Smoke";
import { Doodles } from "@/components/brand/Doodles";

const pizza = mustGetItem("malai-boti-crown-crust-creamy-base-pizza");
const mentions = REVIEW_TAGS.find(([t]) => t === "malai boti pizza")?.[1];

// The lifted slice is the wedge between 12 o'clock and half past one.
const A0 = -90, A1 = -45;
const MID = ((A0 + A1) / 2) * (Math.PI / 180);
const DIR = { x: Math.cos(MID), y: Math.sin(MID) };
const rad = (d: number) => (d * Math.PI) / 180;

// Rounded to 2dp: the browser re-serialises long floats in style attributes,
// which made the server HTML and client props disagree on hydration.
const pct = (n: number) => `${Math.round(n * 100) / 100}%`;

function wedge(a0: number, a1: number, r = 75) {
  const pts = ["50% 50%"];
  for (let a = a0; a <= a1 + 0.01; a += 3) pts.push(`${pct(50 + r * Math.cos(rad(a)))} ${pct(50 + r * Math.sin(rad(a)))}`);
  return `polygon(${pts.join(", ")})`;
}
const SLICE = wedge(A0, A1);
const REST = wedge(A1, A0 + 360);

// Points along both cut edges where cheese strands attach.
const STRANDS = [A0, A1].flatMap((a) => [9, 15, 22, 29, 36].map((r, i) => ({ a, r, w: 1.6 - i * 0.18 })));

export function PizzaPull() {
  const root = useRef<HTMLElement>(null);
  const strands = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const state = { lift: 0 };

      const draw = () => {
        const d = state.lift; // 0–24, in % of the pizza box
        strands.current.forEach((path, i) => {
          if (!path) return;
          const s = STRANDS[i];
          const bx = 50 + s.r * Math.cos(rad(s.a)), by = 50 + s.r * Math.sin(rad(s.a));
          // The slice scales up from the pie's centre while it lifts, so follow both.
          const k = 1 + 0.1 * (d / 24);
          const tx = 50 + (bx - 50) * k + DIR.x * d, ty = 50 + (by - 50) * k + DIR.y * d;
          // Strands sag towards the pie and thin out as they stretch, then snap.
          const sag = Math.min(d, 14) * 0.35;
          const cx = (bx + tx) / 2 - DIR.x * sag * 0.4 + 2, cy = (by + ty) / 2 - DIR.y * sag * 0.4 + sag;
          const snap = d > 17 + (i % 4) * 1.6;
          path.setAttribute("d", `M${bx} ${by} Q${cx} ${cy} ${tx} ${ty}`);
          path.style.opacity = snap || d < 0.6 ? "0" : String(Math.min(1, d / 3));
          path.setAttribute("stroke-width", String(Math.max(0.25, s.w * (1 - d / 22))));
        });
      };

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 1 },
      });
      tl.fromTo("[data-pie]", { rotate: -28, scale: 0.86 }, { rotate: 8, scale: 1, duration: 3, ease: "none" }, 0)
        .to(state, { lift: 24, duration: 2, onUpdate: draw }, 0.6)
        .fromTo(
          "[data-slice]",
          { filter: "drop-shadow(0 0px 0px rgba(40,0,0,0))" },
          { xPercent: DIR.x * 24, yPercent: DIR.y * 24, scale: 1.1, duration: 2, filter: "drop-shadow(0 50px 28px rgba(40,0,0,.6))" },
          0.6,
        )
        .fromTo("[data-copy] > *", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }, 0.3)
        .to("[data-steam]", { opacity: 1, duration: 1 }, 0.8);
      draw();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="isolate grain relative min-h-[100svh] overflow-hidden bg-red-deep text-cream" aria-labelledby="pizza-title">
      <Doodles kinds={["slice", "pizza", "sparkle", "squiggle", "stamp", "dots"]} variant={3} className="text-cream/[0.1]" />
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_62%_50%,rgba(212,20,26,.55),transparent_70%)]" />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1fr]">
        <div data-copy className="relative z-10 space-y-5">
          <p className="text-sm font-bold tracking-[0.3em] text-gold uppercase">Crown crust pizza</p>
          <h2 id="pizza-title" className="display text-[clamp(2.6rem,5.5vw,5rem)]">
            Pull a <span className="script text-gold normal-case">slice</span>
          </h2>
          <p className="display text-2xl text-cream/90">Malai Boti Crown Crust</p>
          <p className="max-w-md text-cream/70">{pizza.description}.</p>
          {mentions && (
            <p className="max-w-md text-sm text-cream/60">
              &ldquo;Crown crust pizza creamy sauce best of all.&rdquo; Google reviewers bring up the malai boti pizza {mentions} times.
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="display text-3xl text-gold">{priceLabel(pizza)}</span>
            <AddToCart id={pizza.id} name={pizza.name} variant="cream" />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-[min(78vw,460px)]">
          <div data-steam className="absolute -inset-[15%] opacity-0 [mask-image:radial-gradient(closest-side,black_55%,transparent)]">
            <Smoke className="size-full" density={0.9} />
          </div>
          <div data-pie className="absolute inset-0">
            <Image
              src="/img/pizza/malai-boti-top.webp"
              alt="Malai Boti Crown Crust pizza from above"
              width={1400}
              height={1400}
              sizes="(min-width: 768px) 460px, 78vw"
              className="absolute inset-0 size-full drop-shadow-[0_30px_40px_rgba(0,0,0,.5)]"
              style={{ clipPath: REST }}
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="cheese" x1="0" x2="1">
                  <stop offset="0" stopColor="#f3d98b" />
                  <stop offset=".5" stopColor="#fff3c8" />
                  <stop offset="1" stopColor="#e9c56a" />
                </linearGradient>
              </defs>
              {STRANDS.map((s, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    strands.current[i] = el;
                  }}
                  fill="none"
                  stroke="url(#cheese)"
                  strokeLinecap="round"
                  style={{ opacity: 0 }}
                />
              ))}
            </svg>
            {/* Clip the image, not the wrapper, so the wrapper's drop shadow isn't clipped away. */}
            <div data-slice className="absolute inset-0 will-change-transform">
              <Image src="/img/pizza/malai-boti-top.webp" alt="" width={1400} height={1400} sizes="(min-width: 768px) 460px, 78vw" className="size-full" style={{ clipPath: SLICE }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
