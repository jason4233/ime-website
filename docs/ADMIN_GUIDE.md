# I ME 後台使用手冊

網站已經**上線**，後台可以用，前台會即時更新，Google 搜尋得到。

## 目前的網址

| 位置 | 網址 |
|---|---|
| 正式網站 | https://ime-website-kappa.vercel.app |
| 後台登入 | https://ime-website-kappa.vercel.app/admin/login |

**後台帳號**
- Email：`admin@ime-beauty.com`
- Password：`ime2024admin`

⚠️ 首次登入後請立刻改密碼（在任一管理頁右上角，或請我幫你重設）。

---

## 📋 目錄

1. [怎麼用後台（最常見的四件事）](#怎麼用後台)
2. [後台選單跟前台的對應關係](#後台選單跟前台的對應關係)
3. [前台什麼時候會更新](#前台什麼時候會更新)
4. [Google 搜尋怎麼設定](#google-搜尋怎麼設定)
5. [想要換成自己的網域](#想要換成自己的網域)
6. [常見問題](#常見問題)

---

## 怎麼用後台

### 1️⃣ 新增資料（例：新增一個客戶見證）

1. 打開 https://ime-website-kappa.vercel.app/admin/login 登入
2. 左邊點「💬 客戶見證」
3. 右上角按 **+ 新增**
4. 填資料 → 按儲存
5. 左下角按 **🔄 立即更新前台** → 打開首頁刷新，新見證立刻出現

### 2️⃣ 改內容（例：改 Hero 主標題）

1. 左邊點「🎯 Hero 區塊」
2. 點那一列 → 抽屜打開 → 改「主標題」欄位 → 儲存
3. 按「🔄 立即更新前台」

### 3️⃣ 上傳圖片

每個有「圖片網址」欄位的表單，也可以直接拖拉本機圖檔。

1. 在編輯頁找到「產品圖片網址」這類欄位
2. 把圖片拖到那個欄位旁的上傳區（或貼網址）
3. 支援 JPG / PNG / WebP，最大 5MB
4. 上傳完會自動填入 URL
5. 儲存 → 更新前台

### 4️⃣ 顧客預約管理

- 顧客在首頁點「我想預約」填表 → 自動進「📅 預約管理」，狀態 PENDING
- 你在後台看，可以改狀態：待處理 / 已確認 / 已完成 / 已取消
- 右上角「匯出 CSV」可以下載所有預約當作 Excel 用

---

## 後台選單跟前台的對應關係

| 後台選單 | 前台位置 | 常用更新時機 |
|---|---|---|
| 🎯 Hero 區塊 | 首頁最上方大標題 | 想換主標 / 促銷檔期 |
| 📖 品牌故事 | Hero 下方三幕故事 | 重新包裝文案 |
| 👤 創辦人 | 第 6 區塊 | 新增團隊成員 / 更新 Bio |
| 🧴 產品 | 第 4 區塊產品形象 | 新品上架 / 改規格 |
| 🎓 課程 | 預約頁的下拉選單 | 新開課、調整價格 |
| 📜 認證文件 | 第 5 區塊證書牆 | 拿到新專利 / 證書 |
| 📰 媒體報導 | 未來可放在前台 | 增加媒體曝光 |
| 💬 客戶見證 | 第 8 區塊 | **最常更新** — 收到新回饋就貼 |
| 🔄 前後對比 | 第 7 區塊 | 新案例 |
| 🏭 工廠亮點 | 未來可放 | R&D / CDMO 更新 |
| 📅 預約管理 | 看顧客從前台丟來的預約 | 每天檢查一次 |
| 🤝 加盟申請 | 看加盟申請 | 每週檢查 |
| ⚙️ 網站設定 | 聯絡資訊、社群連結 | 電話、LINE 改了 |

---

## 前台什麼時候會更新

兩種情況：

1. **自動**：後台存檔後，最多 60 秒內前台會自動更新
2. **立刻**：按左下角「🔄 立即更新前台」按鈕，馬上生效

如果改完按了按鈕還沒看到，重新整理瀏覽器（Ctrl + F5）強制重載。

---

## Google 搜尋怎麼設定

網站的 SEO 已經全部做好：
- robots.txt 允許 Google 爬 (`https://ime-website-kappa.vercel.app/robots.txt`)
- sitemap.xml 列出所有頁面 (`https://ime-website-kappa.vercel.app/sitemap.xml`)
- 每頁都有 canonical URL、Open Graph、Twitter Card、JSON-LD 結構化資料
- 已預留 `google-site-verification` meta 標籤

### 還要做一件事：到 Google Search Console 告訴 Google 這個站存在

1. 打開 https://search.google.com/search-console
2. 用你的 Gmail 登入
3. 點「新增資源」→ 選「URL 前置字元」
4. 輸入 `https://ime-website-kappa.vercel.app`
5. Google 會給你一個驗證碼。選「HTML 標記」方法
   - 注意：我們的網站已經放了一組 verification code（`7euGE1z9iYpDigLuxrMB2fudR8oZdcS82YeQRgLPF-k`）
   - 如果那不是你的，跟我說，我幫你換新的
6. 驗證通過後，在 Search Console 左邊點「Sitemap」→ 貼 `https://ime-website-kappa.vercel.app/sitemap.xml` → 提交
7. 通常 Google 會在 **3 天到 2 週** 內把網站加進搜尋結果

**加速收錄**：在 Search Console 的「網址檢查」貼上首頁 URL → 按「要求建立索引」。每天可以為 10 個 URL 做這個動作。

### 其他搜尋引擎

- **Bing Webmaster Tools**（涵蓋 Yahoo、DuckDuckGo）：https://www.bing.com/webmasters — 流程跟 Google 一樣，貼 sitemap 即可
- **百度**（只有中國用戶才需要）：https://ziyuan.baidu.com/

---

## 想要換成自己的網域

譬如你買了 `imebeauty.com.tw`：

1. 到 Vercel Dashboard → ime-website 專案 → Settings → Domains
2. 點 **Add Domain**，輸入 `imebeauty.com.tw`
3. Vercel 會給你要在 DNS 商（中華電信、Cloudflare 等）設的 CNAME / A record
4. 設完 DNS，幾分鐘後 Vercel 會自動簽發 SSL 憑證（免費）
5. 然後改兩個環境變數（或跟我說幫你改）：
   - `NEXTAUTH_URL` → `https://imebeauty.com.tw`
   - `NEXT_PUBLIC_SITE_URL` → `https://imebeauty.com.tw`
6. Re-deploy → 正式用新網域

---

## 常見問題

### Q1：忘記密碼怎麼辦？
跟我說一聲，我重設給你。或自己這樣做：
1. 打開 Vercel Dashboard → ime-website → Settings → Environment Variables
2. 找到 `ADMIN_PASSWORD`，改成新密碼（儲存）
3. 到 Vercel Dashboard → Deployments → 最新那一筆 → ⋯ → Redeploy → **勾選 "Use existing build cache"** → Redeploy
4. 等 1 分鐘，再去 `/admin/login` 用新密碼登入

> 背後原理：seed 腳本會用 ADMIN_EMAIL/PASSWORD upsert 管理員。每次 deploy 時不會自動跑 seed，但你可以用 `POST /api/setup/seed` 手動觸發（需 Bearer REVALIDATE_SECRET）。

### Q2：顧客說他送了表單，但我後台沒看到
打開後台「📅 預約管理」→ 左上角 tab 切到「全部」（而不是只看待處理）。如果還是沒有：
- 顧客可能根本沒按送出
- 驗證失敗（比如電話少於 6 碼）

若都沒問題再跟我說，我檢查 serverless function log。

### Q3：我改了資料，前台沒動
按左下角「🔄 立即更新前台」。沒用的話硬重整瀏覽器（Ctrl + Shift + R）。還是沒用就跟我說。

### Q4：要看 Prisma Postgres 的儀表板（資料庫內部狀況）
到 Vercel Dashboard → Integrations → Prisma Postgres → 選 `prisma-postgres-indigo-button` → Dashboard。可以看用量、備份、直接下 SQL 查詢。

### Q5：要看圖片儲存的儀表板
到 Vercel Dashboard → Storage → ime-assets → 那邊可以看所有上傳過的圖片、用量。

---

## 技術備忘（下次請工程師來接手看這邊）

**Stack**
- Next.js 14.2 App Router（TypeScript）
- Prisma Postgres（Vercel Marketplace，IPv4 直連）
- Vercel Blob Storage（公開讀，service-role 寫）
- NextAuth + bcrypt Credentials Provider
- Tailwind + Framer Motion

**關鍵檔案**

| 路徑 | 做什麼 |
|---|---|
| `prisma/schema.prisma` | 13 張資料表 schema |
| `prisma/seed.ts` | idempotent seed |
| `src/lib/content.ts` | 前台讀 DB，每筆都包 `unstable_cache` + tag |
| `src/lib/utils/storage.ts` | Vercel Blob 上傳 / 刪除（server-only） |
| `src/lib/auth.ts` | NextAuth 設定 |
| `src/middleware.ts` | 保護 `/admin/*` |
| `src/components/admin/CrudPage.tsx` | 13 個 CRUD 頁共用的表格 + 抽屜 |
| `src/app/page.tsx` | 首頁 server component，fetch 所有 CMS data 傳給 HomeClient |
| `src/app/api/admin/**` | 13 個模組的 CRUD API |
| `src/app/api/appointments/route.ts` | 公開 POST（前台表單送這） |
| `src/app/api/applications/route.ts` | 公開 POST（加盟申請） |
| `src/app/api/admin/revalidate/route.ts` | 「立即更新前台」按鈕呼叫的 endpoint |
| `src/app/api/setup/seed/route.ts` | 一次性 seed（Bearer REVALIDATE_SECRET）|

**Env vars（Vercel 已設好）**
- `DATABASE_URL`、`POSTGRES_URL`、`PRISMA_DATABASE_URL` — Prisma Postgres
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob
- `NEXTAUTH_URL`、`NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL` — 用於 sitemap / canonical，通過 `src/lib/site-url.ts` 的 `.trim()` 防止 newline 污染
- `REVALIDATE_SECRET` — 兩個 API 用
- `ADMIN_EMAIL`、`ADMIN_PASSWORD` — seed 腳本用

**本地開發**
```bash
cd ime-website
vercel env pull .env.local    # 拉下所有 Vercel 的 env 到本地
npm run dev                   # http://localhost:3000
```

---
