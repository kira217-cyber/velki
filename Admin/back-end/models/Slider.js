import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;