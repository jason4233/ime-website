import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import {
  requireAdmin,
  ok,
  created,
  unauthorized,
  serverError,
  getSearchParams,
} from "@/lib/utils/api-helpers";

// GET /api/admin/appointments — 列表 + 搜尋 + 分頁 + status 篩選
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { search, page, limit, status } = getSearchParams(req);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      where.status = status as AppointmentStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { course: true },
      }),
      prisma.appointment.count({ where }),
    ]);

    return ok({ data, total, page, limit });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/admin/appointments — 新增
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const record = await prisma.appointment.create({
      data: body,
      include: { course: true },
    });
    return created(record);
  } catch (e) {
    return serverError(e);
  }
}
