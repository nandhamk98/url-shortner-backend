import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: "String",
      required: true,
      unique: true,
      min: 8,
      max: 25,
    },
    lastname: {
      type: "String",
      min: 8,
      max: 25,
    },
    password: {
      type: "String",
      required: true,
      unique: true,
      min: 15,
      max: 50,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      min: 15,
      max: 50,
    },
    token: {
      type: "String",
      unique: true,
    },
    activation: {
      type: "String",
      unique: true,
    },
  },
  { timestamps: true }
);

export const user = model("user", userSchema);
