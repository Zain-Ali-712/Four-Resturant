import { LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

/** FOUR wordmark. Inherits `currentColor`, so set the colour with a text-* class. */
export function Logo({ className, title = "FOUR" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label={title} fill="currentColor">
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}

/**
 * The waving-hand mark FOUR uses as a corner badge on its posts. It's the O of
 * the wordmark, cropped out with a viewBox, so it stays identical to the logo.
 */
export function HandMark({ className, title = "FOUR" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="353 0 480 550" className={className} role="img" aria-label={title} fill="currentColor">
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
