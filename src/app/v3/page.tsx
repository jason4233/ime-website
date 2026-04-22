import V3Client from "@/components/v3/V3Client";

export const metadata = {
  title: "I ME — Oriental Atelier v3 | 新視覺設計預覽",
  description:
    "v3 實驗版本:Sulwhasoo 人蔘暖意 + Tatcha 宣紙寧靜 + Whoo 朱砂印 + 台灣藥鋪卷軸",
  robots: {
    index: false, // 預覽頁不給 Google 抓
    follow: false,
  },
};

export default function V3Page() {
  return <V3Client />;
}
