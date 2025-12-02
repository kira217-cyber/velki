import mongoose from "mongoose";

const countSchema = new mongoose.Schema({
  bgColor: {
    type: String,
    default: "#ffffff",
  },
  textColor: {
    type: String,
    default: "#000000",
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Count = mongoose.model("Count", countSchema);
export default Count;