import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import {
  requireAdmin,
  ok,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/utils/api-helpers";

// PUT /api/admin/appointments/:id/status — 僅更新狀態
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !Object.values(AppointmentStatus).includes(status)) {
      return badRequest(
        `Invalid status. Must be one of: ${Object.values(AppointmentStatus).join(", ")}`
      );
    }

    const record = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { course: true },
    });

    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}
