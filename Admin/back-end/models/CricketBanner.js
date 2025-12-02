import mongoose from "mongoose";

const cricketBannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CricketBanner = mongoose.model("CricketBanner", cricketBannerSchema);
export default CricketBanner;