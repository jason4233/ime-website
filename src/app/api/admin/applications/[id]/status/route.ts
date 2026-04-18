import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import {
  requireAdmin,
  ok,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/utils/api-helpers";

// PUT /api/admin/applications/:id/status — 僅更新狀態
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!status || !Object.values(ApplicationStatus).includes(status)) {
      return badRequest(
        `Invalid status. Must be one of: ${Object.values(ApplicationStatus).join(", ")}`
      );
    }

    const record = await prisma.distributorApplication.update({
      where: { id },
      data: { status },
    });

    return ok(record);
  } catch (e) {
    return serverError(e);
  }
}
