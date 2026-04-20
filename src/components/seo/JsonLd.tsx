/**
 * Structured data for SEO — schema.org JSON-LD
 * 所有 URL 來自 SITE_URL（env 驅動）→ 換網域零改 code
 */
import { SITE_URL } from "@/lib/site-url";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "I ME",
    alternateName: ["i me", "I ME 外泌體美容", "I ME Exosome Beauty"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/42707_0.jpg`,
      width: 1200,
      height: 400,
    },
    image: `${SITE_URL}/images/42707_0.jpg`,
    description:
      "I ME 是以臍帶間質幹細胞外泌體（UC-MSC Exosome）為核心的新美業品牌。原料來自台中榮總神經外科楊孟寅醫師專利技術,星誠細胞生醫研發、博訊生技 CDMO 3A-GTP 全自動化製程。",
    foundingDate: "2024",
    founders: [
      { "@type": "Person", name: "周沫璃 Moli Chou", jobTitle: "CEO" },
    ],
    knowsAbout: [
      "外泌體", "Exosome", "臍帶間質幹細胞", "UC-MSC",
      "新美業", "醫美", "抗老", "肌膚修護",
      "泌容術", "外泌體保養",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+886-976-282-794",
        contactType: "customer service",
        areaServed: "TW",
        availableLanguage: ["Chinese", "English"],
      },
    ],
    sameAs: [
      "https://www.stellarcellbio.com/",
      "https://www.drsignal.com.tw/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products#usc-e`,
    name: "USC-E 外泌體凍晶 · SiUPi POWDER",
    alternateName: ["修秘凍晶", "USC-D", "I ME 外泌體原液"],
    category: "美容保養 / 精華液 / 外泌體",
    image: [
      `${SITE_URL}/images/42706_0.jpg`,
    ],
    description:
      "每 1mL 安瓶含 2,000 億顆外泌體,平均粒徑 76.8–99.4 nm,表達 CD9、CD63 外泌體特徵標誌物。INCI 國際原料登錄 Mono ID 40148、TFDA 衛部醫器製字第 008446 號、中韓發明專利。由台中榮總楊孟寅醫師專利技術、星誠細胞生醫研發、博訊生技 3A-GTP CDMO 製程生產。",
    brand: {
      "@type": "Brand",
      name: "I ME",
    },
    manufacturer: {
      "@type": "Organization",
      name: "星誠細胞生醫 StellarCell BioMedicine",
      url: "https://www.stellarcellbio.com/",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "外泌體濃度", value: "2,000 億顆 / mL" },
      { "@type": "PropertyValue", name: "粒徑範圍", value: "76.8–99.4 nm" },
      { "@type": "PropertyValue", name: "標誌物", value: "CD9、CD63" },
      { "@type": "PropertyValue", name: "INCI Mono ID", value: "40148" },
      { "@type": "PropertyValue", name: "TFDA 核可", value: "衛部醫器製字第 008446 號" },
    ],
    hasCertification: [
      { "@type": "Certification", name: "INCI 國際原料登錄", issuedBy: "Personal Care Products Council" },
      { "@type": "Certification", name: "TFDA 醫療器材許可證", issuedBy: "台灣衛生福利部" },
      { "@type": "Certification", name: "中國發明專利" },
      { "@type": "Certification", name: "韓國發明專利" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: "泌容術 — 外泌體美容療程",
    alternateName: ["外泌體療程", "泌容體驗"],
    serviceType: "BeautyTreatment",
    provider: {
      "@type": "Organization",
      name: "I ME",
      url: SITE_URL,
    },
    description:
      "I ME 泌容術結合臍帶間質幹細胞外泌體原液與專業導入技術,提供深度潔淨、外泌體導入與細胞修復的專業美容療程。",
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/contact`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite schema with SearchAction — enables Google sitelinks search box */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "I ME — Exosome Beauty for you",
    description: "外泌體美容新美業品牌｜I ME",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "zh-TW",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQ schema — 觸發 Google rich snippet FAQ block */
export function FAQJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "I ME 的外泌體是什麼?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I ME 使用的是 UC-MSC 臍帶間質幹細胞外泌體（Exosome）,直徑約 76.8–99.4 nm,是細胞與細胞之間傳遞修復訊息的奈米級囊泡。由星誠細胞生醫研發、博訊生技 CDMO 生產,每 1mL 含 2,000 億顆。",
        },
      },
      {
        "@type": "Question",
        name: "I ME 的原料來源可靠嗎?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I ME 原料技術源自台中榮民總醫院神經外科楊孟寅醫師專利,由星誠細胞生醫 × 博訊生技 3A-GTP 全自動化製程生產。已取得 INCI 國際原料登錄 Mono ID 40148、TFDA 衛部醫器製字第 008446 號、中韓發明專利。",
        },
      },
      {
        "@type": "Question",
        name: "什麼是「新美業」?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "新美業是以科技（例如外泌體、幹細胞、AI 肌膚檢測）為核心的下一代美容產業。I ME 透過泌容術培訓,讓美容師、護理師或想轉職者能學到以外泌體為基礎的專業療程技術,結業後取得認證並可開業接案。",
        },
      },
      {
        "@type": "Question",
        name: "I ME 產品與星誠修秘晶露的關係?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I ME 的 USC-E / SiUPi POWDER 對應星誠細胞生醫原廠的「修秘晶露 USC-E（液態）」與「修秘凍晶 USC-D（乾粉）」。I ME 為終端美容品牌,星誠為上游原料廠,博訊為 CDMO 生產。",
        },
      },
      {
        "@type": "Question",
        name: "I ME 培訓課程要多久?適合誰?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "I ME 泌容術培訓分為初次體驗、煥膚修護、深度抗老三階段。適合美容師、護理師、想轉職新美業者。由創始總代理一對一指導,結業取得認證後可開業接案或加入 I ME 加盟體系。",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** BreadcrumbList — 方便 search result 顯示麵包屑 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
