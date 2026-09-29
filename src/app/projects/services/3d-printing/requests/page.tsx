import { redirect } from "next/navigation";

/**
 * Old address of the quote board. The board now lives under /admin, which
 * checks admin access before rendering; this keeps old bookmarks working
 * without leaving an unguarded copy of the page.
 */
export default function OldQuoteBoardPage(): never {
  redirect("/admin/3d-printing");
}
