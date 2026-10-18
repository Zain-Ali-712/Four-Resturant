"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Star } from "lucide-react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { BRAND } from "@/lib/brand";
import { formatPKR, mustGetItem } from "@/lib/menu";
import { HandMark, Logo } from "@/components/brand/Logo";
import { Instagram } from "@/components/brand/Socials";
import { Doodles } from "@/components/brand/Doodles";
import { AddToCart } from "@/components/cart/AddToCart";
import { WideItemCard } from "@/components/menu/WideItemCard";
import { Reveal } from "@/components/motion/Reveal";

const EASE = [0.16, 1, 0.3, 1] as const;
const miami = mustGetItem("miami-catch");
const fishFour = mustGetItem("fish-four");
// FOUR's latest post (IG DehHOloFmi5, 2026-10-15) is the Fish & Four reminder.
const FISH_POST = "https://www.instagram.com/p/DehHOloFmi5/";

// FOUR's dishes far back on the stage: small, a touch dull, and quiet.
const FAR = [
  { src: "/img/feature/burger-closed.webp", w: 800, h: 661, cls: "left-[44%] top-[12%] w-[6vw] min-w-12", depth: 1, rot: -8, d: 1.4 },
  { src: "/img/pizza/malai-boti-top.webp", w: 1400, h: 1400, cls: "-right-[2%] top-[8%] w-[11vw] min-w-20", depth: 0.8, rot: 20, d: 1.6 },
  { src: "/img/feature/fish-four.webp", w: 640, h: 803, cls: "left-[40%] bottom-[14%] w-[6.5vw] hidden md:block", depth: 0.6, rot: -18, d: 1.8 },
  { src: "/img/feature/burger-closed.webp", w: 800, h: 661, cls: "-left-[1%] bottom-[20%] w-[5vw] hidden md:block", depth: 0.9, rot: 12, d: 2 },
] as const;

// Specks streaming out of the void: fixed values, so server and client render the same.
const SPECKS = Array.from({ length: 18 }, (_, i) => ({
  a: `${i * 20 + (i % 3) * 7}deg`,
  r: `${260 + (i % 5) * 70}px`,
  delay: `${-((i * 0.77) % 6).toFixed(2)}s`,
  dur: `${5 + (i % 4)}s`,
  size: i % 4 === 0 ? 4 : 2,
}));

/**
 * Hero and the Miami Catch feature share one scroll scene: the burger in the hero
 * travels down with the page and lands on the plate in the next section.
 */
