// Layer boxes inside the 1015x1705 exploded frame (research/build_assets.py slices them).
export const FRAME = { w: 1015, h: 1705 };
export const LAYERS = [
  { id: "bottom-bun", box: [94, 1381, 872, 1685], size: [778, 304] },
  { id: "lettuce", box: [20, 1019, 995, 1381], size: [975, 362] },
  { id: "patty", box: [40, 671, 917, 1019], size: [877, 348] },
  { id: "cheese", box: [62, 362, 901, 671], size: [839, 309] },
  { id: "top-bun", box: [82, 20, 876, 362], size: [794, 342] },
] as const;

export const CENTER = 852; // vertical centre of the stack in frame pixels
