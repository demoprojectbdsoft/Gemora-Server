import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean },
    image: { type: String },
    role: { type: String },
    plan: { type: String },
    status: { type: String },
    member: { type: String },   
    points: { type: Number },
    phone: { type: String },
    bio: { type: String },
    department: { type: String },
  },
  { timestamps: true, collection: "user" }
);

export const User = model("User", userSchema);