import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
//   POST /api/applications — 公開加盟申請端點
//   前台「我想加入」表單送到這裡（不需登入）
//   後台登入後可在 /admin/applications 看到 PENDING 狀態的申請
// ═══════════════════════════════════════════════════════════════

const applicationSchema = z.object({
  name: z.string().min(1, "請填寫姓名").max(100),
  phone: z.string().min(6, "請填寫有效電話").max(30),
  email: z.string().email().optional().or(z.literal("")),
  background: z.string().max(500).optional(),
  motivation: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation_failed",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const created = await prisma.distributorApplication.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        background: data.background || null,
        motivation: data.motivation || null,
        // status 預設為 PENDING
      },
    });

    return NextResponse.json(
      { id: created.id, message: "申請已送出，我們將盡快審核並與您聯繫" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/applications] failed:", err);
    return NextResponse.json(
      { error: "server_error", message: "系統暫時無法處理，請稍後再試" },
      { status: 500 }
    );
  }
}
