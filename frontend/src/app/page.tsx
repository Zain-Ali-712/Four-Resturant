import { HeroMiami } from "@/components/home/HeroMiami";
import { Marquee } from "@/components/home/Marquee";
import { BurgerBuild } from "@/components/home/BurgerBuild";
import { PizzaPull } from "@/components/home/PizzaPull";
import { PopularRail } from "@/components/home/PopularRail";
import { Reviews } from "@/components/home/Reviews";
import { Visit } from "@/components/home/Visit";
import { OrderDirect } from "@/components/home/OrderDirect";

export default function Home() {
  return (
    <>
      <HeroMiami />
      <Marquee />
      <BurgerBuild />
      <PizzaPull />
      <PopularRail />
      <Reviews />
      <Visit />
      <OrderDirect />
    </>
  );
}
