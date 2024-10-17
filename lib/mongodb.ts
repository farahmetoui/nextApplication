import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI n’est pas définie dans le fichier .env.local");
}

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri as string, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any)._mongoClientPromise = client.connect();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // En production, crée une nouvelle connexion
  client = new MongoClient(uri as string, options);
  clientPromise = client.connect();
}

export default clientPromise;
