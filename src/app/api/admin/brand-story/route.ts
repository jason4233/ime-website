import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  ok,
  created,
  unauthorized,
  serverError,
  getSearchParams,
} from "@/lib/utils/api-helpers";

// GET /api/admin/brand-story — 列表 + 搜尋 + 分頁
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const { search, page, limit, orderBy, orderDir } = getSearchParams(req);
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { bodyRichText: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.brandStorySection.findMany({
        where,
        orderBy: { [orderBy]: orderDir },
        skip,
        take: limit,
      }),
      prisma.brandStorySection.count({ where }),
    ]);

    return ok({ data, total, page, limit });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/admin/brand-story — 新增
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const record = await prisma.brandStorySection.create({ data: body });
    return created(record);
  } catch (e) {
    return serverError(e);
  }
}
