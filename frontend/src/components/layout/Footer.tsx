import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND, NAV } from "@/lib/brand";
import { Logo } from "@/components/brand/Logo";
import { GhostLogo } from "@/components/brand/Ghost";
import { Socials } from "@/components/brand/Socials";

// "Savour the Flavours at Four." (IG bio): the last word is set as the wordmark.
const LEAD = BRAND.tagline.replace(/\s*Four\.?$/i, "");

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-red-deep)_0%,var(--color-red)_55%,var(--color-red-hot)_100%)] text-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_12%_0%,rgba(255,140,100,.20),transparent_70%),radial-gradient(60%_50%_at_85%_100%,rgba(255,180,120,.22),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-20 pb-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="FOUR home" className="inline-flex w-max flex-col gap-2">
            <span className="script text-[1.75rem] whitespace-nowrap text-cream sm:text-3xl">{LEAD}</span>
            <Logo className="block w-full text-cream" title="" />
          </Link>
          <Socials className="mt-8 -ml-1" itemClassName="size-11 bg-maroon/40 text-cream ring-1 ring-cream/15 hover:bg-cream hover:text-red" />
        </div>
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-cream/60 uppercase">Visit</h3>
          <p className="leading-relaxed">{BRAND.address}</p>
          <a href={BRAND.mapsUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline">
            Get directions <ArrowUpRight className="size-4" />
          </a>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-cream/60 uppercase">Open daily</h3>
          <p>{BRAND.hours}</p>
          <a href={BRAND.phoneHref} className="mt-3 block font-semibold">
            {BRAND.phone}
          </a>
          <p className="mt-1 text-sm text-cream/70">Delivering across {BRAND.deliveryArea}</p>
        </div>
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-cream/60 uppercase">Explore</h3>
          <ul className="space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:underline underline-offset-4">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-wrap justify-between gap-2 border-t border-cream/15 px-4 py-6 text-xs text-cream/60 sm:px-8">
        <p>© FOUR Restaurant, Lahore.</p>
        <p>Concept website — menu and prices from FOUR&apos;s Foodpanda listing, October 2026.</p>
      </div>

      {/* Oversized flat wordmark: only the top half shows, fading out as it runs off the page. */}
      <div className="relative mx-auto mt-2 aspect-[1699/300] w-[94vw] overflow-hidden select-none" aria-hidden>
        <GhostLogo id="footer-four" className="absolute inset-x-0 top-0 block w-full" top={0.34} />
      </div>
    </footer>
  );
}
