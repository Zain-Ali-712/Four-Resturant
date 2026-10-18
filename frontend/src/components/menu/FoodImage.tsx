import Image from "next/image";
import { HandMark } from "@/components/brand/Logo";
import { imageSize } from "@/lib/menu";

const TONES = {
  red: "bg-red text-cream",
  dark: "bg-[radial-gradient(circle_at_50%_40%,var(--color-maroon),var(--color-maroon-deep))] text-cream",
  cream: "bg-cream-warm text-red",
};

/**
 * A menu item's photo, or, when FOUR has no clean photo of that item, a branded
 * card with the hand mark. We never show stock or watermarked images.
 */
export function FoodImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority,
  tone = "red",
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Placeholder colours, so it sits well on red, dark or light sections. */
  tone?: "red" | "dark" | "cream";
}) {
  if (!src) {
    return (
      <div className={`grid place-items-center ${TONES[tone]} ${className}`} role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <HandMark className="h-12 w-auto opacity-90" title="" />
          <span className="script text-2xl leading-tight">{alt}</span>
        </div>
      </div>
    );
  }
  const [w, h] = imageSize(src);
  return <Image src={src} alt={alt} width={w} height={h} sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
