import { OrganizationJsonLd, ProductJsonLd, ServiceJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import HomeClientLoader from "@/components/HomeClientLoader";

// 首頁策略：
// - Server Component 層：純粹 SEO 結構化資料（JsonLd）
// - Client-only 層：HomeClientLoader → dynamic(ssr:false) → HomeClient（所有互動 section）
// 這樣 metadata/JsonLd 還是 server-rendered（SEO 友好），但重互動內容完全跳過 hydration。
export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ProductJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />
      <HomeClientLoader />
    </>
  );
}
