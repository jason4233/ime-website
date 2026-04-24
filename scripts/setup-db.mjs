#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//   一鍵建立資料表 + Seed 起始資料
//   前置：先確認 DATABASE_URL 可以連線到 Supabase（必要時用 pooler URL）
//
//   用法：
//     npm run setup:db
// ═══════════════════════════════════════════════════════════════

import { execSync } from "node:child_process";

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch {
    console.error(`\n❌ 指令執行失敗：${cmd}`);
    process.exit(1);
  }
}

console.log("🚀 Step 1/3: 產生 Prisma Client");
run("npx prisma generate");

console.log("\n🚀 Step 2/3: 推送 schema 到 Supabase（建立 13 張資料表）");
run("npx prisma db push --accept-data-loss");

console.log("\n🚀 Step 3/3: Seed 起始資料（管理員帳號 + 範例內容）");
run("npx prisma db seed");

console.log(`
🎉 資料庫初始化完成！

預設管理員帳號：
  Email:    ${process.env.ADMIN_EMAIL || "admin@ime-beauty.com"}
  Password: ${process.env.ADMIN_PASSWORD || "ime2024admin"}

接下來：
  1. npm run dev
  2. 到 http://localhost:3000/admin/login 登入後台
`);
