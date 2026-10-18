import type { Metadata } from "next";
import { MenuView } from "@/components/menu/MenuView";
import { MenuHero } from "@/components/menu/MenuHero";

export const metadata: Metadata = {
  title: "Menu",
  description: "FOUR's full menu: pizzas, beef smash burgers, chicken burgers, loaded fries, wings, shakes and fizz drinks. Order direct.",
};

export default function MenuPage() {
  return (
    <>
      <MenuHero />
      <MenuView />
    </>
  );
}
