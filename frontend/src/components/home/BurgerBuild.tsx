"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { BRAND, REVIEW_TAGS } from "@/lib/brand";
import { mustGetItem, priceLabel } from "@/lib/menu";
import { CENTER, FRAME, LAYERS } from "@/lib/burger-layers";
import { AddToCart } from "@/components/cart/AddToCart";
import { Smoke } from "@/components/motion/Smoke";
import { GhostText } from "@/components/brand/Ghost";
import { Doodles } from "@/components/brand/Doodles";

const burger = mustGetItem("classic-new-york-burger");
const beefMentions = REVIEW_TAGS.find(([t]) => t === "beef burger")?.[1];

// Ingredients exactly as FOUR lists them on Foodpanda, pinned to the layer they belong to.
const LABELS: { layer: (typeof LAYERS)[number]["id"]; side: "l" | "r"; title: string; text: string }[] = [
  { layer: "cheese", side: "r", title: "Yellow cheddar", text: "Yellow cheddar cheese with FOUR's signature prime sauce." },
  { layer: "patty", side: "l", title: "Beef patty 110g", text: "A smashed beef patty, finished with signature charcoal sauce." },
  { layer: "lettuce", side: "r", title: "Relish, lettuce & onion jam", text: "Lettuce, relish and onion jam to finish the stack." },
];

const STACK = 0.36; // how tightly layers sit when the burger is closed

