import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Dungeon Crawl",
  "Play Dungeon Crawl, an idle guild manager RPG by Deej Potter. Recruit heroes, clear dungeons and send out expeditions.",
  "/projects/games/dungeon-crawl"
);

import { ReactElement } from "react";

// The Unity build lays itself out at 1000x680 and scales to fit, so the frame
// keeps that shape. Saves live in this site's localStorage, not on a server.
export default function DungeonCrawl(): ReactElement {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Dungeon Crawl</h1>
      <div className="aspect-[1000/680] w-full overflow-hidden rounded-2xl bg-[#08060f]">
        <iframe
          src="/dungeonCrawl/index.html"
          title="Dungeon Crawl, a Unity browser game"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Best on a desktop browser. Your save stays in this browser, so it will not follow you to
        another device.
      </p>
    </div>
  );
}
