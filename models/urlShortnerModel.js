import mongoose from "mongoose";

const { Schema, model } = mongoose;

const urlShortnerSchema = new Schema(
  {
    username: {
      type: "string",
      required: true,
    },
    url: {
      type: "String",
      required: true,
    },
    shortner: {
      type: "String",
      required: true,
      unique: true,
    },
    count: {
      type: "number",
    },
  },
  { timestamps: true }
);

export const urlShortner = model("urlShortner", urlShortnerSchema);
