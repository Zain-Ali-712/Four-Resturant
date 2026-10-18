"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Flame, Search, Sparkles, X } from "lucide-react";
import { MENU, mustGetItem, priceLabel, type MenuCategory, type MenuItem } from "@/lib/menu";
import { AddToCart } from "@/components/cart/AddToCart";
import { HandMark } from "@/components/brand/Logo";
import { CATEGORY_DOODLES, Doodles } from "@/components/brand/Doodles";
import { WideItemCard } from "./WideItemCard";
import { CUTOUTS } from "@/lib/cutouts";
import { FoodImage } from "./FoodImage";
import { getLenis } from "@/components/motion/SmoothScroll";

const EASE = [0.16, 1, 0.3, 1] as const;
type Detail = MenuItem & { category: string };

// Limited-edition items get the Specials section instead of a regular category block.
const SPECIAL_CAT = "miami-catch";
const LIMITED = [
  { item: mustGetItem("miami-catch"), cutout: "/img/hero/miami-catch.webp", w: 1031, h: 887, line: "Crispy on the outside, tender on the inside." },
  { item: mustGetItem("fish-four"), cutout: "/img/feature/fish-four.webp", w: 640, h: 803, line: "Fish tenders and crinkle-cut fries in FOUR paper." },
];
const POPULAR = MENU.flatMap((c) => c.items.filter((i) => i.popular).map((i) => ({ ...i, category: c.name })));

// Category sections take turns between three looks, so the long page has rhythm.
const THEMES = {
  light: {
    section: "bg-paper text-ink",
    eyebrow: "text-red",
    muted: "text-ink/50",
    doodle: "text-red/[0.14]",
    rim: "bg-red shadow-[inset_0_-24px_50px_rgba(0,0,0,.25),0_40px_60px_-30px_rgba(140,15,20,.6)]",
    ring: "border-cream/30",
    halo: "text-red/50",
    featureText: "text-ink/65",
    featurePrice: "text-red",
    featureAdd: "solid",
    card: "bg-white ring-1 ring-ink/5 hover:shadow-[0_26px_50px_-30px_rgba(140,15,20,.45)]",
    cardText: "text-ink/60",
    price: "text-red",
    tone: "red",
  },
  red: {
    section: "grain bg-red text-cream",
    eyebrow: "text-gold",
    muted: "text-cream/60",
    doodle: "text-cream/[0.16]",
    rim: "bg-maroon-deep shadow-[inset_0_-24px_50px_rgba(0,0,0,.35),0_40px_60px_-30px_rgba(51,5,10,.8)]",
    ring: "border-cream/20",
    halo: "text-cream/40",
    featureText: "text-cream/80",
    featurePrice: "text-gold",
    featureAdd: "cream",
    card: "bg-cream-warm text-ink shadow-[0_26px_44px_-30px_rgba(51,5,10,.8)]",
    cardText: "text-ink/60",
    price: "text-red",
    tone: "dark",
  },
  dark: {
    section: "bg-char text-cream",
    eyebrow: "text-gold",
    muted: "text-cream/50",
    doodle: "text-gold/[0.13]",
    rim: "bg-red shadow-[inset_0_-24px_50px_rgba(0,0,0,.3),0_40px_60px_-30px_rgba(0,0,0,.8)]",
    ring: "border-cream/25",
    halo: "text-cream/25",
    featureText: "text-cream/65",
    featurePrice: "text-gold",
    featureAdd: "solid",
    card: "bg-char-2 text-cream ring-1 ring-cream/10 hover:ring-red/60",
    cardText: "text-cream/55",
    price: "text-gold",
    tone: "red",
  },
} as const;
const ORDER = ["light", "red", "dark"] as const;

/** The category's lead dish. */
function pickFeature(items: MenuItem[]) {
  // Dishes we can plate without a background come first, then photos, then anything.
  return items.find((i) => i.popular && CUTOUTS[i.id]) ?? items.find((i) => CUTOUTS[i.id]) ?? items.find((i) => i.popular && i.image) ?? items.find((i) => i.image) ?? items.find((i) => i.popular) ?? items[0];
}

/** Columns that fill every row, so no dish ends up alone on the last line. */
function gridCols(n: number) {
  const cols = [4, 3].find((c) => n % c === 0) ?? [3, 4].find((c) => n % c !== 1) ?? 3;
  return cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3";
}

