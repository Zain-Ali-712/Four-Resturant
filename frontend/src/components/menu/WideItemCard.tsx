"use client";

import { priceLabel, type MenuItem } from "@/lib/menu";
import { AddToCart } from "@/components/cart/AddToCart";
import { FoodImage } from "./FoodImage";

/** Short, wide card: photo on one side, name, description and add-to-order on the other. */
export function WideItemCard({
  item,
  onOpen,
  tone = "red",
  className = "bg-paper ring-1 ring-red/10 shadow-[0_18px_40px_-28px_rgba(140,15,20,.55)]",
  textClass = "text-ink/60",
  priceClass = "text-red",
}: {
  item: MenuItem;
  onOpen?: () => void;
  tone?: "red" | "dark" | "cream";
  className?: string;
  textClass?: string;
  priceClass?: string;
}) {
  const image = (
    <FoodImage
      src={item.image}
      alt={item.name}
      tone={tone}
      sizes="176px"
      className="size-full transition-transform duration-700 group-hover:scale-110 [&_.script]:hidden [&_svg]:h-10"
    />
  );
  return (
    <div className={`group flex h-full overflow-hidden rounded-[1.5rem] ${className}`}>
      {onOpen ? (
        <button type="button" onClick={onOpen} aria-label={`View ${item.name}`} className="relative w-32 shrink-0 overflow-hidden sm:w-44">
          {image}
        </button>
      ) : (
        <div className="relative w-32 shrink-0 overflow-hidden sm:w-44">{image}</div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <h3 className="text-lg leading-tight font-bold">{item.name}</h3>
        {item.description && <p className={`line-clamp-2 text-sm ${textClass}`}>{item.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={`font-bold ${priceClass}`}>{priceLabel(item)}</span>
          <AddToCart id={item.id} name={item.name} compact />
        </div>
      </div>
    </div>
  );
}
