// models/Categories.js
import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: [
        "Popular",
        "Live",
        "Table",
        "Slot",
        "Fishing",
        "Egame",
      ],
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId, // provider এর _id সেভ হবে
      required: true,
    },
    providerName: { // UI তে দেখানোর জন্য নামও রাখলাম
      type: String,
      required: true,
    },
    mainImage: { type: String, required: true },
    iconImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categoriesSchema);