import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  ok,
  unauthorized,
  notFound,
  serverError,
} from "@/lib/utils/api-helpers";

// GET /api/admin/appointments/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const record = await prisma.appointment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!record) return notFound();
    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/admin/appointments/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const record = await prisma.appointment.update({
      where: { id },
      data: body,
      include: { course: true },
    });
    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/admin/appointments/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id } });
    return ok({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
