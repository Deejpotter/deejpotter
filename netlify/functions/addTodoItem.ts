import {MongoClient} from 'mongodb';

let uri = process.env["MONGODB_URI"];

exports.handler = async (event: any, context: any) => {
  if (event.httpMethod !== 'POST') {
    return {statusCode: 405, body: 'Method Not Allowed'};
  }

  const userId = event.headers['x-user-id'];
  const todoText = event.body;

  if (!userId) {
    return {statusCode: 400, body: 'User ID is required'};
  }

  if (!todoText) {
    return {statusCode: 400, body: 'Todo text is required'};
  }

  try {
    if (!uri) {
      throw new Error("Missing MONGODB_URI environment variable");
    }
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully to server");
    const collection = client.db('Deejpotter').collection('Users');
    const result = await collection.updateOne({userId: userId}, {$push: {items: {text: todoText}}});
    console.log("Added todo item to user data: ", result);
    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({message: 'Todo item added successfully'}),
    };
  } catch (error) {
    console.error("Error adding todo item: ", error);
    return {statusCode: 500, body: 'Error adding todo item'};
  }
};
