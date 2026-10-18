import { MapPin } from "lucide-react";
import { BRAND } from "@/lib/brand";

// Lucide dropped brand marks, so the two social logos are drawn here (24px grid, like lucide).
export function Instagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function Threads({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.19 22h-.01c-3.12-.02-5.52-1.05-7.13-3.06C3.6 17.15 2.86 14.67 2.83 12v-.01c.03-2.67.77-5.15 2.22-6.94C6.66 3.05 9.06 2.02 12.18 2h.01c2.39.02 4.39.63 5.95 1.83 1.46 1.13 2.49 2.73 3.06 4.77l-1.78.5c-.96-3.45-3.4-5.21-7.24-5.24-2.53.02-4.45.82-5.7 2.37C5.31 7.68 4.7 9.73 4.68 12c.02 2.27.63 4.32 1.8 5.77 1.25 1.56 3.17 2.36 5.7 2.37 2.28-.02 3.79-.55 5.04-1.79 1.43-1.41 1.4-3.13.95-4.17-.27-.62-.75-1.13-1.4-1.52-.16 1.17-.53 2.11-1.1 2.82-.76.94-1.84 1.46-3.2 1.53-1.03.06-2.03-.19-2.8-.69-.92-.6-1.45-1.5-1.51-2.56-.06-1.03.35-1.97 1.15-2.66.77-.66 1.85-1.04 3.12-1.11.94-.05 1.81-.01 2.62.12-.11-.65-.33-1.17-.66-1.54-.45-.51-1.15-.77-2.07-.78h-.03c-.74 0-1.75.2-2.39 1.15l-1.54-1.03c.86-1.27 2.25-1.97 3.93-1.97h.04c2.8.02 4.47 1.73 4.64 4.73.1.04.19.08.28.12 1.31.62 2.27 1.55 2.77 2.7.7 1.6.77 4.22-1.36 6.31-1.63 1.6-3.61 2.32-6.41 2.34zm.88-9.86c-.21 0-.43.01-.65.02-1.6.09-2.6.82-2.54 1.87.06 1.1 1.27 1.61 2.43 1.55 1.07-.06 2.46-.48 2.69-3.24a9.2 9.2 0 0 0-1.93-.2z" />
    </svg>
  );
}

const LINKS = [
  { label: "Instagram", href: BRAND.instagram, Icon: Instagram },
  { label: "Threads", href: BRAND.threads, Icon: Threads },
  { label: "Google Maps", href: BRAND.mapsUrl, Icon: MapPin },
] as const;

/** FOUR's real channels: Instagram, Threads and the Google Maps listing from their IG bio. */
export function Socials({ className = "", itemClassName = "" }: { className?: string; itemClassName?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`FOUR on ${label}`}
            className={`grid size-10 place-items-center rounded-full transition hover:-translate-y-0.5 ${itemClassName}`}
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
