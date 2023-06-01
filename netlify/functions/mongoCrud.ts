import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import {MongoClient, ObjectId} from 'mongodb';

const uri = process.env['MONGODB_URI'];

async function performMongoOperation(collectionName: any, operation: any, ...args: any[]) {
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri);

  try {
    console.log('Connecting to server');
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('deejpotter');

    const collection = db.collection(collectionName);
    const result = await operation(collection, ...args);
    console.log('Operation completed successfully');
    return result;
  } finally {
    await client.close();
  }
}

export async function handler(event: Event, context: Context) {
  console.log(`Received ${event.httpMethod} request for ${event.path}`);

  const {httpMethod, body, queryStringParameters} = event;
  const collection = queryStringParameters['collection'];
  const id = queryStringParameters['id'];

  if (httpMethod === 'GET' && !collection) {
    console.log('Path parameters missing');
    return {statusCode: 400, body: 'Path parameters missing'};
  }

  try {
    let result;

    switch (httpMethod) {
      case 'GET':
        result = await performMongoOperation(
          collection,
          (collection: any) => collection.find({}).toArray()
        );
        break;

      case 'POST':
        result = await performMongoOperation(
          collection,
          (collection: any) => collection.insertOne(JSON.parse(body))
        );
        break;

      case 'PUT':
        result = await performMongoOperation(
          collection,
          (collection: any) =>
            collection.updateOne({_id: id}, {$set: JSON.parse(body)})
        );
        break;

      case 'DELETE':
        result = await performMongoOperation(
          collection,
          (collection: any) => collection.deleteOne({_id: id})
        );
        break;

      default:
        console.log('Method not allowed');
        return {statusCode: 405, body: 'Method not allowed'};
    }

    console.log(`Returning result: ${JSON.stringify(result)}`);
    return {statusCode: 200, body: JSON.stringify(result)};
  } catch (error) {
    console.error(`Error ${httpMethod.toLowerCase()}ing data`, error);
    return {statusCode: 500, body: `Error ${httpMethod.toLowerCase()}ing data`};
  }
}
