import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import QuoteRequestForm from "./QuoteRequestForm";

const testMaterials = [
  { id: "PLA", label: "PLA", ratePerGram: 0.18, density: 1.24 },
  { id: "PETG", label: "PETG", ratePerGram: 0.22, density: 1.27 },
  { id: "other", label: "Other (I'll describe it)", ratePerGram: null },
];
const pricing = { hourlyRate: 5, timeMultipliers: { draft: 0.7, standard: 1, high: 1.6 } };

/** A 40 mm binary STL cube, so the form has real geometry to price. */
function cubeFile(): File {
  const s = 40;
  const v = (x: number, y: number, z: number) => [x * s, y * s, z * s];
  const quads = [
    [v(0, 0, 0), v(0, 1, 0), v(1, 1, 0), v(1, 0, 0)],
    [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)],
    [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)],
    [v(0, 1, 0), v(0, 1, 1), v(1, 1, 1), v(1, 1, 0)],
    [v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0)],
    [v(1, 0, 0), v(1, 1, 0), v(1, 1, 1), v(1, 0, 1)],
  ];
  const tris = quads.flatMap(([a, b, c, d]) => [[a, b, c], [a, c, d]]);
  const buf = new ArrayBuffer(84 + tris.length * 50);
  const view = new DataView(buf);
  view.setUint32(80, tris.length, true);
  tris.forEach((tri, i) => tri.forEach((p, k) => p.forEach((c, j) => view.setFloat32(84 + i * 50 + 12 + k * 12 + j * 4, c, true))));
  return new File([buf], "cube.stl", { type: "model/stl" });
}

describe("QuoteRequestForm", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn((url: string) => {
      if (url.startsWith("/api/shipping/estimate")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              options: [
                { id: "pickup", method: "pickup", label: "Pickup in Frankston", price: 0 },
                { id: "AUS_PARCEL_REGULAR", method: "shipped", label: "Parcel Post", price: 11.7 },
              ],
              postalUnavailable: null,
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, requestId: 1005, estimate: null }) });
    });
    // @ts-expect-error test double
    global.fetch = fetchMock;
  });

  test("prices the uploaded STL live, adds delivery and submits the choice", async () => {
    render(<QuoteRequestForm materials={testMaterials} pricing={pricing} />);
    expect(screen.getByText(/Upload an STL to see your price/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Model file/i), { target: { files: [cubeFile()] } });
    await waitFor(() => expect(screen.getByText(/40 × 40 × 40 mm/)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Postcode/i), { target: { value: "2000" } });
    const parcel = await screen.findByLabelText(/Parcel Post/i, {}, { timeout: 2000 });
    fireEvent.click(parcel);
    expect(screen.getByText(/Estimated total/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Name$/i), { target: { value: "Deej Potter" } });
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: "deej@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Suburb$/i), { target: { value: "Sydney" } });
    fireEvent.submit(screen.getByRole("button", { name: /Send for a final quote/i }).closest("form") as HTMLFormElement);

    await waitFor(() => expect(screen.getByText(/Your quote number is 1005/i)).toBeInTheDocument());
    const submit = fetchMock.mock.calls.find(([url]) => url === "/api/3d-printing-quote");
    const body = submit![1].body as FormData;
    expect(body.get("deliveryOption")).toBe("AUS_PARCEL_REGULAR");
    expect(body.get("postcode")).toBe("2000");
    expect(body.get("modelFile")).toBeInstanceOf(File);
  });

  test("explains that non-STL files are priced by hand", async () => {
    render(<QuoteRequestForm materials={testMaterials} pricing={pricing} />);
    const step = new File(["step"], "part.step");
    fireEvent.change(screen.getByLabelText(/Model file/i), { target: { files: [step] } });
    await waitFor(() => expect(screen.getByText(/price this one by hand/i)).toBeInTheDocument());
  });
});
