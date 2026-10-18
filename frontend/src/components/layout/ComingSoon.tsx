import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HandMark } from "@/components/brand/Logo";

export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="grain relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-red px-4 text-center text-cream">
      <HandMark className="absolute top-1/2 left-1/2 h-[120vmin] w-auto -translate-x-1/2 -translate-y-1/2 animate-[float-y_7s_ease-in-out_infinite] text-red-deep/60" title="" />
      <div className="relative">
        <p className="mb-4 text-sm font-bold tracking-[0.3em] text-gold uppercase">{title}</p>
        <h1 className="display text-[clamp(4rem,14vw,11rem)]">
          Coming <span className="script block text-cream normal-case">soon</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-cream/80">We&apos;re still cooking this page. In the meantime, the menu is ready.</p>
        <Link href="/menu" className="group mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-cream px-8 text-lg font-bold text-red transition hover:bg-white">
          See the menu <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
