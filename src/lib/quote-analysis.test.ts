import { analyzeQuoteFile } from "./quote-analysis";

function makeTestFile(name: string, contents: string, type = "application/octet-stream") {
  return {
    name,
    size: Buffer.byteLength(contents),
    type,
    async arrayBuffer() {
      return Uint8Array.from(Buffer.from(contents)).buffer;
    },
  } as unknown as File;
}

function makeAsciiCubeStl() {
  return `solid cube
facet normal 0 0 1
 outer loop
  vertex 0 0 0
  vertex 20 0 0
  vertex 0 20 0
 endloop
endfacet
facet normal 0 0 1
 outer loop
  vertex 20 0 0
  vertex 20 20 0
  vertex 0 20 0
 endloop
endfacet
facet normal 0 0 -1
 outer loop
  vertex 0 0 10
  vertex 0 20 10
  vertex 20 0 10
 endloop
endfacet
facet normal 0 0 -1
 outer loop
  vertex 20 0 10
  vertex 0 20 10
  vertex 20 20 10
 endloop
endfacet
endsolid cube`;
}

describe("quote-analysis", () => {
  test("analyzes ascii STL files", async () => {
    const file = makeTestFile("cube.stl", makeAsciiCubeStl(), "model/stl");
    const analysis = await analyzeQuoteFile(file, 2, "PLA");

    expect(analysis.analysisAvailable).toBe(true);
    expect(analysis.fileKind).toBe("stl");
    expect(analysis.triangleCount).toBe(4);
    expect(analysis.boundingBoxMm).toEqual({ x: 20, y: 20, z: 10 });
    expect(analysis.estimatedMaterialGrams).toBeGreaterThan(0);
    expect(analysis.estimatedPrintHours).toBeGreaterThan(0);
    expect(analysis.estimatedPriceAud).toBeGreaterThan(0);
  });

  test("returns a manual-review note for non-STL files", async () => {
    const file = makeTestFile("part.step", "step data", "application/octet-stream");
    const analysis = await analyzeQuoteFile(file, 1, "PLA");

    expect(analysis.analysisAvailable).toBe(false);
    expect(analysis.fileKind).toBe("other");
    expect(analysis.previewNote).toMatch(/STL files/i);
  });
});
