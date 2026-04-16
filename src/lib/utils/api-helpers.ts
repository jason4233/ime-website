import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 驗證 admin 身份
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

// 通用 CRUD response helpers
export function ok(data: unknown) {
  return NextResponse.json(data);
}

export function created(data: unknown) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function serverError(e: unknown) {
  console.error(e);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// 解析 search params
export function getSearchParams(req: NextRequest) {
  const url = new URL(req.url);
  return {
    search: url.searchParams.get("search") || "",
    page: parseInt(url.searchParams.get("page") || "1"),
    limit: parseInt(url.searchParams.get("limit") || "50"),
    orderBy: url.searchParams.get("orderBy") || "order",
    orderDir: (url.searchParams.get("orderDir") || "asc") as "asc" | "desc",
    status: url.searchParams.get("status") || "",
  };
}
