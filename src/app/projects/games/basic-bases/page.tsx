import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Basic Bases",
  "Play Basic Bases, a browser game by Deej Potter.",
  "/projects/games/basic-bases"
);

import { ReactElement } from "react";

// The Unity WebGL build draws a fixed 960x600 canvas plus a ~60px footer bar,
// so the frame keeps that shape (1000x680 leaves a little margin) and scales
// down on narrower screens. Without an explicit size the iframe fell back to
// the browser default of 300x150 and only the splash logo showed.
export default function BasicBases(): ReactElement {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Basic Bases</h1>
      <div className="aspect-[1000/680] w-full overflow-hidden rounded-2xl bg-[#231f20]">
        <iframe
          src="/basicBases/index.html"
          title="Basic Bases, a Unity browser game"
          className="h-full w-full border-0"
          allowFullScreen
        />
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Best on a desktop browser. Use the button under the game for full screen.
      </p>
    </div>
  );
}
