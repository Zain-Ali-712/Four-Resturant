import type { Metadata, Viewport } from "next";
import { Chewy, DM_Sans, League_Spartan } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartFab } from "@/components/cart/CartFab";
import "./globals.css";

// Closest Google Fonts to FOUR's artwork: a heavy geometric sans like the wordmark,
// and a bouncy hand-lettered face like their campaign headlines.
const spartan = League_Spartan({ variable: "--font-spartan", subsets: ["latin"], weight: ["600", "700", "800", "900"] });
const chewy = Chewy({ variable: "--font-chewy", subsets: ["latin"], weight: "400" });
const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "FOUR — Savour the Flavours | Raya, DHA Lahore", template: "%s | FOUR Lahore" },
  description:
    "Smash burgers, crown crust pizzas, loaded fries and shakes at FOUR, Raya Fairways Phase 6, DHA Lahore. Open 1 PM to 3 AM. Order direct.",
};

export const viewport: Viewport = { themeColor: "#c8141a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spartan.variable} ${chewy.variable} ${dm.variable} antialiased`}>
      <body className="min-h-dvh">
        <CartProvider>
          <SmoothScroll>
            <Header />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
          <CartFab />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
