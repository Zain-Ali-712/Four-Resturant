import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone, ShoppingBag, Star } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CENTER, LAYERS } from "@/lib/burger-layers";
import { Reveal } from "@/components/motion/Reveal";
import { Doodles } from "@/components/brand/Doodles";

// The burger from "Layer by layer", pulled apart a little further and left floating.
const SPREAD = 1.28;
const placed = LAYERS.map((l) => {
  const h = l.box[3] - l.box[1];
  const cy = CENTER + ((l.box[1] + l.box[3]) / 2 - CENTER) * SPREAD;
  return { ...l, top: cy - h / 2, h };
});
const minTop = Math.min(...placed.map((l) => l.top));
const height = Math.max(...placed.map((l) => l.top + l.h)) - minTop;
const WIDTH = 1015;
const TILT = [-4, 5, -3, 4, -6];

const FACTS = [
  { icon: Clock, label: "Open daily", value: BRAND.hours.replace(", every day", "") },
  { icon: MapPin, label: "Delivering to", value: BRAND.deliveryArea },
  { icon: Star, label: "On Google", value: `${BRAND.google.rating} · ${BRAND.google.reviews.toLocaleString("en-PK")} reviews` },
];

export function OrderDirect() {
  return (
    <section className="isolate grain relative overflow-hidden bg-[linear-gradient(180deg,#1f0b0c_0%,var(--color-char)_100%)] py-24 text-cream md:py-32">
      <Doodles kinds={["fries", "cup", "sparkle", "heart", "arrow", "dots"]} variant={1} className="text-cream/[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_78%_50%,rgba(200,20,26,.42),transparent_70%),radial-gradient(40%_40%_at_10%_100%,rgba(232,169,58,.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-3 text-sm font-bold tracking-[0.3em] text-gold uppercase">
              <span className="h-px w-10 bg-gold/60" /> Order direct
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display max-w-3xl text-[clamp(2.8rem,6.2vw,5.75rem)]">
              Straight from <span className="script text-red-hot normal-case">our kitchen</span> to your door
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-lg text-cream/70">
              Build your order here, check out in under a minute, and we&apos;ll bring it across {BRAND.deliveryArea}. Or pick it up from Raya.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-red px-8 text-lg font-bold text-cream shadow-[0_18px_40px_-14px_rgba(200,20,26,.8)] transition hover:bg-red-hot"
            >
              Start your order <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={BRAND.phoneHref} className="inline-flex h-14 items-center gap-3 rounded-full border-2 border-cream/20 px-6 font-bold transition hover:border-cream/60 hover:bg-cream/5">
              <Phone className="size-5" /> {BRAND.phone}
            </a>
          </Reveal>

          <Reveal delay={0.24}>
            <dl className="mt-12 grid overflow-hidden rounded-3xl bg-cream/[0.04] ring-1 ring-cream/10 backdrop-blur sm:grid-cols-3">
              {FACTS.map(({ icon: Icon, label, value }, i) => (
                <div key={label} className={`flex gap-3 p-5 ${i ? "border-t border-cream/10 sm:border-t-0 sm:border-l" : ""}`}>
                  <Icon className="mt-0.5 size-5 shrink-0 text-gold" />
                  <div>
                    <dt className="text-xs font-bold tracking-[0.2em] text-cream/50 uppercase">{label}</dt>
                    <dd className="mt-1 text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="relative mx-auto h-[min(80vw,440px)] lg:h-[min(72svh,620px)]" style={{ aspectRatio: `${WIDTH}/${height}` }} aria-hidden>
          {/* Spinning stamp */}
          <div className="absolute -top-4 -right-6 z-10 grid size-28 place-items-center rounded-full bg-red shadow-[0_20px_40px_-12px_rgba(0,0,0,.6)] md:-right-12 md:size-36">
            <svg viewBox="0 0 200 200" className="absolute inset-0 size-full animate-[spin_22s_linear_infinite]">
              <defs>
                <path id="order-ring" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
              </defs>
              <text className="fill-cream text-[20px] font-extrabold tracking-[0.3em] uppercase">
                <textPath href="#order-ring">Order direct · FOUR · Raya ·</textPath>
              </text>
            </svg>
            <ShoppingBag className="size-8 text-gold md:size-10" strokeWidth={2.2} />
          </div>

          {placed.map((l, i) => (
            <div
              key={l.id}
              className="absolute"
              style={{
                left: `${(l.box[0] / WIDTH) * 100}%`,
                top: `${((l.top - minTop) / height) * 100}%`,
                width: `${((l.box[2] - l.box[0]) / WIDTH) * 100}%`,
                height: `${(l.h / height) * 100}%`,
                zIndex: i + 1,
                transform: `rotate(${TILT[i]}deg)`,
              }}
            >
              <div className="size-full animate-[float-y_7s_ease-in-out_infinite]" style={{ animationDelay: `${-i * 0.9}s` }}>
                <Image
                  src={`/img/burger/${l.id}.webp`}
                  alt=""
                  width={l.size[0]}
                  height={l.size[1]}
                  sizes="(min-width: 1024px) 380px, 60vw"
                  className="size-full object-contain drop-shadow-[0_26px_30px_rgba(0,0,0,.6)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
