import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  username?: string;
  email: string;
  password?: string;
  image: string;
  isSubscribed: boolean;
  provider: string;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["github", "google", "credentials"],
    default: "credentials",
  },
});

const UserModel =
  (mongoose.models?.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
