import { OrganizationJsonLd, ProductJsonLd, ServiceJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import HomeClientLoader from "@/components/HomeClientLoader";

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
