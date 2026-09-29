/**
 * stl-geometry.ts — Real size, volume and surface area from an STL file
 *
 * Pricing and shipping both depend on how much plastic a part really uses.
 * The outer box of a part badly overstates that for anything hollow, thin or
 * curved, so this reads every triangle and works out the enclosed volume and
 * the outer surface area as well. It uses only DataView and TextDecoder (no
 * Node APIs) so the browser can measure a file the moment it's picked, and the
 * server gets the same numbers when the quote is submitted.
 */

export interface BoundingBoxMm {
  x: number;
  y: number;
  z: number;
}

export interface StlGeometry {
  triangleCount: number;
  boundingBoxMm: BoundingBoxMm;
  /** Enclosed volume in mm³. Needs a closed (watertight) mesh to be exact. */
  volumeMm3: number;
  /** Total outer surface area in mm². */
  surfaceAreaMm2: number;
}

type Vec = [number, number, number];

/**
 * Accumulates bounds, volume and area one triangle at a time so a 25 MB file
 * never needs a second copy of its vertices in memory.
 */
class Accumulator {
  min: Vec = [Infinity, Infinity, Infinity];
  max: Vec = [-Infinity, -Infinity, -Infinity];
  signedVolume = 0;
  area = 0;
  count = 0;

  add(a: Vec, b: Vec, c: Vec) {
    for (const v of [a, b, c]) {
      for (let i = 0; i < 3; i += 1) {
        if (v[i] < this.min[i]) this.min[i] = v[i];
        if (v[i] > this.max[i]) this.max[i] = v[i];
      }
    }
    // Each triangle and the origin form a tetrahedron; their signed volumes
    // add up to the volume the closed mesh encloses (divergence theorem).
    this.signedVolume +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    const u: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const w: Vec = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const cx = u[1] * w[2] - u[2] * w[1];
    const cy = u[2] * w[0] - u[0] * w[2];
    const cz = u[0] * w[1] - u[1] * w[0];
    this.area += Math.sqrt(cx * cx + cy * cy + cz * cz) / 2;
    this.count += 1;
  }

  result(): StlGeometry | null {
    if (this.count === 0 || !Number.isFinite(this.min[0])) return null;
    const round1 = (n: number) => Math.round(n * 10) / 10;
    return {
      triangleCount: this.count,
      boundingBoxMm: {
        x: round1(this.max[0] - this.min[0]),
        y: round1(this.max[1] - this.min[1]),
        z: round1(this.max[2] - this.min[2]),
      },
      // Inside-out meshes give a negative total; the size is what matters.
      volumeMm3: Math.abs(this.signedVolume),
      surfaceAreaMm2: this.area,
    };
  }
}

/**
 * A binary STL is 80 header bytes, a triangle count, then 50 bytes per
 * triangle. Checking the length matches is the reliable way to tell binary
 * from ASCII, because some binary exporters start the header with "solid".
 */
function isBinary(view: DataView): boolean {
  if (view.byteLength < 84) return false;
  const count = view.getUint32(80, true);
  return 84 + count * 50 === view.byteLength;
}

function parseBinary(view: DataView): StlGeometry | null {
  const acc = new Accumulator();
  const count = view.getUint32(80, true);
  for (let i = 0; i < count; i += 1) {
    const o = 84 + i * 50 + 12; // skip the normal
    const v = (k: number): Vec => [
      view.getFloat32(o + k * 12, true),
      view.getFloat32(o + k * 12 + 4, true),
      view.getFloat32(o + k * 12 + 8, true),
    ];
    acc.add(v(0), v(1), v(2));
  }
  return acc.result();
}

function parseAscii(bytes: Uint8Array): StlGeometry | null {
  const text = new TextDecoder().decode(bytes);
  if (!text.trimStart().toLowerCase().startsWith("solid")) return null;
  const acc = new Accumulator();
  const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g;
  let tri: Vec[] = [];
  for (let m = re.exec(text); m; m = re.exec(text)) {
    tri.push([Number(m[1]), Number(m[2]), Number(m[3])]);
    if (tri.length === 3) {
      acc.add(tri[0], tri[1], tri[2]);
      tri = [];
    }
  }
  return acc.result();
}

/** Measures an STL, or returns null if it can't be read as one. */
export function measureStl(data: ArrayBuffer | Uint8Array): StlGeometry | null {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const geometry = isBinary(view) ? parseBinary(view) : parseAscii(bytes);
  if (!geometry) return null;
  const { x, y, z } = geometry.boundingBoxMm;
  if (![x, y, z, geometry.volumeMm3].every(Number.isFinite)) return null;
  return geometry;
}
