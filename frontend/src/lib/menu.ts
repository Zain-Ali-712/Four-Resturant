import { IMAGE_SIZES, MENU } from "./menu-data";
import type { MenuItem } from "./menu-types";

export { MENU };
export type { MenuCategory, MenuItem } from "./menu-types";

const BY_ID = new Map(MENU.flatMap((c) => c.items.map((i) => [i.id, { ...i, category: c.name }] as const)));

export function getItem(id: string) {
  return BY_ID.get(id);
}

/** Look up a menu item that the site hard-codes, and fail the build if the scrape no longer has it. */
export function mustGetItem(id: string): MenuItem & { category: string } {
  const item = BY_ID.get(id);
  if (!item) throw new Error(`Menu item "${id}" is missing from menu-data.ts`);
  return item;
}

export function imageSize(src: string): [number, number] {
  return IMAGE_SIZES[src] ?? [1200, 900];
}

const pkr = new Intl.NumberFormat("en-PK");
export function formatPKR(n: number) {
  return `Rs. ${pkr.format(n)}`;
}

export function priceLabel(item: Pick<MenuItem, "price" | "from">) {
  return item.from ? `From ${formatPKR(item.price)}` : formatPKR(item.price);
}
