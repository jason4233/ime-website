import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  ok,
  unauthorized,
  notFound,
  serverError,
} from "@/lib/utils/api-helpers";

// GET /api/admin/courses/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const record = await prisma.course.findUnique({ where: { id } });
    if (!record) return notFound();
    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/admin/courses/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();
    const record = await prisma.course.update({
      where: { id },
      data: body,
    });
    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}

// DELETE /api/admin/courses/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return ok({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
