// models/Categories.js
import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      enum: ["Popular", "Live", "Table", "Slot", "Fishing", "Egame"],
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // ref: "Provider" // যদি Provider model থাকে তাহলে রাখো
    },
    providerName: {
      type: String,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    iconImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// এটাই ম্যাজিক — categoryName + providerId মিলে Unique
categoriesSchema.index({ categoryName: 1, providerId: 1 }, { unique: true });

// পুরানো ভুল index (categoryName_1) অটো ড্রপ করবে (প্রথমবার সেভ করলে)
categoriesSchema.pre("save", async function (next) {
  try {
    await this.constructor.collection
      .dropIndex("categoryName_1")
      .catch(() => {});
  } catch (err) {
    // index না থাকলে এরর আসবেই — ignore করো
  }
  next();
});

const Category = mongoose.model("Category", categoriesSchema);

export default Category;
