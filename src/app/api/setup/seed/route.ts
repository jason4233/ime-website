import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// ═══════════════════════════════════════════════════════════════
//   POST /api/_setup/seed
//   用來在部署後「第一次」塞起始資料用。
//   需要 Authorization: Bearer <REVALIDATE_SECRET>。
//   已經有資料的 table 會自動跳過 → 可以重複呼叫不會重複塞。
// ═══════════════════════════════════════════════════════════════

// 避免 Vercel serverless timeout
export const maxDuration = 60;

async function seedIfEmpty<T>(
  name: string,
  counter: () => Promise<number>,
  seeder: () => Promise<T>,
  log: string[]
) {
  const count = await counter();
  if (count > 0) {
    log.push(`↷ ${name}: 已有 ${count} 筆，略過`);
    return;
  }
  await seeder();
  log.push(`✓ ${name}: 建立完成`);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 }
    );
  }
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  try {
    // Admin user (always upsert)
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
    log.push(`✓ Admin user 已更新 / 建立`);

    // Hero
    await seedIfEmpty(
      "Hero section",
      () => prisma.heroSection.count(),
      () =>
        prisma.heroSection.create({
          data: {
            headline: "妳的美，從來不是奢望",
            subheadline:
              "每一滴源自醫學中心的外泌體，都是妳早該給自己的答案。",
            ctaText: "我想預約",
            ctaLink: "#appointment",
            isActive: true,
            order: 0,
          },
        }),
      log
    );

    // Founders
    await seedIfEmpty(
      "Founders",
      () => prisma.founder.count(),
      async () => {
        const founders = [
          {
            name: "Moli Chou",
            title: "CEO",
            bio: "25年中醫五行營養學底蘊，將東方智慧與現代醫美結合。\n\n曾以60分鐘舞台銷講創造700萬保養品業績。",
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
      },
      log
    );

    // Courses
    await seedIfEmpty(
      "Courses",
      () => prisma.course.count(),
      async () => {
        for (const c of [
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
              "了解全球唯一iCellPro-3A1000無人化細胞製備系統、品質管控流程、與傳統GTP實驗室的差異。",
            durationMinutes: 180,
            price: 5999,
            suitableFor: "美容師、護理師、醫美從業人員",
            order: 1,
          },
          {
            name: "經銷美容師培訓認證班",
            shortDesc: "技術培訓 + 銷售實戰 + 結業認證",
            fullDesc:
              "完整的外泌體應用技術培訓，包含臉部/身體點位實操、儀器SOP、現場演練與結業考核。",
            durationMinutes: 300,
            price: 15000,
            suitableFor: "想成為I ME經銷夥伴的美容師、護理師",
            order: 2,
          },
        ]) {
          await prisma.course.create({ data: c });
        }
      },
      log
    );

    // Testimonials
    await seedIfEmpty(
      "Testimonials",
      () => prisma.testimonial.count(),
      async () => {
        for (const t of [
          { customerName: "林小姐", age: 32, courseType: "外泌體美容入門體驗課", rating: 5, content: "做完雷射後用了外泌體凍晶，泛紅退得比以前快好多，朋友都問我是不是換了醫美診所。", order: 0 },
          { customerName: "陳護理師", age: 28, courseType: "經銷美容師培訓認證班", rating: 5, content: "上完課才知道原來外泌體的製程這麼講究，有CDMO認證的跟一般的根本不能比。現在跟客人介紹更有底氣。", order: 1 },
          { customerName: "張太太", age: 45, courseType: "外泌體美容入門體驗課", rating: 5, content: "用了三個月，膚況整個穩定下來了。最感動的是老公說我看起來比結婚的時候還年輕。", order: 2 },
          { customerName: "王美容師", age: 35, courseType: "經銷美容師培訓認證班", rating: 5, content: "培訓很扎實，不只教技術還教怎麼跟客人溝通。拿到證書後客源明顯增加，回購率超高。", order: 3 },
          { customerName: "黃小姐", age: 38, courseType: "外泌體美容入門體驗課", rating: 5, content: "以前花了好多冤枉錢在各種保養品上，直到遇到I ME才覺得：原來保養可以這麼確定。", order: 4 },
        ]) {
          await prisma.testimonial.create({ data: t });
        }
      },
      log
    );

    // News
    await seedIfEmpty(
      "News",
      () => prisma.newsCard.count(),
      async () => {
        const items = [
          { mediaName: "台灣新聞雲報", title: "台灣生技醫療產業鏈三箭齊發！星誠、巨興、星和攜手臨床驗證", isFeatured: true },
          { mediaName: "經濟日報", title: "博訊生技全球首創智能自動化細胞備製產線" },
          { mediaName: "工商時報", title: "外泌體保養新趨勢：從醫學中心走入日常美容" },
          { mediaName: "自由時報", title: "台中榮總專利技術轉移 外泌體美容進入量產時代" },
          { mediaName: "TVBS", title: "2,000億顆外泌體濃縮一安瓶 生技美容新突破" },
        ];
        for (let i = 0; i < items.length; i++) {
          await prisma.newsCard.create({
            data: {
              ...items[i],
              excerpt: "媒體報導摘要文字",
              date: new Date(2025, 6 + Math.floor(i / 3), 1 + i * 3),
              order: i,
              isFeatured: items[i].isFeatured ?? false,
            },
          });
        }
      },
      log
    );

    // Certificates
    await seedIfEmpty(
      "Certificates",
      () => prisma.certificate.count(),
      async () => {
        for (const c of [
          { title: "INCI 國際原料登錄 Mono ID 40148", issuer: "Personal Care Products Council", imageUrl: "/images/660080_0.jpg", order: 0 },
          { title: "衛部醫器製字第 008446 號", issuer: "台灣衛生福利部", imageUrl: "/images/660174_0.jpg", order: 1 },
          { title: "中國發明專利 — 組織細胞裝置設備", issuer: "中國國家知識產權局", imageUrl: "/images/660083_0.jpg", order: 2 },
          { title: "韓國發明專利 10-1793032", issuer: "Korean Intellectual Property Office", imageUrl: "/images/660085_0.jpg", order: 3 },
        ]) {
          await prisma.certificate.create({ data: c });
        }
      },
      log
    );

    // Factory
    await seedIfEmpty(
      "Factory highlights",
      () => prisma.factoryHighlight.count(),
      async () => {
        for (const h of [
          { section: "RND" as const, title: "台中榮總專利技術", description: "神經外科楊孟寅醫師專利技術轉移，臍帶間質幹細胞外泌體提取技術", order: 0 },
          { section: "RND" as const, title: "國際 INCI 認證", description: "Mono ID: 40148，全球認可的化妝品原料登錄", order: 1 },
          { section: "FACTORY" as const, title: "3A-GTP 全自動化製程", description: "全球獨家全自動化細胞備製平台，確保每批次品質一致", order: 2 },
          { section: "FACTORY" as const, title: "iCellPro-3A1000 無人化系統", description: "博訊生技自主研發的智能自動化細胞製備系統", order: 3 },
        ]) {
          await prisma.factoryHighlight.create({ data: h });
        }
      },
      log
    );

    // Products
    await seedIfEmpty(
      "Products",
      () => prisma.product.count(),
      () =>
        prisma.product.create({
          data: {
            name: "USC-E SiUPi POWDER\n外泌體凍晶",
            tagline: "1mL Lyophilized Ampoule",
            description:
              "不是疊加一層保養，\n是送一封訊息給妳的細胞。\n\n每 1mL 含 2,000 億顆外泌體，76.8–99.4 nm 粒徑，表達 CD9 / CD63 標記。",
            imageUrl: "/images/42706_0.jpg",
            order: 0,
          },
        }),
      log
    );

    // Settings
    await seedIfEmpty(
      "Site settings",
      () => prisma.siteSettings.count(),
      () =>
        prisma.siteSettings.create({
          data: {
            siteTitle: "I ME — Exosome Beauty for you",
            siteDescription: "人體外泌體美容科技品牌 · I ME",
            contactPhone: "0976282794",
          },
        }),
      log
    );

    // Brand story
    await seedIfEmpty(
      "Brand story",
      () => prisma.brandStorySection.count(),
      async () => {
        for (const a of [
          {
            title: "所有的「還可以」，\n都是對自己的一種將就。",
            bodyRichText:
              "妥協那張被拍得不好看的照片，\n妥協鏡子裡越來越陌生的自己，\n妥協「沒辦法，年紀到了」這六個字。",
            order: 0,
          },
          {
            title: "直到妳知道，\n細胞之間有郵差。",
            bodyRichText:
              "外泌體——細胞與細胞之間的訊息郵差。\n它把「修護」這個訊息，送到該去的地方。\n而臍帶間質幹細胞分泌的外泌體，是郵差裡最溫柔的那一種。",
            order: 1,
          },
          {
            title: "i me，\n是妳對自己的一次重新選擇。",
            bodyRichText:
              "我們不想說服妳變美，\n我們想讓妳想起——\n妳本來就值得每天早上醒來，看鏡子時微微笑一下。",
            order: 2,
          },
        ]) {
          await prisma.brandStorySection.create({ data: a });
        }
      },
      log
    );

    return NextResponse.json({
      ok: true,
      message: "Seed 完成",
      steps: log,
    });
  } catch (err) {
    console.error("[seed endpoint] failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        steps: log,
      },
      { status: 500 }
    );
  }
}

// GET 回傳當前統計（方便觀察）
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.REVALIDATE_SECRET;

  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const [
      admins,
      hero,
      brandStory,
      founders,
      products,
      courses,
      certificates,
      news,
      testimonials,
      beforeAfter,
      factory,
      appointments,
      applications,
      settings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.heroSection.count(),
      prisma.brandStorySection.count(),
      prisma.founder.count(),
      prisma.product.count(),
      prisma.course.count(),
      prisma.certificate.count(),
      prisma.newsCard.count(),
      prisma.testimonial.count(),
      prisma.beforeAfterCase.count(),
      prisma.factoryHighlight.count(),
      prisma.appointment.count(),
      prisma.distributorApplication.count(),
      prisma.siteSettings.count(),
    ]);

    return NextResponse.json({
      admins,
      hero,
      brandStory,
      founders,
      products,
      courses,
      certificates,
      news,
      testimonials,
      beforeAfter,
      factory,
      appointments,
      applications,
      settings,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
