import { NextResponse } from 'next/server';
import { MongoClient, ObjectId, Collection } from 'mongodb';

type Document = { _id?: ObjectId; createdAt?: Date; updatedAt?: Date; [key: string]: any };

const DB_NAME = process.env['DB_NAME'];
const uri = process.env['MONGODB_URI'];

if (!uri) {
  console.warn('MONGODB_URI is not set. Database operations will fail until it is provided.');
}
if (!DB_NAME) {
  console.warn('DB_NAME is not set. Database operations will fail until it is provided.');
}

// Connection caching for Node (avoids reconnecting on hot reload)
let cachedClient: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (cachedClient && cachedClient.topology && (cachedClient as any).isConnected?.()) {
    return cachedClient;
  }
  const client = new MongoClient(uri!);
  await client.connect();
  cachedClient = client;
  return client;
}

async function performMongoOperation<T extends Document>(collectionName: string, operation: (collection: Collection<T>) => Promise<any>): Promise<any> {
  const client = await getClient();
  const db = client.db(DB_NAME);
  const collection = db.collection<T>(collectionName);
  return await operation(collection);
}

function validateCollection(collection: string | null) {
  if (!collection || collection.trim().length === 0) {
    return false;
  }
  // Basic allowlist pattern: letters, numbers, dashes, underscores
  return /^[a-zA-Z0-9_-]+$/.test(collection);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');

  if (!validateCollection(collection)) {
    return NextResponse.json('Invalid or missing collection name', { status: 400 });
  }

  try {
    const docs = await performMongoOperation(collection!, (c) => c.find({}).toArray());
    return NextResponse.json(docs);
  } catch (error) {
    console.error('GET error', error);
    return NextResponse.json(`Error getting data`, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');

  if (!validateCollection(collection)) {
    return NextResponse.json('Invalid or missing collection name', { status: 400 });
  }

  let parsedBody: Document | null = null;
  try {
    parsedBody = await request.json();
  } catch (e) {
    return NextResponse.json('Invalid or missing body', { status: 400 });
  }

  parsedBody.createdAt = new Date();
  parsedBody.updatedAt = new Date();

  try {
    const result = await performMongoOperation(collection!, (c) => c.insertOne(parsedBody!));
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST error', error);
    return NextResponse.json(`Error posting data`, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');
  const id = url.searchParams.get('id');

  if (!validateCollection(collection)) {
    return NextResponse.json('Invalid or missing collection name', { status: 400 });
  }

  if (!id) {
    return NextResponse.json('Invalid or missing id', { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return NextResponse.json('Invalid or missing id', { status: 400 });
  }

  let parsedBody: Document | null = null;
  try {
    parsedBody = await request.json();
  } catch (e) {
    return NextResponse.json('Invalid or missing body', { status: 400 });
  }

  parsedBody.updatedAt = new Date();

  try {
    const result = await performMongoOperation(collection!, (c) => c.updateOne({ _id: objectId }, { $set: parsedBody! }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT error', error);
    return NextResponse.json(`Error putting data`, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const collection = url.searchParams.get('collection');
  const id = url.searchParams.get('id');

  if (!validateCollection(collection)) {
    return NextResponse.json('Invalid or missing collection name', { status: 400 });
  }

  if (!id) {
    return NextResponse.json('Invalid or missing id', { status: 400 });
  }

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return NextResponse.json('Invalid or missing id', { status: 400 });
  }

  try {
    const result = await performMongoOperation(collection!, (c) => c.deleteOne({ _id: objectId }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE error', error);
    return NextResponse.json(`Error deleting data`, { status: 500 });
  }
}
