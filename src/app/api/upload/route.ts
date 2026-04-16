import { NextRequest } from "next/server";
import { requireAdmin, ok, unauthorized, badRequest, serverError } from "@/lib/utils/api-helpers";
import { uploadImage } from "@/lib/utils/storage";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "images";

    if (!file) return badRequest("No file provided");

    const url = await uploadImage(file, folder);
    return ok({ url });
  } catch (e) {
    return serverError(e);
  }
}
