import { HandMark } from "@/components/brand/Logo";
import { MENU } from "@/lib/menu";

/** Two counter-scrolling bands of FOUR's real menu categories. */
export function Marquee() {
  const words = MENU.map((c) => c.name);
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center gap-8 pr-8">
      {words.map((w) => (
        <span key={w} className="flex items-center gap-8">
          <span className="display text-4xl whitespace-nowrap md:text-6xl">{w}</span>
          <HandMark className="h-8 w-auto shrink-0 md:h-11" title="" />
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label="Menu categories" className="relative z-10 -my-6 overflow-hidden py-10">
      <div className="-rotate-2 bg-red-hot py-4 text-cream shadow-xl">
        <div className="flex w-max animate-[marquee_38s_linear_infinite]">{[row("a"), row("b")]}</div>
      </div>
      <div className="-mt-3 rotate-1 bg-cream py-3 text-red">
        <div className="flex w-max animate-[marquee_46s_linear_infinite_reverse]">{[row("c"), row("d")]}</div>
      </div>
    </section>
  );
}
