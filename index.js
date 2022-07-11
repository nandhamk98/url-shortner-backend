import express from "express";
import { userRouter } from "./Routes/userRoute.js";
import { urlShortnerRouter } from "./Routes/urlShortnerRoute.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

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
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/urlShortner", urlShortnerRouter);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