export function HeroMiami() {
  const root = useRef<HTMLDivElement>(null);
  const startSlot = useRef<HTMLDivElement>(null);
  const endSlot = useRef<HTMLDivElement>(null);
  const travel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const delta = () => {
        const a = startSlot.current!.getBoundingClientRect();
        const b = endSlot.current!.getBoundingClientRect();
        return { x: b.left + b.width / 2 - (a.left + a.width / 2), y: b.top + b.height / 2 - (a.top + a.height / 2), s: b.width / a.width };
      };

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            endTrigger: "#miami",
            end: "center center",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        })
        .to(travel.current, { x: () => delta().x, y: () => delta().y, scale: () => delta().s, rotate: 372, ease: "power1.inOut" }, 0)
        .to("[data-hero-pickle]", { y: -260, x: -120, rotate: -140, opacity: 0, ease: "none" }, 0)
        .to("[data-hero-void]", { scale: 0.5, opacity: 0, ease: "none" }, 0)
        .to("[data-hero-logo]", { y: 80, opacity: 0, ease: "none" }, 0)
        .to("[data-far]", { y: (_: number, el: HTMLElement) => -(1.2 - Number(el.dataset.depth)) * 420, opacity: 0, ease: "none" }, 0)
        .to("[data-hero-copy]", { y: -120, opacity: 0, ease: "none" }, 0)
        .fromTo("[data-plate]", { scale: 0.6, opacity: 0.3 }, { scale: 1, opacity: 1, ease: "power2.out" }, 0.35);

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {/* ---------------- HERO ---------------- */}
      <section className="grain relative z-20 min-h-[100svh] bg-red text-cream">
        {/* The stage: a lit centre falling off into maroon, with a floor receding into the distance. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(75%_65%_at_66%_46%,var(--color-red-hot)_0%,var(--color-red)_34%,var(--color-red-deep)_72%,var(--color-maroon)_100%)]" />
          <div
            className="absolute -inset-x-1/4 -bottom-[30%] h-[80%] origin-bottom opacity-50 [mask-image:radial-gradient(60%_70%_at_50%_70%,black,transparent)]"
            style={{
              transform: "perspective(1100px) rotateX(74deg)",
              backgroundImage: "repeating-radial-gradient(circle at 66% 60%, transparent 0 70px, rgba(51,5,10,.5) 70px 73px)",
            }}
          />

          {FAR.map((dish, i) => (
            <div key={i} data-far data-depth={dish.depth} className={`absolute ${dish.cls}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 0.95 - dish.depth * 0.15, scale: 1 }}
                transition={{ duration: 2.2, delay: dish.d, ease: EASE }}
                style={{ rotate: dish.rot, filter: "saturate(.95) brightness(.97)" }}
              >
                <Image src={dish.src} alt="" width={dish.w} height={dish.h} sizes="140px" className="w-full animate-[float-y_8s_ease-in-out_infinite] drop-shadow-[0_16px_14px_rgba(40,0,0,.4)]" />
              </motion.div>
            </div>
          ))}

          {/* Quiet signature, bottom right. */}
          <motion.div
            data-hero-logo
            className="absolute right-[3%] bottom-[9%] w-[64vw] md:w-[40vw]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
          >
            <Logo className="w-full text-cream/[0.09]" title="" />
          </motion.div>
        </div>

        <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-6 px-4 pt-24 pb-28 sm:px-8 md:grid-cols-[1.05fr_1fr] md:pb-20">
          <div data-hero-copy className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream/25 bg-maroon/40 py-1.5 pr-4 pl-1.5 text-sm font-semibold backdrop-blur"
            >
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold tracking-wider text-ink uppercase">New</span>
              Limited edition Miami Catch
            </motion.p>
            {/* FOUR's own tagline (IG bio), set on two lines. */}
            <h1 className="display text-[clamp(3.25rem,6.4vw,5.75rem)] drop-shadow-[0_6px_24px_rgba(51,5,10,.35)]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block whitespace-nowrap" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }}>
                  Savour the
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="script block text-[1.2em] text-cream normal-case"
                  initial={{ y: "110%", rotate: -6 }}
                  animate={{ y: 0, rotate: -3 }}
                  transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                >
                  Flavours
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
              className="mt-6 max-w-md text-lg text-cream/85"
            >
              Smash burgers, crown crust pizzas and loaded fries from Raya, DHA Lahore. Open {BRAND.hours.replace(", every day", "")}, every single day.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95, ease: EASE }} className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="group inline-flex h-14 items-center gap-3 rounded-full bg-cream px-7 text-lg font-bold text-red transition hover:bg-white">
                Order now
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href={BRAND.phoneHref} className="inline-flex h-14 items-center gap-3 rounded-full border-2 border-cream/40 px-6 font-bold transition hover:border-cream hover:bg-cream/10">
                <Phone className="size-5" /> Call to order
              </a>
            </motion.div>
          </div>

          {/* Dish slot: everything inside here travels into the Miami section. */}
          <div className="relative mx-auto aspect-[1031/887] w-[86vw] max-w-[640px] md:w-full">
            {/* The void the burger comes out of: a dark well, rings rushing outwards, specks streaming past. */}
            <div data-hero-void className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2" aria-hidden>
              <motion.div
                className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,var(--color-maroon-deep)_0%,rgba(51,5,10,.75)_22%,rgba(90,10,15,.35)_48%,transparent_72%)]"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.8, ease: EASE }}
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="absolute inset-[14%] rounded-full border border-cream/25 animate-[tunnel_6s_linear_infinite]"
                  style={{ animationDelay: `${-i * 1.2}s` }}
                />
              ))}
              {SPECKS.map((s, i) => (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 rounded-full bg-cream/80 animate-[warp_linear_infinite]"
                  style={{ width: s.size, height: s.size, transformOrigin: "0 0", animationDuration: s.dur, animationDelay: s.delay, "--a": s.a, "--r": s.r } as React.CSSProperties}
                />
              ))}
            </div>

            <motion.div
              data-hero-copy
              className="absolute inset-x-[10%] -bottom-[6%] h-[16%] rounded-[50%] bg-maroon-deep/60 blur-2xl"
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.6, delay: 0.6, ease: EASE }}
            />
            <div ref={startSlot} className="absolute inset-0" />
            <div ref={travel} className="absolute inset-0 will-change-transform">
              {/* Drifts out of the void: a speck far away, slowly growing to full size. */}
              <motion.div
                className="size-full"
                initial={{ scale: 0.02, opacity: 0, rotate: -40, filter: "blur(6px) brightness(.4)" }}
                animate={{ scale: 1, opacity: 1, rotate: -8, filter: "blur(0px) brightness(1)" }}
                transition={{
                  default: { duration: 3, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 1.2, delay: 0.4 },
                }}
              >
                <div className="size-full animate-[float-y_6s_ease-in-out_infinite]">
                  <Image
                    src="/img/hero/miami-catch.webp"
                    alt="FOUR's Miami Catch fish burger"
                    width={1031}
                    height={887}
                    priority
                    sizes="(min-width: 768px) 640px, 86vw"
                    className="size-full object-contain drop-shadow-[0_40px_40px_rgba(40,0,0,.45)]"
                  />
                </div>
              </motion.div>
            </div>
            <motion.div
              data-hero-pickle
              className="absolute -left-4 bottom-[8%] w-[18%]"
              initial={{ opacity: 0, scale: 0.05, rotate: -60 }}
              animate={{ opacity: 1, scale: 1, rotate: -12 }}
              transition={{ duration: 2.4, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src="/img/hero/pickle.webp" alt="" width={228} height={257} className="w-full animate-[float-y_4s_ease-in-out_infinite]" />
            </motion.div>
          </div>
        </div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          data-hero-copy
          className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl flex-wrap gap-x-10 gap-y-2 px-4 pb-6 text-sm sm:px-8"
        >
          <div className="flex items-center gap-2">
            <Star className="size-4 fill-gold text-gold" />
            <dt className="sr-only">Google rating</dt>
            <dd>
              <b>{BRAND.google.rating}</b> on Google · {BRAND.google.reviews.toLocaleString("en-PK")} reviews
            </dd>
          </div>
          <div>
            <dt className="sr-only">Instagram</dt>
            <dd>
              <b>{Math.round(BRAND.igFollowers / 1000)}K</b> on Instagram
            </dd>
          </div>
          <div>
            <dt className="sr-only">Delivery</dt>
            <dd>Delivering across {BRAND.deliveryArea}</dd>
          </div>
        </motion.dl>
      </section>

      {/* ---------------- MIAMI CATCH + FISH & FOUR ---------------- */}
      <section id="miami" className="isolate wrap-paper relative z-10 overflow-hidden bg-cream-warm bg-fixed py-16 md:py-20">
        <Doodles kinds={["burger", "fries", "sparkle", "heart", "squiggle", "stamp"]} variant={0} className="text-red/[0.12]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-8 md:grid-cols-2 md:gap-14">
          <div className="relative order-2 mx-auto aspect-square w-full max-w-[500px] md:order-1">
            <div className="dot-halo absolute -inset-[22%] bg-fixed text-red/40" aria-hidden />
            <div data-plate className="absolute inset-[6%] rounded-full bg-red shadow-[inset_0_-30px_60px_rgba(0,0,0,.25),0_50px_80px_-30px_rgba(140,15,20,.6)]">
              <div className="absolute inset-[7%] rounded-full border-2 border-dashed border-cream/25" />
              <HandMark className="absolute inset-0 m-auto h-1/2 w-auto text-cream/10" title="" />
            </div>
            {/* The hero burger lands here. */}
            <div ref={endSlot} className="absolute top-1/2 left-1/2 aspect-[1031/887] w-[92%] -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="order-1 md:order-2">
            <Reveal>
              <p className="mb-3 text-sm font-bold tracking-[0.25em] text-red uppercase">Limited edition</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="script text-[clamp(4.5rem,11vw,8.5rem)] text-red-hot">Miami</h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="script -mt-2 text-3xl text-ink md:text-4xl">catch your perfect match</p>
              <svg viewBox="0 0 300 24" className="mt-1 h-5 w-56 text-gold" aria-hidden>
                <path d="M4 16 C 80 4, 200 2, 296 12" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-md text-lg text-ink/75">
                &ldquo;We&apos;ve reeled in something golden, crunchy, and absolutely delicious.&rdquo; Crispy on the outside, tender on the inside. Grab the flavourful Miami Catch Burger before it&apos;s too late.
              </p>
            </Reveal>
            <Reveal delay={0.28} className="mt-6 flex flex-wrap items-center gap-5">
              <span className="display text-4xl text-red">{formatPKR(miami.price)}</span>
              <AddToCart id={miami.id} name={miami.name} className="w-auto" />
            </Reveal>
          </div>
        </div>

        {/* Fish & Four: FOUR's latest Instagram post, mirrored so the copy leads on the left. */}
        <div className="mx-auto mt-6 grid max-w-7xl items-center gap-10 px-4 sm:px-8 md:-mt-4 md:grid-cols-2 md:gap-14">
          <div>
            <Reveal>
              <a
                href={FISH_POST}
                target="_blank"
                rel="noreferrer"
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-red/10 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-red uppercase transition hover:bg-red hover:text-cream"
              >
                <Instagram className="size-3.5" /> Latest on our Instagram
              </a>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="script text-[clamp(3.8rem,9vw,7rem)] leading-[0.85] text-red-hot">
                Fish <span className="text-ink">&amp;</span> Four
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="script mt-2 text-3xl text-ink md:text-4xl">crispy tenders, crinkle fries</p>
              <svg viewBox="0 0 300 24" className="mt-1 h-5 w-56 text-gold" aria-hidden>
                <path d="M4 12 C 90 20, 210 22, 296 8" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-md text-lg text-ink/75">
                Golden fish tenders and a pile of crinkle-cut fries, wrapped in FOUR paper. Limited edition, like the Miami. &ldquo;Today&apos;s a good day to treat yourself to Four.&rdquo;
              </p>
            </Reveal>
            <Reveal delay={0.28} className="mt-6 flex flex-wrap items-center gap-5">
              <span className="display text-4xl text-red">{formatPKR(fishFour.price)}</span>
              <AddToCart id={fishFour.id} name={fishFour.name} className="w-auto" />
            </Reveal>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <div className="dot-halo absolute -inset-[22%] bg-fixed text-red/40" aria-hidden />
            <Reveal className="absolute inset-[6%]" y={0}>
              <div className="relative size-full rounded-full bg-ink shadow-[inset_0_-30px_60px_rgba(0,0,0,.4),0_50px_80px_-30px_rgba(28,13,14,.6)]">
                <div className="absolute inset-[7%] rounded-full border-2 border-dashed border-cream/15" />
                <HandMark className="absolute inset-0 m-auto h-1/2 w-auto text-cream/[0.06]" title="" />
              </div>
            </Reveal>
            <motion.div
              className="absolute inset-[4%]"
              initial={{ opacity: 0, scale: 0.6, rotate: 30 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ type: "spring", stiffness: 55, damping: 13 }}
            >
              <Image
                src="/img/feature/fish-four.webp"
                alt="Fish & Four: fish tenders and crinkle fries in FOUR paper"
                width={640}
                height={803}
                sizes="(min-width: 768px) 440px, 86vw"
                className="mx-auto h-full w-auto animate-[float-y_6s_ease-in-out_infinite] object-contain drop-shadow-[0_40px_36px_rgba(28,13,14,.5)]"
              />
            </motion.div>
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              whileInView={{ scale: 1, rotate: -12 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.4 }}
              className="absolute top-[6%] right-[4%] grid size-24 place-items-center rounded-full bg-gold text-center text-ink shadow-xl md:size-28"
            >
              <span className="display text-sm leading-tight">
                Limited
                <br />
                edition
              </span>
            </motion.span>
          </div>
        </div>

        {/* Both limited-edition items, side by side, right above the category bands. */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 px-4 sm:px-8 md:mt-14 md:grid-cols-2">
          {[miami, fishFour].map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08} className="h-full">
              <WideItemCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
