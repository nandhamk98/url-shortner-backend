import express from "express";
import dotenv from "dotenv";
// import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./UserRoute.js";
import { urlShortnerRouter } from "./UrlShortnerRoute.js";
import { MongoClient } from "mongodb";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
// console.log(MONGO_URL);
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("db connected");
  return client;
}

export const client = await createConnection();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/urlShortner", urlShortnerRouter);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
