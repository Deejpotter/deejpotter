import {MongoClient} from 'mongodb';

const uri = process.env['MONGODB_URI'];

async function performMongoOperation(collectionName: string, operation: Function, ...args: any[]) {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const collection = client.db('YourDatabaseName').collection(collectionName);
    const result = await operation(collection, ...args);
    console.log('Operation completed successfully');
    return result;
  } finally {
    await client.close();
  }
}

async function mongoFindOne(collection: any, query: any) {
  return await collection.findOne(query);
}

async function mongoFind(collection: any, query: any) {
  return await collection.find(query).toArray();
}

async function mongoInsertOne(collection: any, data: any) {
  return await collection.insertOne(data);
}

async function mongoUpdateOne(collection: any, filter: any, update: any) {
  return await collection.updateOne(filter, update);
}

async function mongoDeleteOne(collection: any, filter: any) {
  return await collection.deleteOne(filter);
}

export {
  performMongoOperation,
  mongoFindOne,
  mongoFind,
  mongoInsertOne,
  mongoUpdateOne,
  mongoDeleteOne,
};
