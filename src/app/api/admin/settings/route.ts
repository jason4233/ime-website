import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  ok,
  unauthorized,
  serverError,
} from "@/lib/utils/api-helpers";

// GET /api/admin/settings — 取得第一筆設定
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const settings = await prisma.siteSettings.findFirst();
    return ok(settings);
  } catch (e) {
    return serverError(e);
  }
}

// PUT /api/admin/settings — Upsert 設定
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();

    // 嘗試取得現有設定
    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: body,
      });
    }

    return ok(settings);
  } catch (e) {
    return serverError(e);
  }
}
