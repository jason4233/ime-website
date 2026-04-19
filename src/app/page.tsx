import { OrganizationJsonLd, ProductJsonLd, ServiceJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import HomeClient from "@/components/HomeClient";

// Direct render (no Loader) — 測試最單純的 SSR path
export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ProductJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />
      <HomeClient />
    </>
  );
}
