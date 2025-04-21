import { Context } from "@netlify/functions/dist/function/context";
import { Event } from "@netlify/functions/dist/function/event";
import { Collection, MongoClient, ObjectId } from "mongodb";

// Define an interface for the document that includes the default MongoDB fields.
// _id, createdAt, updatedAt are optional since they may not be included in every document,
// and an index signature is added to accommodate any other fields.
interface Document {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;

  [key: string]: any;
}

// URI and database name are fetched from environment variables.
const uri = process.env["MONGODB_URI"];
const DB_NAME = process.env["DB_NAME"];

// Check if the URI and database name are available.
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!DB_NAME) {
  throw new Error("Missing DB_NAME environment variable");
}

// Create a new client.
const client = new MongoClient(uri);

// This is a helper function to perform MongoDB operations.
// It creates a connection, performs the operation, and closes the connection.
async function performMongoOperation<T extends Document>(
  collectionName: string,
  operation: (collection: Collection<T>) => Promise<any>
): Promise<any> {
  // Connect to the client.
  await client.connect();
  // Select the database.
  const db = client.db(DB_NAME);
  // Select the collection and perform the operation.
  const collection = db.collection<T>(collectionName);
  return await operation(collection);
}

// The main handler function is triggered by Netlify.
export async function handler(event: Event, context: Context) {
  const { httpMethod, body, queryStringParameters } = event;
  const collection = queryStringParameters?.collection;
  const id = queryStringParameters?.id;

  // Validate collection name.
  if (typeof collection !== "string" || collection.length === 0) {
    return { statusCode: 400, body: "Invalid or missing collection name" };
  }

  // Validate the id for PUT and DELETE requests.
  let objectId: ObjectId | undefined = undefined;
  if (httpMethod === "PUT" || httpMethod === "DELETE") {
    try {
      objectId = new ObjectId(id);
    } catch {
      return { statusCode: 400, body: "Invalid or missing id" };
    }
  }

  // Validate and parse body for POST and PUT requests.
  let parsedBody: Document | null = null;
  if (httpMethod === "POST" || httpMethod === "PUT") {
    try {
      parsedBody = JSON.parse(body!);
    } catch {
      return { statusCode: 400, body: "Invalid or missing body" };
    }
  }

  try {
    // Depending on the HTTP method, perform the appropriate operation.
    switch (httpMethod) {
      case "GET":
        // For get requests, fetch all documents from the specified collection.
        return {
          statusCode: 200,
          body: JSON.stringify(
            await performMongoOperation(collection, (collection) =>
              collection.find({}).toArray()
            )
          ),
        };

      case "POST":
        // For a POST request, the createdAt and updatedAt fields are set to the current date and time.
        parsedBody!.createdAt = new Date();
        parsedBody!.updatedAt = new Date();
        // Insert the parsed body as a new document into the specified collection.
        return {
          statusCode: 200,
          body: JSON.stringify(
            await performMongoOperation(collection, (collection) =>
              collection.insertOne(parsedBody!)
            )
          ),
        };

      case "PUT":
        // For a PUT request, only the updatedAt field is updated to the current date and time.
        parsedBody!.updatedAt = new Date();
        // Update the document with the specified id in the specified collection.
        return {
          statusCode: 200,
          body: JSON.stringify(
            await performMongoOperation(collection, (collection) =>
              collection.updateOne({ _id: objectId }, { $set: parsedBody! })
            )
          ),
        };

      case "DELETE":
        // Delete the document with the specified id from the specified collection.
        return {
          statusCode: 200,
          body: JSON.stringify(
            await performMongoOperation(collection, (collection) =>
              collection.deleteOne({ _id: objectId })
            )
          ),
        };

      default:
        // Return an error for other HTTP methods.
        return { statusCode: 405, body: "Method not allowed" };
    }
  } catch (error) {
    // Log the error and return an Internal Server Error response.
    console.error(`Error ${httpMethod.toLowerCase()}ing data`, error);
    return {
      statusCode: 500,
      body: `Error ${httpMethod.toLowerCase()}ing data`,
    };
  }
}
