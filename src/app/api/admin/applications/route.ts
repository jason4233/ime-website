import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import {
  requireAdmin,
  ok,
  created,
  unauthorized,
  serverError,
  getSearchParams,
} from "@/lib/utils/api-helpers";

// GET /api/admin/applications — 列表 + 搜尋 + 分頁 + status 篩選
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { search, page, limit, status } = getSearchParams(req);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (status && Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
      where.status = status as ApplicationStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { background: { contains: search, mode: "insensitive" } },
        { motivation: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.distributorApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.distributorApplication.count({ where }),
    ]);

    return ok({ data, total, page, limit });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/admin/applications — 新增
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const record = await prisma.distributorApplication.create({ data: body });
    return created(record);
  } catch (e) {
    return serverError(e);
  }
}
