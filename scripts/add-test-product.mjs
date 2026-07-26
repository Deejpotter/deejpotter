// Add a test product to the shop
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "deejpotter";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Load it from the environment instead of hardcoding credentials.");
}

const testProduct = {
  name: "Custom 3D Print - Test Design",
  slug: "custom-3d-print-test",
  description: "A test product for 3D printing services. Upload your design and get a custom quote.",
  price: 5000, // $50.00 AUD
  type: "service",
  images: ["/images/shop-placeholder.svg"],
  tags: ["3d-printing", "custom", "service"],
  published: true,
  serviceConfig: {
    requiresQuote: true,
    deliveryDays: 7,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function addProduct() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db(DB_NAME);
    const collection = db.collection("shop_products");
    
    const result = await collection.insertOne(testProduct);
    console.log("Product added with _id:", result.insertedId);
    
    // Verify by fetching all products
    const products = await collection.find({}).toArray();
    console.log("Total products in database:", products.length);
    products.forEach(p => console.log(`  - ${p.name} (${p.type})`));
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

addProduct();
