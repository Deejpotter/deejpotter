import { NextResponse } from "next/server";
import { adminApiGuard } from "@/lib/admin-auth";
import { getQuote, readQuoteFileBuffer } from "@/lib/db-quotes";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await adminApiGuard();
  if (denied) return denied;

  const { id } = await context.params;
  const quoteNumber = Number(id);
  if (!Number.isFinite(quoteNumber) || quoteNumber <= 0) {
    return NextResponse.json({ error: "Invalid quote number." }, { status: 400 });
  }

  const record = await getQuote(quoteNumber);
  if (!record) {
    return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
  }

  const buffer = await readQuoteFileBuffer(quoteNumber, record.fileStoredAs);
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
