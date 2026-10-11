import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
if (!uri && process.env.NODE_ENV === "production") {
  console.warn("Warning: MONGODB_URI environment variable is not defined");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // ডেভেলপমেন্টে হট রিলোডের কারণে অতিরিক্ত কানেকশন রোধ করতে গ্লোবাল ভেরিয়েবলে ক্যাশ
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // প্রোডাকশনে সরাসরি ক্লায়েন্ট ইনিশিয়ালাইজ
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase() {
  const connectedClient = await clientPromise;
  return connectedClient.db(process.env.MONGODB_DB || "bazardor");
}
