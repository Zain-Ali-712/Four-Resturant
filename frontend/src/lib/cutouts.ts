// Dishes we have with the background removed, so they can sit straight on a plate.
// Sources and how each was made are listed in research/scraped-data.md.

export type Cutout = { src: string; w: number; h: number };

export const CUTOUTS: Record<string, Cutout> = {
  "miami-catch": { src: "/img/hero/miami-catch.webp", w: 1031, h: 887 },
  "fish-four": { src: "/img/feature/fish-four.webp", w: 640, h: 803 },
  // Generated from the FP photo of this pizza (research: pizza-top-cut.png).
  "malai-boti-crown-crust-creamy-base-pizza": { src: "/img/pizza/malai-boti-top.webp", w: 1400, h: 1400 },
  // The generated layer art, modelled on this burger's Foodpanda ingredient list.
  "classic-new-york-burger": { src: "/img/feature/burger-closed.webp", w: 800, h: 661 },
  "new-york-fries": { src: "/img/cutout/new-york-fries.webp", w: 900, h: 436 },
  "matilda-shake": { src: "/img/cutout/matilda-shake.webp", w: 690, h: 900 },
  "plain-fries": { src: "/img/cutout/plain-fries.webp", w: 900, h: 333 },
};
