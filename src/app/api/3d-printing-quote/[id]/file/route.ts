import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { getQuoteRequest, getQuoteRequestFilePath } from "@/lib/quote-storage";

async function getAuthAsync() {
  try {
    const _clerk = await import("@clerk/nextjs");
    const anyClerk = _clerk as any;
    const getter =
      typeof anyClerk?.auth === "function"
        ? anyClerk.auth
        : typeof anyClerk?.getAuth === "function"
          ? anyClerk.getAuth
          : () => ({ userId: null });
    return getter();
  } catch {
    return { userId: null };
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await getAuthAsync();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const record = await getQuoteRequest(id);
  if (!record) {
    return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
  }

  try {
    const buffer = await fs.readFile(getQuoteRequestFilePath(record));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": record.fileType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${record.fileName}"`,
      },
    });
  } catch (error) {
    console.error("quote file read error", error);
    return NextResponse.json({ error: "Could not read the quote file." }, { status: 500 });
  }
}
