import { HandMark } from "./Logo";

// Hand-drawn doodles in the spirit of FOUR's chalkboard wall ("Burger House", fries art)
// and their trays printed "LIVE, LOVE, EAT". All line art on a 100x100 grid, in currentColor.

type Kind =
  | "burger"
  | "fries"
  | "slice"
  | "pizza"
  | "shake"
  | "cup"
  | "wing"
  | "wrap"
  | "cookie"
  | "heart"
  | "sparkle"
  | "squiggle"
  | "flame"
  | "stamp"
  | "hand"
  | "arrow"
  | "dots";
type Style = "line" | "chalk" | "bold";

const PATHS: Record<Exclude<Kind, "stamp" | "hand">, string> = {
  burger:
    "M16 46 C16 22 84 22 84 46 Z M36 32 l3 -2 M50 28 l3 1 M62 33 l3 -2 M12 54 q6 -6 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 M15 61 h70 a6 6 0 0 1 0 12 h-70 a6 6 0 0 1 0 -12 Z M17 79 h66 a8 8 0 0 1 -8 10 h-50 a8 8 0 0 1 -8 -10 Z",
  fries: "M27 48 L73 48 L66 90 L34 90 Z M34 48 L29 16 M42 48 L40 9 M50 48 L50 14 M58 48 L61 8 M66 48 L71 18 M40 64 q10 8 20 0",
  slice: "M50 92 L17 23 Q50 6 83 23 Z M17 23 Q50 12 83 23 M44 40 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M60 56 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M47 72 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
  pizza:
    "M50 8 a42 42 0 1 0 0.1 0 Z M50 18 a32 32 0 1 0 0.1 0 M50 50 L50 18 M50 50 L78 66 M50 50 L22 66 M38 34 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M64 40 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M50 70 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
  shake: "M30 38 L70 38 L64 92 L36 92 Z M25 38 h50 M31 38 Q50 14 69 38 M56 26 L67 4 M38 54 h24 M40 66 h20",
  cup: "M28 24 h44 l-6 68 h-32 Z M24 24 h52 M58 24 l8 -18 h10 M36 46 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M54 58 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M42 74 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0",
  wing: "M64 18 C86 22 92 50 72 62 C62 68 52 64 46 58 L28 76 M30 70 a6 6 0 1 0 -4 10 a6 6 0 1 0 8 4 M58 30 q8 4 10 14",
  wrap: "M22 30 L70 16 L82 66 L34 86 Z M22 30 Q46 46 82 66 M34 86 Q30 56 22 30 M40 30 q4 8 12 6 M56 26 q4 8 12 6",
  cookie: "M50 10 a40 40 0 1 0 38 28 a10 10 0 0 1 -14 -12 a10 10 0 0 1 -12 -14 a40 40 0 0 0 -12 -2 Z M36 38 l4 2 M58 50 l4 -2 M40 64 l3 3 M62 70 l2 -3 M30 54 l3 -1",
  heart: "M50 86 C10 58 12 22 34 20 C44 19 50 28 50 34 C50 28 56 19 66 20 C88 22 90 58 50 86 Z",
  sparkle: "M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z",
  squiggle: "M4 50 q11 -22 22 0 t22 0 t22 0 t22 0",
  flame: "M50 92 C24 92 18 64 34 46 C36 60 44 62 46 56 C40 40 48 22 60 8 C60 30 82 40 80 64 C78 82 66 92 50 92 Z",
  arrow: "M8 74 C24 22 52 92 66 46 S86 20 92 26 M80 18 L92 26 L84 38",
  dots: "M20 20 h.1 M50 20 h.1 M80 20 h.1 M35 45 h.1 M65 45 h.1 M20 70 h.1 M50 70 h.1 M80 70 h.1",
};

const STROKE: Record<Style, { width: number; dash?: string }> = {
  line: { width: 3 },
  chalk: { width: 3.4, dash: "7 5" },
  bold: { width: 6 },
};

function Doodle({ kind, style }: { kind: Kind; style: Style }) {
  if (kind === "hand") return <HandMark className="size-full" title="" />;
  const { width, dash } = STROKE[style];
  if (kind === "stamp") {
    return (
      <svg viewBox="0 0 100 100" className="size-full" fill="none" stroke="currentColor" strokeWidth={width * 0.7}>
        <defs>
          <path id="doodle-ring" d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" />
        </defs>
        <circle cx="50" cy="50" r="46" strokeDasharray={dash} />
        <circle cx="50" cy="50" r="22" />
        <text fill="currentColor" stroke="none" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, letterSpacing: "0.12em" }}>
          <textPath href="#doodle-ring">LIVE · LOVE · EAT · LIVE · LOVE · EAT ·</textPath>
        </text>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={kind === "dots" ? width * 2.6 : width}
      strokeDasharray={kind === "dots" ? undefined : dash}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[kind]} />
    </svg>
  );
}

