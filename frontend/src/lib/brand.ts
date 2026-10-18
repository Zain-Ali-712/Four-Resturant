// Every value here traces to research/scraped-data.md (scraped 2026-10-16).
// Source keys: FP = Foodpanda, IG = Instagram, GM = Google Maps.

export const BRAND = {
  name: "FOUR",
  tagline: "Savour the Flavours at Four.", // IG bio
  phone: "+92 325 1231222", // GM, IG captions
  phoneHref: "tel:+923251231222",
  address: "Plaza no. 51, Raya Fairways Phase 6, DHA, Lahore, 54810", // IG bio
  hours: "1 PM – 3 AM, every day", // GM
  deliveryArea: "DHA Phase 6 & 7, Lahore", // IG DeZczvvDUmS
  mapsUrl: "https://maps.app.goo.gl/7mcZJXo5zSXxe7xj9", // IG bio link
  instagram: "https://www.instagram.com/fourpakistan_/",
  threads: "https://www.threads.com/@fourpakistan_",
  foodpanda: "https://www.foodpanda.pk/restaurant/lmmc/four",
  google: { rating: 4.6, reviews: 6503, fiveStar: 5402 }, // GM
  foodpandaRating: { rating: 4.7, reviews: 219 }, // FP
  igFollowers: 96116, // IG
} as const;

/**
 * Real 5-star Google reviews (GM), quoted word for word. "…" marks where a review
 * is shortened; only spacing and capitalisation are tidied. First name and initial only.
 */
export const REVIEWS = [
  { name: "Urooj F.", stars: 5, text: "From food to service everything is top notch, fresh & delicious." },
  { name: "Humna F.", stars: 5, text: "I came from Islamabad today and visited four restaurant… I haven't eaten this much soft crust pizza before. And the wings were awesome." },
  { name: "Muhammad R.", stars: 5, text: "Crown crust pizza creamy sauce best of all. Bangkok fries delicious…" },
  { name: "Rayan A.", stars: 5, text: "Came… from Karachi to Lahore just to try FOUR, absolutely loved the burger ♥️" },
  { name: "Arslan D.", stars: 5, text: "I found this place perfect for beef burgers. Their staff was very cooperative and humble…" },
  { name: "Atyq R.", stars: 5, text: "It was a wonderful experience… the environment was aesthetic and the food was of premium quality and tasted great" },
] as const;

/** Google Maps review tags with mention counts (GM). */
export const REVIEW_TAGS = [
  ["cooperative staff", 101],
  ["beef burger", 91],
  ["malai boti pizza", 36],
  ["chipotle burger", 19],
  ["wings", 19],
  ["smash burger", 14],
] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
