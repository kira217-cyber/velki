import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  webMenuBgColor: {
    type: String,
    default: "#ffffff",
  },
  webMenuTextColor: {
    type: String,
    default: "#000000",
  },
  webMenuFontSize: {
    type: Number,
    default: 16,
  },
  webMenuHoverColor: {
    type: String,
    default: "#cccccc",
  },
  webMenuHoverTextColor: {
    type: String,
    default: "#cccccc",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;