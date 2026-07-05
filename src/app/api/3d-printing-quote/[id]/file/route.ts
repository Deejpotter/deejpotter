import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/db-users";
import { getQuoteRequest, getQuoteRequestFileBuffer } from "@/lib/quote-storage";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const record = await getQuoteRequest(id);
  if (!record) {
    return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
  }

  const admin = await isAdmin(session.userId);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buffer = await getQuoteRequestFileBuffer(record);
  if (!buffer) {
    return NextResponse.json({ error: "Could not read the quote file." }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": record.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${record.fileName}"`,
    },
  });
}