// Where doodles sit, per layout preset: a mix of big, medium and tiny marks spread round the
// edges and gaps of a section. The last few only show on wider screens.
const PRESETS = [
  ["top-10 right-[4%] size-28 rotate-12", "bottom-16 left-[2%] size-24 -rotate-12", "top-[38%] left-[46%] size-10 rotate-6", "top-[22%] left-[3%] size-14 -rotate-6", "bottom-[10%] right-[38%] size-20 rotate-[24deg] hidden md:block", "top-[52%] right-[2%] size-12 hidden md:block", "bottom-8 right-[6%] size-16 -rotate-12 hidden lg:block", "top-6 left-[34%] size-8 hidden lg:block"],
  ["top-8 left-[46%] size-20 -rotate-6 hidden md:block", "top-14 right-[3%] size-36 rotate-[18deg]", "bottom-10 left-[3%] size-20 rotate-12", "bottom-[30%] right-[2%] size-16 -rotate-12", "top-[40%] left-[1%] size-10 rotate-45", "bottom-6 left-[42%] size-14 rotate-6 hidden md:block", "top-[60%] right-[18%] size-8 hidden lg:block", "top-4 left-[8%] size-16 -rotate-[20deg] hidden lg:block"],
  ["-top-6 right-[10%] size-40 -rotate-12", "top-[38%] left-[1%] size-16 rotate-[24deg]", "bottom-12 right-[4%] size-20 rotate-6", "bottom-6 left-[40%] size-12", "top-10 left-[6%] size-24 rotate-12 hidden md:block", "top-[64%] right-[30%] size-10 -rotate-6 hidden md:block", "bottom-[24%] left-[18%] size-8 hidden lg:block", "top-[30%] right-[2%] size-14 rotate-45 hidden lg:block"],
  ["top-12 right-[22%] size-16 rotate-45", "top-6 right-[2%] size-24 -rotate-6", "bottom-14 right-[6%] size-32 rotate-12", "bottom-[22%] left-[2%] size-24 -rotate-[18deg]", "top-[46%] left-[38%] size-8 hidden md:block", "top-8 left-[3%] size-12 rotate-12 hidden md:block", "bottom-4 left-[30%] size-16 -rotate-6 hidden lg:block", "top-[30%] left-[1%] size-10 hidden lg:block"],
];
const STYLES: Style[] = ["line", "chalk", "bold", "line"];

/** Sits behind the section's content: the section needs `isolate` (its own stacking context). */
export function Doodles({ kinds, variant = 0, className = "" }: { kinds: Kind[]; variant?: number; className?: string }) {
  const slots = PRESETS[variant % PRESETS.length];
  const style = STYLES[variant % STYLES.length];
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      {slots.map((cls, i) => (
        <div key={i} className={`absolute ${cls}`}>
          {/* Alternate the stroke style inside a section too, so it feels drawn, not stamped. */}
          <Doodle kind={kinds[i % kinds.length]} style={i % 3 === 2 ? STYLES[(variant + 1) % STYLES.length] : style} />
        </div>
      ))}
    </div>
  );
}

/** Doodles that suit each menu category. */
export const CATEGORY_DOODLES: Record<string, Kind[]> = {
  pizza: ["slice", "pizza", "stamp", "sparkle", "squiggle", "dots"],
  "beef-smash-burgers": ["burger", "flame", "hand", "arrow", "sparkle", "dots"],
  "chicken-burgers": ["burger", "wing", "stamp", "squiggle", "sparkle", "heart"],
  "miami-catch": ["burger", "sparkle", "hand", "squiggle", "fries", "dots"],
  calzone: ["slice", "hand", "pizza", "arrow", "sparkle", "dots"],
  "loaded-fries": ["fries", "flame", "stamp", "sparkle", "squiggle", "heart"],
  wraps: ["wrap", "flame", "hand", "sparkle", "squiggle", "dots"],
  wings: ["wing", "flame", "sparkle", "arrow", "dots", "heart"],
  fries: ["fries", "stamp", "squiggle", "sparkle", "heart", "dots"],
  desserts: ["cookie", "heart", "sparkle", "hand", "squiggle", "dots"],
  shakes: ["shake", "sparkle", "hand", "squiggle", "heart", "dots"],
  "fizz-drinks": ["cup", "sparkle", "arrow", "stamp", "squiggle", "dots"],
  beverages: ["cup", "shake", "squiggle", "hand", "sparkle", "heart"],
};
export type { Kind as DoodleKind };
