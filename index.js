import express from "express";
import { userRouter } from "./Routes/userRoute.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(`Connection Failed : ${err}`));

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
