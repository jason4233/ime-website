"use client";

/**
 * Global Error Boundary — 當 root layout 以上的 client component throw 時觸發。
 * 作用：把錯誤訊息+ stack trace 直接印在網頁上，讓我們不用看 browser console 就能 debug。
 * 上線穩定後可改成更友善的 fallback UI。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hant">
      <body style={{ padding: 24, fontFamily: "ui-monospace, monospace", background: "#FAF7F2", color: "#0A0A0A" }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>網站發生錯誤 — I ME debug panel</h1>

        <div style={{ marginBottom: 16, padding: 12, background: "#FFF", border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Error name:</strong> {error?.name || "unknown"}
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: "#FFF", border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Error message:</strong>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 8 }}>
            {error?.message || "no message"}
          </pre>
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: "#FFF", border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Error digest (Vercel 會 hash 掉 prod 錯誤訊息，這個是對應 server log 的 ID)：</strong>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{error?.digest || "no digest"}</pre>
        </div>

        <div style={{ marginBottom: 16, padding: 12, background: "#FFF", border: "1px solid #ddd", borderRadius: 8 }}>
          <strong>Stack trace:</strong>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, marginTop: 8, overflow: "auto", maxHeight: 400 }}>
            {error?.stack || "no stack"}
          </pre>
        </div>

        <button
          onClick={reset}
          style={{ padding: "10px 20px", background: "#7B2FBE", color: "#FFF", border: "none", borderRadius: 6, cursor: "pointer" }}
        >
          重試
        </button>

        <p style={{ marginTop: 24, fontSize: 12, color: "#666" }}>
          把這整頁截圖給晨睿，讓他貼給 Claude 修。
        </p>
      </body>
    </html>
  );
}
