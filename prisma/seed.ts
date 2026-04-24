import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════════
//   Idempotent seed
//   - Admin user: always upsert（密碼可能改）
//   - 內容資料：如果該表已經有資料，整個跳過（避免重複塞）
//   這樣每次 build / re-deploy 都可以安全跑一次
// ═══════════════════════════════════════════════════════════════

async function seedAdmin() {
  const adminPassword = await hash(
    process.env.ADMIN_PASSWORD || "ime2024admin",
    12
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@ime-beauty.com" },
    update: { hashedPassword: adminPassword, role: "ADMIN" },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@ime-beauty.com",
      hashedPassword: adminPassword,
      name: "管理員",
      role: "ADMIN",
    },
  });
  console.log("  ✓ Admin user ensured");
}

async function seedIfEmpty<T>(
  name: string,
  counter: () => Promise<number>,
  seeder: () => Promise<T>
) {
  const count = await counter();
  if (count > 0) {
    console.log(`  ↷ ${name} 已有 ${count} 筆資料，略過`);
    return;
  }
  await seeder();
  console.log(`  ✓ ${name} 建立完成`);
}

async function main() {
  console.log("🌱 Seeding database...");

  await seedAdmin();

  // ═══ Hero Section ═══
  await seedIfEmpty(
    "Hero section",
    () => prisma.heroSection.count(),
    () =>
      prisma.heroSection.create({
        data: {
          headline: "妳的美，從來不是奢望",
          subheadline: "每一滴源自醫學中心的外泌體，都是妳早該給自己的答案。",
          ctaText: "預約體驗",
          ctaLink: "/contact",
          isActive: true,
          order: 0,
        },
      })
  );

  // ═══ Founders (3) ═══
  await seedIfEmpty(
    "Founders",
    () => prisma.founder.count(),
    async () => {
      const founders = [
        {
          name: "Moli Chou",
          title: "CEO",
          bio: "25年中醫五行營養學底蘊，將東方智慧與現代醫美結合。曾以60分鐘舞台銷講創造700萬保養品業績。",
          quote: "每一位顧客都能感受到專業、信任、蛻變的力量。",
          order: 0,
        },
        {
          name: "Louis Shieh",
          title: "秘書長",
          bio: "資深美業管理經驗，統籌品牌營運與教育培訓體系。",
          quote: "教育是品牌最有力的推動引擎。",
          order: 1,
        },
        {
          name: "王俊翔",
          title: "星誠細胞生醫 董事長",
          bio: "帶領星誠細胞生醫取得國際INCI認證，推動外泌體產業化。",
          quote: "讓世界看見台灣生技的實力。",
          order: 2,
        },
      ];
      for (const f of founders) {
        await prisma.founder.create({ data: f });
      }
    }
  );

  // ═══ Courses (3) ═══
  await seedIfEmpty(
    "Courses",
    () => prisma.course.count(),
    async () => {
      const courses = [
        {
          name: "外泌體美容入門體驗課",
          shortDesc: "90分鐘認識外泌體，親身體驗臉部導入療程",
          fullDesc:
            "從外泌體科學原理到實際操作體驗，帶您了解為什麼外泌體是下一代保養革命。課程含臉部導入體驗一次。",
          durationMinutes: 90,
          price: 2999,
          suitableFor: "一般消費者、保養愛好者",
          order: 0,
        },
        {
          name: "CDMO 無菌自動化製程專業解析",
          shortDesc: "深入博訊生技3A-GTP全自動化產線",
          fullDesc:
            "了解全球唯一iCellPro-3A1000無人化細胞製備系統、品質管控流程、與傳統GTP實驗室的差異。適合醫美從業人員進修。",
          durationMinutes: 180,
          price: 5999,
          suitableFor: "美容師、護理師、醫美從業人員",
          order: 1,
        },
        {
          name: "經銷美容師培訓認證班",
          shortDesc: "技術培訓 + 銷售實戰 + 結業認證",
          fullDesc:
            "完整的外泌體應用技術培訓，包含臉部/身體點位實操、儀器SOP、現場演練與結業考核。通過者獲頒I ME外泌體應用結業證書。",
          durationMinutes: 300,
          price: 15000,
          suitableFor: "想成為I ME經銷夥伴的美容師、護理師",
          order: 2,
        },
      ];
      for (const c of courses) {
        await prisma.course.create({ data: c });
      }
    }
  );

  // ═══ Testimonials (5) ═══
  await seedIfEmpty(
    "Testimonials",
    () => prisma.testimonial.count(),
    async () => {
      const testimonials = [
        {
          customerName: "林小姐",
          age: 32,
          courseType: "外泌體美容入門體驗課",
          rating: 5,
          content:
            "做完雷射後用了外泌體凍晶，泛紅退得比以前快好多，朋友都問我是不是換了醫美診所。",
          order: 0,
        },
        {
          customerName: "陳護理師",
          age: 28,
          courseType: "經銷美容師培訓認證班",
          rating: 5,
          content:
            "上完課才知道原來外泌體的製程這麼講究，有CDMO認證的跟一般的根本不能比。現在跟客人介紹更有底氣。",
          order: 1,
        },
        {
          customerName: "張太太",
          age: 45,
          courseType: "外泌體美容入門體驗課",
          rating: 5,
          content:
            "用了三個月，膚況整個穩定下來了。最感動的是老公說我看起來比結婚的時候還年輕。",
          order: 2,
        },
        {
          customerName: "王美容師",
          age: 35,
          courseType: "經銷美容師培訓認證班",
          rating: 5,
          content:
            "培訓很扎實，不只教技術還教怎麼跟客人溝通。拿到證書後客源明顯增加，回購率超高。",
          order: 3,
        },
        {
          customerName: "黃小姐",
          age: 38,
          courseType: "外泌體美容入門體驗課",
          rating: 5,
          content:
            "以前花了好多冤枉錢在各種保養品上，直到遇到I ME才覺得：原來保養可以這麼確定。",
          order: 4,
        },
      ];
      for (const t of testimonials) {
        await prisma.testimonial.create({ data: t });
      }
    }
  );

  // ═══ News Cards (10) ═══
  await seedIfEmpty(
    "News cards",
    () => prisma.newsCard.count(),
    async () => {
      const newsCards = [
        { mediaName: "台灣新聞雲報", title: "台灣生技醫療產業鏈三箭齊發！星誠、巨興、星和攜手臨床驗證", isFeatured: true },
        { mediaName: "經濟日報", title: "博訊生技全球首創智能自動化細胞備製產線" },
        { mediaName: "工商時報", title: "外泌體保養新趨勢：從醫學中心走入日常美容" },
        { mediaName: "自由時報", title: "台中榮總專利技術轉移 外泌體美容進入量產時代" },
        { mediaName: "TVBS", title: "2,000億顆外泌體濃縮一安瓶 生技美容新突破" },
        { mediaName: "ETtoday", title: "美業新寵！外泌體凍晶讓雷射術後修復加速80%" },
        { mediaName: "中時新聞網", title: "INCI國際認證 台灣外泌體原料登上世界舞台" },
        { mediaName: "聯合報", title: "從護理師到品牌CEO 她用外泌體翻轉美業" },
        { mediaName: "鏡週刊", title: "全台唯一CDMO細胞製備代工 博訊生技的獨門技術" },
        { mediaName: "三立新聞", title: "醫美術後保養革命：外泌體比傳統修復快近8成" },
      ];
      for (let i = 0; i < newsCards.length; i++) {
        await prisma.newsCard.create({
          data: {
            ...newsCards[i],
            excerpt: "媒體報導摘要文字（待替換）",
            date: new Date(2025, 6 + Math.floor(i / 3), 1 + i * 3),
            order: i,
            isFeatured: newsCards[i].isFeatured ?? false,
          },
        });
      }
    }
  );

  // ═══ Certificates (4) ═══
  await seedIfEmpty(
    "Certificates",
    () => prisma.certificate.count(),
    async () => {
      const certificates = [
        { title: "INCI 國際原料登錄", issuer: "Personal Care Products Council", order: 0 },
        { title: "衛部醫器製字第 008446 號", issuer: "台灣衛生福利部", order: 1 },
        { title: "發明專利 — 具有組織細胞裝置的設備", issuer: "中國國家知識產權局", order: 2 },
        { title: "韓國發明專利 10-1793032", issuer: "Korean Intellectual Property Office", order: 3 },
      ];
      for (const c of certificates) {
        await prisma.certificate.create({ data: c });
      }
    }
  );

  // ═══ Factory Highlights ═══
  await seedIfEmpty(
    "Factory highlights",
    () => prisma.factoryHighlight.count(),
    async () => {
      const highlights = [
        {
          section: "RND" as const,
          title: "台中榮總專利技術",
          description: "神經外科楊孟寅醫師專利技術轉移，臍帶間質幹細胞外泌體提取技術",
          order: 0,
        },
        {
          section: "RND" as const,
          title: "國際 INCI 認證",
          description: "Mono ID: 40148，全球認可的化妝品原料登錄",
          order: 1,
        },
        {
          section: "FACTORY" as const,
          title: "3A-GTP 全自動化製程",
          description: "全球獨家全自動化細胞備製平台，確保每批次品質一致",
          order: 2,
        },
        {
          section: "FACTORY" as const,
          title: "iCellPro-3A1000 無人化系統",
          description: "博訊生技自主研發的智能自動化細胞製備系統",
          order: 3,
        },
      ];
      for (const h of highlights) {
        await prisma.factoryHighlight.create({ data: h });
      }
    }
  );

  // ═══ Products (1) ═══
  await seedIfEmpty(
    "Products",
    () => prisma.product.count(),
    async () => {
      await prisma.product.create({
        data: {
          name: "USC-E SiUPi POWDER\n外泌體凍晶",
          tagline: "1mL Lyophilized Ampoule",
          description:
            "不是疊加一層保養，\n是送一封訊息給妳的細胞。\n\n每 1mL 含 2,000 億顆外泌體，76.8–99.4 nm 粒徑，表達 CD9 / CD63 標記。",
          price: null,
          order: 0,
        },
      });
    }
  );

  // ═══ Site Settings ═══
  await seedIfEmpty(
    "Site settings",
    () => prisma.siteSettings.count(),
    () =>
      prisma.siteSettings.create({
        data: {
          siteTitle: "I ME — Exosome Beauty for you",
          siteDescription: "人體外泌體美容科技品牌",
          contactPhone: "0976282794",
        },
      })
  );

  console.log("\n✅ Seed completed (idempotent).");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
