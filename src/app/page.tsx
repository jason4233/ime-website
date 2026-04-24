import { OrganizationJsonLd, ProductJsonLd, ServiceJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import HomeClient from "@/components/HomeClient";
import {
  getHero,
  getBrandStory,
  getFounders,
  getProducts,
  getCertificates,
  getTestimonials,
  getNews,
  getBeforeAfter,
  getSiteSettings,
} from "@/lib/content";

export default async function Home() {
  // 平行 fetch 所有 CMS 資料 — DB 沒資料或失敗時 getter 會回空值，不會 crash
  const [
    hero,
    brandStory,
    founders,
    products,
    certificates,
    testimonials,
    news,
    beforeAfter,
    siteSettings,
  ] = await Promise.all([
    getHero(),
    getBrandStory(),
    getFounders(),
    getProducts(),
    getCertificates(),
    getTestimonials(),
    getNews(),
    getBeforeAfter(),
    getSiteSettings(),
  ]);

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <ProductJsonLd />
      <ServiceJsonLd />
      <FAQJsonLd />
      <HomeClient
        cms={{
          hero,
          brandStory,
          founders,
          products,
          certificates,
          testimonials,
          news,
          beforeAfter,
          siteSettings,
        }}
      />
    </>
  );
}
