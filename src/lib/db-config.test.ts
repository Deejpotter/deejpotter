import { getSettings, updateSettings } from "./db-config";
import { setupMongoMemoryServer, teardownMongoMemoryServer } from "./mongoMemoryServer";

describe("updateSettings", () => {
  const saved = { ...process.env };

  beforeAll(async () => {
    const { uri } = await setupMongoMemoryServer();
    process.env.MONGODB_URI = uri;
    process.env.DB_NAME = "test_settings";
  });

  afterAll(async () => {
    process.env = saved;
    await teardownMongoMemoryServer();
  });

  test("saves the whole document the admin page sends back, _id included", async () => {
    const loaded = await getSettings();
    const updated = await updateSettings({
      ...loaded,
      shipping: { ...loaded.shipping, localPostcodes: ["3199"], localDeliveryFee: 12, freeLocalDelivery: false },
    } as never);
    expect(updated.shipping.localPostcodes).toEqual(["3199"]);
    expect(updated.shipping.localDeliveryFee).toBe(12);
  });

  test("rejects invalid shipping settings", async () => {
    const loaded = await getSettings();
    await expect(
      updateSettings({ shipping: { ...loaded.shipping, originPostcode: "abc" } } as never),
    ).rejects.toThrow();
  });
});
