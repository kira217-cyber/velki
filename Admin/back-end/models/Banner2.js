import mongoose from "mongoose";

const banner2Schema = new mongoose.Schema({
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

const Banner2 = mongoose.model("Banner2", banner2Schema);
export default Banner2;