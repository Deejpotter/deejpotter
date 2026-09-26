import { generatePageMetadata } from "@/app/metadata";

export const metadata = generatePageMetadata(
  "Basic Bases",
  "Play Basic Bases, a browser game by Deej Potter.",
  "/projects/games/basic-bases"
);

import { ReactElement } from "react";

export default function BasicBases(): ReactElement {
  return (
    <div className="gameContainer">
      <iframe src="/basicBases/index.html" frameBorder="0"></iframe>
    </div>
  );
}
