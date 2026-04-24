import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
//   POST /api/appointments — 公開預約端點
//   前台「我想預約」表單送到這裡（不需登入）
//   後台登入後可在 /admin/appointments 看到 PENDING 狀態的預約
// ═══════════════════════════════════════════════════════════════

const appointmentSchema = z.object({
  name: z.string().min(1, "請填寫姓名").max(100),
  phone: z.string().min(6, "請填寫有效電話").max(30),
  email: z.string().email("請填寫有效 Email").optional().or(z.literal("")),
  courseId: z.string().optional().nullable(),
  preferredDate: z.string().optional(), // ISO 或任何 Date() 可解析的格式
  preferredTimeSlot: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = appointmentSchema.safeParse(body);

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

    // preferredDate 寬鬆解析 — 無效就存 null，不讓整個 request 失敗
    let parsedDate: Date | null = null;
    if (data.preferredDate) {
      const d = new Date(data.preferredDate);
      if (!Number.isNaN(d.getTime())) parsedDate = d;
    }

    const created = await prisma.appointment.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        courseId: data.courseId || null,
        preferredDate: parsedDate,
        preferredTimeSlot: data.preferredTimeSlot || null,
        notes: data.notes || null,
        // status 預設為 PENDING
      },
    });

    return NextResponse.json(
      { id: created.id, message: "預約已送出，我們將盡快與您聯繫" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/appointments] failed:", err);
    return NextResponse.json(
      { error: "server_error", message: "系統暫時無法處理，請稍後再試" },
      { status: 500 }
    );
  }
}
