import mongoose, { Schema } from "mongoose";
import { User } from "../@types/index";

const UserSchema = new Schema<User>(
  {
    id: String,
    xp: Number,
    level: Number,
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "users",
  }
);

export default mongoose.model("User", UserSchema);