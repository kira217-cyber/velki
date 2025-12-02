import mongoose from "mongoose";

const tennisBannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TennisBanner = mongoose.model("TennisBanner", tennisBannerSchema);
export default TennisBanner;