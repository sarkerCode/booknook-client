
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  globalThis.mongoClient ?? new MongoClient(uri);

globalThis.mongoClient = client;

const db = client.db("booknook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
});
