# I ME 後台使用手冊

這份文件解釋如何啟用後台、每天怎麼用、以及前台跟後台的連動方式。本手冊針對非工程師撰寫。

---

## 📋 目錄

1. [第一次設定（一次性，約 10 分鐘）](#第一次設定)
2. [每天怎麼用後台](#每天怎麼用後台)
3. [前台跟後台怎麼連動](#前台跟後台怎麼連動)
4. [常見問題](#常見問題)

---

## 第一次設定

你只需要做三件事：

### 1️⃣ 取得兩個 Supabase Key

到 **Supabase Dashboard → 選擇你的專案 → Settings → API**，把以下兩個值複製下來：

| Key 名稱 | 用途 |
|---|---|
| `anon` `public` | 前端用（選填） |
| `service_role` `secret` | 後台上傳圖片用（**必填**） |

⚠️ `service_role` 是最高權限，不要放進前端、不要貼到公開地方。

然後到 **Settings → Database → Connection string → 選 Session mode（Transaction 也行）**，把完整的連線字串複製下來。它會長這樣：
```
postgresql://postgres.xxxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

### 2️⃣ 打開 `.env` 檔案填入

打開 `ime-website/.env`，填入：

```env
# 把原本 db.xxxxxxxx.supabase.co:5432 這個直連 URL，換成上面複製的 pooler URL
DATABASE_URL="postgresql://postgres.xxxxxx:S20325s20325@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxxxxx:S20325s20325@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# 補上 service_role key
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIs..."
```

> **為什麼要用 pooler URL？**
> 直連 URL（`db.xxxxx.supabase.co`）需要 IPv6，你的電腦如果沒有公開 IPv6 就連不上。Pooler URL 支援 IPv4，本機開發、Vercel 部署都能用。

### 3️⃣ 一鍵初始化

在 `ime-website` 資料夾開終端機，執行：

```bash
npm run setup:all
```

這會自動做三件事：
1. 建立 13 張資料表
2. 塞入起始資料（管理員帳號 + 3 位創辦人 + 10 則新聞 + 5 則見證 + 4 張證書 + 3 個課程 + 網站設定）
3. 建立 Supabase Storage 圖片儲存空間

看到 `🎉 資料庫初始化完成` 就代表成功了。

### 登入後台

```bash
npm run dev
```

打開瀏覽器到 `http://localhost:3000/admin/login`，用預設帳號登入：

- **Email**：`admin@ime-beauty.com`
- **Password**：`ime2024admin`

⚠️ 正式上線前，記得去後台的「網站設定」或用 Supabase SQL editor 改掉這組密碼。

---

## 每天怎麼用後台

登入後左邊有 14 個選單。功能都一樣：**新增、編輯、刪除、拖拉排序**。

### 後台選單與對應前台位置

| 選單 | 前台位置 | 說明 |
|---|---|---|
| 🎯 Hero 區塊 | 首頁最上方 | 主標題、副標題、按鈕文字連結 |
| 📖 品牌故事 | Hero 下方三幕故事 | 每一幕的標題、內文 |
| 👤 創辦人 | 第 6 區塊 | 姓名、職稱、故事、金句、大頭照 |
| 🧴 產品 | 第 4 區塊 | 產品名稱、標語、描述、價格、圖片 |
| 🎓 課程 | 預約表單下拉選單 | 課程名稱、描述、時長、價格 |
| 📜 認證文件 | 第 5 區塊 | 證書標題、發證單位、圖片 |
| 📰 媒體報導 | （若前台有此區塊） | 媒體、標題、摘要、日期、連結 |
| 💬 客戶見證 | 第 8 區塊 | 顧客名稱、年齡、內容、星級 |
| 🔄 前後對比 | 第 7 區塊 | 標題、前/後圖、相隔天數、備註 |
| 🏭 工廠亮點 | （若前台有此區塊） | RnD/Factory 兩種類別 |
| 📅 預約管理 | 讀取模式 | 看前台客戶提交的預約 |
| 🤝 加盟申請 | 讀取模式 | 看前台客戶提交的加盟申請 |
| ⚙️ 網站設定 | 全站 footer / 聯絡資訊 | LINE、IG、FB、電話、Email |

### 新增一筆資料（以「客戶見證」為例）

1. 左邊點「💬 客戶見證」
2. 右上角按「+ 新增」
3. 從右側抽出的面板填資料：
   - **顧客姓名**：林小姐
   - **年齡**：32
   - **課程類型**：外泌體美容入門體驗課
   - **內容**：做完三次療程，肌膚光澤度有感提升。（用空行分段）
   - **星級**：5
4. 按「儲存」
5. **重要**：按左下角的「🔄 立即更新前台」，前台會立刻顯示新內容

### 編輯 / 刪除

- 編輯：點那一列任何地方 → 抽屜打開 → 改完按儲存
- 刪除：每列最右邊有刪除按鈕 → 跳確認視窗 → 確認後刪除
- 排序：直接拖拉每一列重新排

### 上傳圖片

在每個「有圖片欄位」的表單，圖片欄位是拖拉區：

1. 把本機圖片拖到灰色虛線框裡（或點它打開選擇器）
2. 會先顯示「上傳中...」
3. 上傳完圖片網址會自動填入欄位

支援：JPG、PNG、WebP，最大 5MB。

### 預約管理（顧客的預約這邊看）

- 首頁有「我想預約」按鈕 → 顧客填完表單 → 這筆資料會進「預約管理」，初始狀態是 **待處理**
- 你可以改狀態：待處理 / 已確認 / 已完成 / 已取消
- 右上角「匯出 CSV」可以下載全部預約資料

### 加盟申請

跟預約管理一樣是讀取模式，看顧客主動送來的加盟申請。

---

## 前台跟後台怎麼連動

### 🔄 什麼時候前台會自動更新

1. **正常情況**：後台存檔後，最多 **60 秒**內前台會更新（因為快取機制）
2. **想立刻看到**：按後台左下角「**🔄 立即更新前台**」按鈕，幾秒內前台就會重新讀資料

### 前台顯示的優先順序

每個區塊都有「**fallback 硬編資料**」，規則是：

- 如果後台 DB 有資料 → 用 DB 的
- 如果 DB 沒資料或連線失敗 → 用原本網站上看到的硬編內容

所以就算你不小心把後台資料清光，前台也不會變空白，會顯示原本的「範例」內容。

### 預約表單的流程

```
顧客在首頁 → 填「我想預約」表單 → 按送出
       ↓
POST /api/appointments（公開端點）
       ↓
寫入 Prisma.Appointment 表（狀態 PENDING）
       ↓
你登入後台 → 預約管理 → 看到這筆新預約
       ↓
你改狀態為「已確認」或聯絡顧客
```

---

## 常見問題

### Q1：按「+ 新增」沒反應，或列表空白
**可能原因**：DB 連線失敗
**檢查**：
```bash
cd ime-website
npx prisma db pull
```
如果報錯 `P1001: Can't reach database`，就是 `DATABASE_URL` 設錯了。到 Supabase Dashboard 重新複製 pooler URL。

### Q2：上傳圖片說「上傳失敗」
**可能原因**：`SUPABASE_SERVICE_ROLE_KEY` 沒填或填錯
**檢查**：`.env` 裡這一行有沒有值
```env
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```
如果沒有，去 Supabase Dashboard → Settings → API → `service_role` → Reveal 然後複製。

如果還是不行，執行：
```bash
npm run setup:storage
```
它會測試上傳一個 test 檔，告訴你錯在哪一步。

### Q3：我改了後台，前台沒變
- 先按左下角「🔄 立即更新前台」
- 如果還沒變，硬重整瀏覽器（Ctrl+Shift+R）
- 還不行就檢查後台有沒有真的存到（列表有顯示 = 有存到）

### Q4：客戶填了預約表單，後台看不到
**可能原因**：DB 連線在前台 runtime 失敗
- 開瀏覽器 DevTools 的 Network 分頁
- 填表單按送出
- 看 `/api/appointments` 這個 request：
  - 201 Created → 成功了，檢查後台列表
  - 400 Bad Request → 表單驗證錯誤（看 response 內容）
  - 500 Internal Server Error → DB 連線失敗

### Q5：忘記密碼
在 `ime-website` 跑：
```bash
node -e "const {hash}=require('bcryptjs');hash('新密碼',12).then(console.log)"
```
把印出的 hash 貼到 Supabase Dashboard → Database → users table → 你的那列 → hashedPassword 欄位。

或直接改 `.env` 的 `ADMIN_PASSWORD`，然後：
```bash
npx prisma db seed
```
會 upsert 管理員（現有的會保留）。

### Q6：部署到 Vercel 後怎麼設環境變數
到 Vercel 專案 → Settings → Environment Variables，把 `.env` 裡這些一個一個複製貼上：
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_URL`（正式站要改成 `https://your-domain.com`）
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REVALIDATE_SECRET`
- `NEXT_PUBLIC_SITE_URL`（正式站要改成 `https://your-domain.com`）

---

## 技術備忘（給未來的開發者）

### 關鍵檔案

| 路徑 | 做什麼 |
|---|---|
| `prisma/schema.prisma` | 13 張資料表的 schema |
| `prisma/seed.ts` | 起始資料 |
| `src/lib/content.ts` | 前台讀取 CMS 的 getter（帶 revalidateTag） |
| `src/lib/auth.ts` | NextAuth + bcrypt credentials provider |
| `src/lib/utils/api-helpers.ts` | `requireAdmin()`, `ok()`, `unauthorized()` 等共用 response helpers |
| `src/lib/utils/storage.ts` | Supabase Storage 上傳/刪除，server-only |
| `src/middleware.ts` | 保護 `/admin/*` 要登入才能進 |
| `src/components/admin/CrudPage.tsx` | 所有 13 個 CRUD 頁面共用的表格 + 表單元件 |
| `src/app/api/admin/**` | 13 個模組的 CRUD API（都要 requireAdmin） |
| `src/app/api/appointments/route.ts` | **公開** POST，前台預約表單送到這 |
| `src/app/api/applications/route.ts` | **公開** POST，前台加盟申請送到這 |
| `src/app/api/admin/revalidate/route.ts` | 「立即更新前台」按鈕呼叫的端點 |

### 修復過的 bug 列表（2026-04-25）

1. `CrudPage.tsx` 解析 API 回傳格式錯誤 → 13 個列表頁都顯示空白
2. `appointments/page.tsx` 同樣的解析 bug + 讀取 `courseName` 但 schema 是 `course.name` 關聯
3. `applications/page.tsx` 同樣的解析 bug
4. 前台表單沒有真的送資料（只 `setTimeout` 假裝）
5. `/api/appointments` 與 `/api/applications` 公開端點不存在
6. Storage 用 anon key（可能為空）→ 改用 service_role（必填一次）
7. 前台所有 section 都硬編，不讀 CMS → 現在 `app/page.tsx` 會 fetch 所有 CMS 資料並傳到 section；section 接受 `data?` prop，有資料用 DB 沒資料用 fallback
8. 後台存檔後前台快取最多延遲 1 小時 → 改為 60 秒，加上「🔄 立即更新前台」按鈕

---
