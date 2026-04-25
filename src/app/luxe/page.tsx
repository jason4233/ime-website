import LuxeClient from "@/components/luxe/LuxeClient";
import { getHero, getProducts, getFounders, getTestimonials } from "@/lib/content";

export const metadata = {
  title: "I ME Luxe — Cellular Atelier｜外泌體精品保養",
  description: "細胞層級的訊息，包覆在最溫柔的工藝裡。每 1mL 安瓶含 2,000 億顆臍帶間質幹細胞外泌體。",
};

export default async function LuxePage() {
  const [hero, products, founders, testimonials] = await Promise.all([
    getHero(),
    getProducts(),
    getFounders(),
    getTestimonials(),
  ]);
  return (
    <LuxeClient
      cms={{ hero, products, founders, testimonials }}
    />
  );
}
