import { describe, expect, it } from "vitest";
import { estimatePrint } from "./print-estimate";
import { measureStl } from "./stl-geometry";

/** Builds a binary STL of an axis-aligned box (12 triangles, outward facing). */
function boxStl(sx: number, sy: number, sz: number, offset = 0, inward = false): Uint8Array {
  const v = (x: number, y: number, z: number): [number, number, number] => [x * sx + offset, y * sy + offset, z * sz + offset];
  const quads: [number, number, number][][] = [
    [v(0, 0, 0), v(0, 1, 0), v(1, 1, 0), v(1, 0, 0)], // bottom
    [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)], // top
    [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)], // front
    [v(0, 1, 0), v(0, 1, 1), v(1, 1, 1), v(1, 1, 0)], // back
    [v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0)], // left
    [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)], // right
  ];
  const tris = quads.flatMap(([a, b, c, d]) => [[a, b, c], [a, c, d]]).map((t) => (inward ? [t[0], t[2], t[1]] : t));
  return trianglesToStl(tris);
}

function trianglesToStl(tris: number[][][]): Uint8Array {
  const buf = new ArrayBuffer(84 + tris.length * 50);
  const view = new DataView(buf);
  view.setUint32(80, tris.length, true);
  tris.forEach((tri, i) => {
    tri.forEach((p, k) => p.forEach((c, j) => view.setFloat32(84 + i * 50 + 12 + k * 12 + j * 4, c, true)));
  });
  return new Uint8Array(buf);
}

const opts = { quantity: 1, infill: 15, scalePercent: 100, timeMultiplier: 1, ratePerGram: 0.18, hourlyRate: 5, densityGPerCm3: 1.24 };

describe("measureStl", () => {
  it("measures a 20 × 20 × 10 mm block", () => {
    const g = measureStl(boxStl(20, 20, 10))!;
    expect(g.triangleCount).toBe(12);
    expect(g.boundingBoxMm).toEqual({ x: 20, y: 20, z: 10 });
    expect(g.volumeMm3).toBeCloseTo(4000, 3);
    expect(g.surfaceAreaMm2).toBeCloseTo(2 * (400 + 200 + 200), 3);
  });

  it("gives a positive volume for inside-out meshes", () => {
    expect(measureStl(boxStl(10, 10, 10, 0, true))!.volumeMm3).toBeCloseTo(1000, 3);
  });

  it("rejects files that aren't STL", () => {
    expect(measureStl(new TextEncoder().encode("hello"))).toBeNull();
  });
});

describe("estimatePrint", () => {
  it("prices a hollow box far below a solid block of the same size", () => {
    const solid = measureStl(boxStl(50, 50, 50))!;
    // 2 mm walls: outer box plus an inside-out inner box.
    const outer = boxStl(50, 50, 50);
    const inner = boxStl(46, 46, 46, 2, true);
    const hollowBytes = trianglesToStl([...readTris(outer), ...readTris(inner)]);
    const hollow = measureStl(hollowBytes)!;
    expect(hollow.volumeMm3).toBeCloseTo(125000 - 97336, 0);

    const a = estimatePrint(solid, opts);
    const b = estimatePrint(hollow, opts);
    expect(b.gramsEach).toBeLessThan(a.gramsEach);
  });

  it("small solid parts print fully solid", () => {
    // 4000 mm³ cube: skin (16 cm² × 0.12) is under its 4 cm³ volume, so part is mostly skin.
    const e = estimatePrint(measureStl(boxStl(20, 20, 10))!, opts);
    expect(e.gramsEach).toBeGreaterThan(2.5);
    expect(e.gramsEach).toBeLessThan(5);
  });

  it("scales weight with the cube of the scale and multiplies by quantity", () => {
    const g = measureStl(boxStl(100, 100, 100))!;
    const one = estimatePrint(g, opts);
    const two = estimatePrint(g, { ...opts, quantity: 2 });
    expect(two.totalGrams).toBeCloseTo(one.totalGrams * 2, 0);
    const half = estimatePrint(g, { ...opts, scalePercent: 50 });
    expect(half.boundingBoxMm).toEqual({ x: 50, y: 50, z: 50 });
    expect(half.gramsEach).toBeLessThan(one.gramsEach / 3);
  });

  it("never goes below the minimum price", () => {
    const tiny = estimatePrint(measureStl(boxStl(2, 2, 2))!, { ...opts, hourlyRate: 0, ratePerGram: 0 });
    expect(tiny.priceAud).toBeGreaterThanOrEqual(5);
  });
});

function readTris(bytes: Uint8Array): number[][][] {
  const view = new DataView(bytes.buffer);
  const n = view.getUint32(80, true);
  return Array.from({ length: n }, (_, i) =>
    [0, 1, 2].map((k) => [0, 1, 2].map((j) => view.getFloat32(84 + i * 50 + 12 + k * 12 + j * 4, true))),
  );
}
