import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  ok,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/utils/api-helpers";

// PUT /api/admin/testimonials/reorder — 批次更新排序
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const items: { id: string; order: number }[] = body.items;

    if (!Array.isArray(items)) {
      return badRequest("items must be an array of { id, order }");
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.testimonial.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return ok({ success: true });
  } catch (e) {
    return serverError(e);
  }
}
