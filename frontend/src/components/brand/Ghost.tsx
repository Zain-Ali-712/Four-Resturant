import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

// Oversized, flat lettering that fades out towards the bottom: a quiet signature, not a feature.
// `id` must be unique on the page (it names the gradient).

function Fade({ id, top, color = "var(--color-cream)", floor = 0 }: { id: string; top: number; color?: string; floor?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" style={{ stopColor: color }} stopOpacity={top} />
      <stop offset="55%" style={{ stopColor: color }} stopOpacity={Math.max(top * 0.32, floor)} />
      <stop offset="100%" style={{ stopColor: color }} stopOpacity={floor} />
    </linearGradient>
  );
}

/** The FOUR wordmark, flat. */
export function GhostLogo({ id, className, top = 0.3 }: { id: string; className?: string; top?: number }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden>
      <defs>
        <Fade id={id} top={top} />
      </defs>
      <path fillRule="evenodd" d={LOGO_PATH} fill={`url(#${id})`} />
    </svg>
  );
}

/** A line of display type stretched to the full width of its box at every size. */
export function GhostText({
  id,
  text,
  className,
  top = 0.26,
  color,
  floor,
}: {
  id: string;
  text: string;
  className?: string;
  top?: number;
  /** Fill colour; cream by default. */
  color?: string;
  /** Opacity at the bottom edge. 0 fades the letters out; above 0 keeps them whole. */
  floor?: number;
}) {
  return (
    <svg viewBox="0 0 1000 116" className={className} preserveAspectRatio="xMidYMin meet" aria-hidden>
      <defs>
        <Fade id={id} top={top} color={color} floor={floor} />
      </defs>
      <text
        x="500"
        y="92"
        textAnchor="middle"
        textLength="960"
        lengthAdjust="spacingAndGlyphs"
        fill={`url(#${id})`}
        style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 112, letterSpacing: "-0.03em", textTransform: "uppercase" }}
      >
        {text}
      </text>
    </svg>
  );
}
