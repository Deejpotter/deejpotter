import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/db-users";
import { getQuote, readQuoteFileBuffer } from "@/lib/db-quotes";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const quoteNumber = Number(id);
  if (!Number.isFinite(quoteNumber) || quoteNumber <= 0) {
    return NextResponse.json({ error: "Invalid quote number." }, { status: 400 });
  }

  const record = await getQuote(quoteNumber);
  if (!record) {
    return NextResponse.json({ error: "Quote request not found." }, { status: 404 });
  }

  const admin = await isAdmin(session.userId);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
