import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "聯繫我們 — 預約體驗 · 加盟諮詢｜I ME 外泌體美容",
  description:
    "I ME 外泌體美容品牌全台據點：台北、台中、高雄三地辦公室。預約泌容術體驗、加盟代理諮詢、新美業培訓報名。團隊成員一對一服務：周沫璃 CEO、Louis Shieh 秘書長、林于喬護理師、邱婕玲南區、黃揚仁中區。",
  keywords: [
    "I ME 聯繫", "I ME 預約", "I ME 加盟", "外泌體預約",
    "泌容術預約", "新美業加盟", "I ME 台北", "I ME 台中", "I ME 高雄",
    "周沫璃", "Louis Shieh", "林于喬", "邱婕玲", "黃揚仁",
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "聯繫 I ME — 預約體驗 · 加盟諮詢",
    description: "台北、台中、高雄三地據點。預約泌容術體驗、加盟代理、新美業培訓。",
    url: `${SITE_URL}/contact`,
    images: ["/images/653614_0.jpg"],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
