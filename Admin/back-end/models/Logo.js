import mongoose from "mongoose";

const logoSchema = new mongoose.Schema({
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Logo", logoSchema);