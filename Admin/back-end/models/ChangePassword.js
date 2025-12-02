import mongoose from "mongoose";

const ChangePassword = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model("ChangePassword", ChangePassword);