import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { requireAdmin, unauthorized, serverError } from "@/lib/utils/api-helpers";
import Papa from "papaparse";

// GET /api/admin/appointments/export — 匯出 CSV
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status && Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      where.status = status as AppointmentStatus;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { course: true },
    });

    const csvData = appointments.map((a) => ({
      ID: a.id,
      姓名: a.name,
      電話: a.phone,
      Email: a.email || "",
      課程: a.course?.name || "",
      偏好日期: a.preferredDate ? new Date(a.preferredDate).toLocaleDateString("zh-TW") : "",
      偏好時段: a.preferredTimeSlot || "",
      備註: a.notes || "",
      狀態: a.status,
      建立時間: new Date(a.createdAt).toLocaleString("zh-TW"),
    }));

    const csv = Papa.unparse(csvData);

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="appointments-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (e) {
    return serverError(e);
  }
}