export function BurgerBuild() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const smoke = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const px = (frameY: number) => () => (frameY / FRAME.h) * stage.current!.offsetHeight;
      const closed = (id: string) => {
        const l = LAYERS.find((x) => x.id === id)!;
        const cy = (l.box[1] + l.box[3]) / 2;
        return px((cy - CENTER) * (STACK - 1));
      };
      const spread = (id: string) => {
        const l = LAYERS.find((x) => x.id === id)!;
        const cy = (l.box[1] + l.box[3]) / 2;
        return px((cy - CENTER) * 0.14);
      };

      if (reduced) return;

      LAYERS.forEach((l) => gsap.set(`[data-layer="${l.id}"]`, { y: closed(l.id) }));
      gsap.set("[data-bigname]", { yPercent: 100, opacity: 0 });
      gsap.set("[data-label]", { opacity: 0, x: (i, el) => ((el as HTMLElement).dataset.side === "l" ? 30 : -30) });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=260%", pin: true, scrub: 1, invalidateOnRefresh: true },
      });

      tl.to("[data-stack]", { rotate: -4, scale: 0.94, duration: 0.6 }, 0);
      LAYERS.forEach((l, i) => {
        const tilt = [3, -4, 2, -5, 6][i];
        const drift = [-10, 16, -8, 14, -12][i];
        tl.to(`[data-layer="${l.id}"]`, { y: 0, rotate: tilt, x: drift, duration: 2 }, 0.4 + Math.abs(2 - i) * 0.06);
      });
      tl.to("[data-stack]", { rotate: 0, scale: 1, duration: 2 }, 0.4);
      tl.to("[data-intro]", { opacity: 0, y: -60, duration: 0.8 }, 0.5);
      // The burger's name rises from the floor as the heading leaves.
      tl.to("[data-bigname]", { yPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.5);
      LABELS.forEach((lab, i) => tl.to(`[data-label="${lab.layer}"]`, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, 1.2 + i * 0.35));
      tl.to(smoke.current, { opacity: 1, duration: 1.5 }, 0.6);
      LAYERS.forEach((l) => tl.to(`[data-layer="${l.id}"]`, { y: spread(l.id), duration: 1 }, 2.6));
      tl.to("[data-stack]", { scale: 0.86, y: () => -stage.current!.offsetHeight * 0.04, duration: 1 }, 2.6);
      tl.to("[data-outro]", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.8);
      tl.to({}, { duration: 0.6 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="isolate grain relative h-[100svh] overflow-hidden bg-char text-cream" aria-labelledby="build-title">
      <Doodles kinds={["burger", "flame", "sparkle", "dots", "arrow", "hand"]} variant={2} className="text-gold/[0.09]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,rgba(200,16,22,.32),transparent_70%)]" />

      <div data-intro className="absolute inset-x-0 top-[12%] z-10 px-4 text-center">
        <p className="mb-3 text-sm font-bold tracking-[0.3em] text-gold uppercase">Beef smash burgers</p>
        <h2 id="build-title" className="display text-[clamp(3rem,9vw,8rem)]">
          Layer by <span className="script text-red-hot normal-case">layer</span>
        </h2>
        <p className="mt-3 text-cream/60">Scroll to take apart the {burger.name}</p>
      </div>

      <div className="absolute inset-0 grid place-items-center pt-6 pb-28 md:pb-32">
        <div ref={stage} className="relative h-[min(64svh,640px)]" style={{ aspectRatio: `${FRAME.w}/${FRAME.h}` }}>
          {/* Puffs spawn near the canvas bottom, which sits at the top bun, and drift up. */}
          <div
            ref={smoke}
            className="absolute -inset-x-[45%] -top-[50%] h-[72%] opacity-30 [mask-image:radial-gradient(closest-side,black_55%,transparent)]"
          >
            <Smoke className="size-full" density={1.1} />
          </div>
          <div data-stack className="absolute inset-0">
            {LAYERS.map((l, i) => {
              const [x0, y0, x1, y1] = l.box;
              return (
                <div
                  key={l.id}
                  data-layer={l.id}
                  className="absolute will-change-transform"
                  style={{
                    left: `${(x0 / FRAME.w) * 100}%`,
                    top: `${(y0 / FRAME.h) * 100}%`,
                    width: `${((x1 - x0) / FRAME.w) * 100}%`,
                    height: `${((y1 - y0) / FRAME.h) * 100}%`,
                    zIndex: i + 1,
                  }}
                >
                  <Image
                    src={`/img/burger/${l.id}.webp`}
                    alt={i === 0 ? `${burger.name}, taken apart layer by layer` : ""}
                    width={l.size[0]}
                    height={l.size[1]}
                    sizes="(min-width: 768px) 460px, 60vw"
                    className="size-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,.55)]"
                  />
                  {LABELS.filter((lab) => lab.layer === l.id).map((lab) => (
                    <div
                      key={lab.layer}
                      data-label={lab.layer}
                      data-side={lab.side}
                      className={`absolute top-1/2 hidden w-56 -translate-y-1/2 md:block ${lab.side === "l" ? "right-full mr-6 text-right" : "left-full ml-6"}`}
                    >
                      <div className={`mb-2 flex items-center gap-2 ${lab.side === "l" ? "flex-row-reverse" : ""}`}>
                        <span className="size-2.5 rounded-full bg-gold shadow-[0_0_0_6px_rgba(232,169,58,.18)]" />
                        <span className="h-px w-16 bg-cream/30" />
                      </div>
                      <p className="display text-xl text-cream">{lab.title}</p>
                      <p className="mt-1 text-sm text-cream/60">{lab.text}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Big background name in deep red, sitting behind the burger near the floor. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[16%] z-0 mx-auto w-[min(84vw,980px)] overflow-hidden md:bottom-[13%]" aria-hidden>
        <div data-bigname>
          <GhostText id="build-name" text={burger.name.replace(/\s*burger$/i, "")} className="block w-full" color="var(--color-red-deep)" top={0.95} floor={0.6} />
        </div>
      </div>

      <div data-outro className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-3xl translate-y-10 flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 opacity-0 md:bottom-10">
        <div className="text-center md:text-left">
          <p className="display text-3xl">{burger.name}</p>
          <p className="text-sm text-cream/60">
            {priceLabel(burger)}
            {beefMentions ? ` · “beef burger” comes up in ${beefMentions} Google reviews` : ""}
          </p>
        </div>
        <AddToCart id={burger.id} name={burger.name} variant="cream" />
      </div>
      <p className="sr-only">
        {burger.name}: {burger.description}. Rated {BRAND.google.rating} on Google.
      </p>
    </section>
  );
}
