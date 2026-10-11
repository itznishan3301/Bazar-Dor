import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://bazardor:S8TbSyMK%402hdBUU@bazardor.anxfedh.mongodb.net/bazardor?retryWrites=true&w=majority&appName=bazardor";

const client = new MongoClient(uri);

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.MONGODB_DB || "bazardor")),
  emailAndPassword: {
    enabled: true,
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "t06COGp5XEBVzx6QdXI4eojlrnFaZAYO",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