export function MenuView() {
  const [active, setActive] = useState("specials");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const sections = useRef<Record<string, HTMLElement | null>>({});
  const tabs = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      MENU.filter((c) => q || c.id !== SPECIAL_CAT)
        .map((c) => ({
          ...c,
          items: q ? c.items.filter((i) => `${i.name} ${i.description} ${c.name}`.toLowerCase().includes(q)) : c.items,
        }))
        .filter((c) => c.items.length),
    [q],
  );
  const tabList = useMemo(() => (q ? filtered : [{ id: "specials", name: "Specials" }, ...filtered]), [q, filtered]);

  // Highlight the section under the sticky tabs.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    Object.values(sections.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  useEffect(() => {
    tabs.current?.querySelector(`[data-tab="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = sections.current[id];
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-red/10 bg-paper/90 pt-20 backdrop-blur-md transition-[padding] duration-500 ease-(--ease-out-expo) sm:pt-24 [html[data-header-hidden]_&]:pt-3">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-3 sm:px-8 md:flex-row md:items-center">
          <label className="relative md:w-72">
            <span className="sr-only">Search the menu</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, fries, shakes…"
              className="h-11 w-full rounded-full border border-ink/10 bg-white pr-10 pl-10 text-sm outline-none focus:border-red focus:ring-4 focus:ring-red/10"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-3 -translate-y-1/2 text-ink/40 hover:text-red">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div ref={tabs} className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0" role="tablist" aria-label="Menu categories">
            <LayoutGroup>
              {tabList.map((c) => (
                <button
                  key={c.id}
                  data-tab={c.id}
                  role="tab"
                  aria-selected={active === c.id}
                  onClick={() => jump(c.id)}
                  className={`relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors ${active === c.id ? "text-cream" : "text-ink/70 hover:text-red"}`}
                >
                  {active === c.id && <motion.span layoutId="menu-tab" className="absolute inset-0 -z-10 rounded-full bg-red" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                  {c.id === "specials" && <Sparkles className="size-3.5" />}
                  {c.name}
                </button>
              ))}
            </LayoutGroup>
          </div>
        </div>
      </div>

      {!q && (
        <Specials
          ref={(el) => {
            sections.current.specials = el;
          }}
          onOpen={setDetail}
        />
      )}

      {filtered.length === 0 && (
        <p className="bg-paper px-4 py-32 text-center">
          <span className="script block text-4xl text-red">Nothing called &ldquo;{query}&rdquo;</span>
          <span className="mt-2 block text-ink/60">Try &ldquo;burger&rdquo;, &ldquo;fries&rdquo; or &ldquo;shake&rdquo;.</span>
        </p>
      )}

      {filtered.map((c, idx) => (
        <CategorySection
          key={c.id}
          category={c}
          index={idx}
          total={filtered.length}
          theme={ORDER[idx % ORDER.length]}
          onOpen={setDetail}
          ref={(el) => {
            sections.current[c.id] = el;
          }}
        />
      ))}

      <p className="bg-paper px-4 py-10 text-center text-sm text-ink/50">
        Menu, descriptions and prices from FOUR&apos;s Foodpanda listing, October 2026. &ldquo;From&rdquo; prices are starting prices for items that come in more than one size.
      </p>

      <ItemDetail item={detail} onClose={() => setDetail(null)} />
    </>
  );
}

function Specials({ ref, onOpen }: { ref: React.Ref<HTMLElement>; onOpen: (d: Detail) => void }) {
  return (
    <section ref={ref} id="specials" className="isolate relative scroll-mt-28 overflow-hidden bg-ink py-16 text-cream md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_20%_30%,rgba(200,20,26,.35),transparent_70%),radial-gradient(40%_50%_at_85%_70%,rgba(232,169,58,.12),transparent_70%)]" />
      <Doodles kinds={["stamp", "sparkle", "fries", "burger"]} variant={2} className="text-gold/[0.12]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold tracking-[0.3em] text-gold uppercase">
              <Sparkles className="size-4" /> Specials
            </p>
            <h2 className="display text-[clamp(3rem,8vw,6.5rem)]">
              Limited <span className="script text-red-hot normal-case">edition</span>
            </h2>
          </div>
          <p className="script max-w-xs text-3xl text-cream/80">Grab the catch before it&apos;s too late.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {LIMITED.map(({ item, cutout, w, h, line }, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE }}
              className={`group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[2.25rem] p-7 md:p-9 ${
                i ? "bg-[linear-gradient(160deg,var(--color-char-2),var(--color-maroon-deep))]" : "bg-[linear-gradient(160deg,var(--color-red-hot),var(--color-red-deep))]"
              }`}
            >
              <HandMark className="pointer-events-none absolute -top-10 -right-10 h-72 w-auto text-cream/[0.06]" title="" />
              <button type="button" onClick={() => onOpen(item)} aria-label={`View ${item.name}`} className="absolute inset-x-0 top-0 flex h-[62%] items-center justify-center p-6">
                <Image
                  src={cutout}
                  alt={item.name}
                  width={w}
                  height={h}
                  sizes="(min-width: 768px) 520px, 90vw"
                  className="h-full w-auto object-contain drop-shadow-[0_34px_30px_rgba(0,0,0,.5)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-3"
                />
              </button>
              <span className="absolute top-6 left-6 rounded-full bg-gold px-3 py-1 text-xs font-bold tracking-wider text-ink uppercase">Limited edition</span>
              <div className="relative flex flex-col gap-5">
                <div>
                  <h3 className="display text-4xl md:text-5xl">{item.name}</h3>
                  <p className="mt-2 max-w-sm text-cream/75">{line}</p>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-cream/15 pt-5">
                  <span className="display text-3xl text-gold">{priceLabel(item)}</span>
                  <AddToCart id={item.id} name={item.name} variant="cream" compact />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-6 flex items-center gap-4">
            <h3 className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.3em] text-gold uppercase">
              <Flame className="size-4" /> Popular on Foodpanda
            </h3>
            <span className="h-px flex-1 bg-cream/10" />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: EASE }}
                className="group flex items-center gap-4 rounded-2xl bg-char-2 p-3 pr-4 ring-1 ring-cream/10 transition hover:ring-red/60"
              >
                <button type="button" onClick={() => onOpen(item)} aria-label={`View ${item.name}`} className="size-20 shrink-0 overflow-hidden rounded-xl">
                  <FoodImage src={item.image} alt={item.name} sizes="80px" className="size-full transition-transform duration-700 group-hover:scale-110 [&_.script]:hidden [&_svg]:h-8" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold tracking-[0.18em] text-cream/45 uppercase">{item.category}</p>
                  <p className="truncate font-bold">{item.name}</p>
                  <p className="text-sm font-bold text-gold">{priceLabel(item)}</p>
                </div>
                <AddToCart id={item.id} name={item.name} compact />
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  ref,
  category: c,
  index,
  total,
  theme,
  onOpen,
}: {
  ref: React.Ref<HTMLElement>;
  category: MenuCategory;
  index: number;
  total: number;
  theme: (typeof ORDER)[number];
  onOpen: (d: Detail) => void;
}) {
  const t = THEMES[theme];
  // Two dishes sit side by side as equals; otherwise one leads and the rest follow.
  const feature = c.items.length === 2 ? null : pickFeature(c.items);
  const rest = feature ? c.items.filter((i) => i.id !== feature.id) : c.items;
  const open = (item: MenuItem) => onOpen({ ...item, category: c.name });
  const flip = index % 2 === 1;
  const cutout = feature ? CUTOUTS[feature.id] : undefined;

  return (
    <section ref={ref} id={c.id} className={`isolate relative scroll-mt-28 overflow-hidden py-14 md:py-20 ${t.section}`}>
      <Doodles kinds={CATEGORY_DOODLES[c.id] ?? ["sparkle", "hand", "squiggle"]} variant={index} className={t.doodle} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`mb-2 text-sm font-bold tracking-[0.3em] tabular-nums uppercase ${t.eyebrow}`}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 className="display text-[clamp(2.4rem,5.5vw,4.5rem)]">{c.name}</h2>
            {c.note && <p className={`mt-3 ${t.muted}`}>{c.note}</p>}
          </div>
          <span className={`text-sm font-semibold ${t.muted}`}>
            {c.items.length} item{c.items.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Lead dish, plated like the home page features but smaller. */}
        {feature && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className={`mb-10 grid items-center gap-8 md:gap-14 ${flip ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-[auto_1fr]"}`}
          >
            <button
              type="button"
              onClick={() => open(feature)}
              aria-label={`View ${feature.name}`}
              className={`group relative mx-auto aspect-square w-[min(72vw,320px)] ${flip ? "md:order-2" : ""}`}
            >
              <span className={`dot-halo absolute -inset-[30%] ${t.halo}`} aria-hidden />
              <span className={`absolute inset-[6%] rounded-full ${t.rim}`}>
                <span className={`absolute inset-[7%] rounded-full border-2 border-dashed ${t.ring}`} />
                <HandMark className="absolute inset-0 m-auto h-1/2 w-auto text-cream/10" title="" />
              </span>
              {cutout ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={cutout.src}
                    alt={feature.name}
                    width={cutout.w}
                    height={cutout.h}
                    sizes="360px"
                    className="h-auto max-h-[96%] w-auto max-w-[104%] animate-[float-y_6s_ease-in-out_infinite] object-contain drop-shadow-[0_28px_26px_rgba(0,0,0,.45)] transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105"
                  />
                </span>
              ) : (
                // No clean photo of this dish yet: the plate carries its name instead.
                <span className="absolute inset-[18%] flex flex-col items-center justify-center gap-2 text-center text-cream">
                  <HandMark className="h-14 w-auto opacity-90" title="" />
                  <span className="script text-2xl leading-tight">{feature.name}</span>
                </span>
              )}
              {feature.popular && (
                <span className="absolute top-[4%] right-[2%] grid size-20 -rotate-12 place-items-center rounded-full bg-gold text-center text-ink shadow-lg">
                  <span className="display text-[11px] leading-tight">
                    <Flame className="mx-auto mb-0.5 size-4" />
                    Popular
                  </span>
                </span>
              )}
            </button>
            <div className={flip ? "md:order-1" : ""}>
              <p className={`mb-2 text-xs font-bold tracking-[0.25em] uppercase ${t.eyebrow}`}>{feature.popular ? "Popular on Foodpanda" : `${c.name} pick`}</p>
              <h3 className="display text-[clamp(2rem,4vw,3.25rem)]">{feature.name}</h3>
              {feature.description && <p className={`mt-3 max-w-md ${t.featureText}`}>{feature.description}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <span className={`display text-3xl ${t.featurePrice}`}>{priceLabel(feature)}</span>
                <AddToCart id={feature.id} name={feature.name} variant={t.featureAdd} className="w-auto" />
              </div>
            </div>
          </motion.div>
        )}

        {rest.length > 0 && rest.length <= 2 && (
          <ul className={`grid gap-4 ${rest.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-xl"}`}>
            {rest.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              >
                <WideItemCard item={item} onOpen={() => open(item)} tone={t.tone} className={`transition-shadow ${t.card}`} textClass={t.cardText} priceClass={t.price} />
              </motion.li>
            ))}
          </ul>
        )}

        {rest.length > 2 && (
          <ul className={`grid gap-4 ${gridCols(rest.length)}`}>
            {rest.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.05, ease: EASE }}
                className={`group flex flex-col overflow-hidden rounded-[1.4rem] transition-shadow ${t.card}`}
              >
                <button type="button" onClick={() => open(item)} className="relative block overflow-hidden text-left" aria-label={`View ${item.name}`}>
                  <motion.div layoutId={`img-${item.id}`}>
                    <FoodImage
                      src={item.image}
                      alt={item.name}
                      tone={t.tone}
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 100vw"
                      className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-105 [&_.script]:text-lg [&_svg]:h-9"
                    />
                  </motion.div>
                  {item.popular && (
                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-ink">
                      <Flame className="size-3" /> Popular
                    </span>
                  )}
                </button>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <h3 className="leading-tight font-bold">{item.name}</h3>
                  {item.description && <p className={`line-clamp-2 text-sm ${t.cardText}`}>{item.description}</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className={`font-bold ${t.price}`}>{priceLabel(item)}</span>
                    <AddToCart id={item.id} name={item.name} compact />
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ItemDetail({ item, onClose }: { item: Detail | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div className="fixed inset-0 z-[55] grid place-items-end bg-ink/60 backdrop-blur-sm sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={item.name}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-[2rem] bg-paper sm:rounded-[2rem]"
          >
            <motion.div layoutId={`img-${item.id}`}>
              <FoodImage src={item.image} alt={item.name} sizes="(min-width: 640px) 672px, 100vw" className="aspect-[16/10] w-full" />
            </motion.div>
            <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-paper/90 text-ink shadow">
              <X className="size-5" />
            </button>
            <div className="space-y-4 p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.25em] text-red uppercase">{item.category}</p>
              <h2 className="display text-4xl">{item.name}</h2>
              {item.description && <p className="text-ink/70">{item.description}</p>}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="display text-3xl text-red">{priceLabel(item)}</span>
                <AddToCart id={item.id} name={item.name} />
              </div>
              {item.from && <p className="text-xs text-ink/50">This item comes in more than one size. The price shown is the starting price.</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
