import express from "express";
import SubCategory from "../models/SubCategory.js";

const router = express.Router();

// সাবক্যাটেগরি সেটিংস ফেচ
router.get("/subcategory", async (req, res) => {
  try {
    const subCategory = await SubCategory.findOne();
    if (!subCategory) return res.json({});
    res.json({
      _id: subCategory._id,
      webMenuBgColor: subCategory.webMenuBgColor,
      webMenuTextColor: subCategory.webMenuTextColor,
      webMenuFontSize: subCategory.webMenuFontSize,
      webMenuHoverColor: subCategory.webMenuHoverColor,
      webMenuHoverTextColor: subCategory.webMenuHoverTextColor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// সাবক্যাটেগরি সেটিংস আপডেট
router.post("/subcategory", async (req, res) => {
  try {
    const { webMenuBgColor, webMenuTextColor, webMenuFontSize, webMenuHoverColor, webMenuHoverTextColor } = req.body;
    const existingSubCategory = await SubCategory.findOne();

    if (existingSubCategory) {
      existingSubCategory.webMenuBgColor = webMenuBgColor || existingSubCategory.webMenuBgColor;
      existingSubCategory.webMenuTextColor = webMenuTextColor || existingSubCategory.webMenuTextColor;
      existingSubCategory.webMenuFontSize = webMenuFontSize || existingSubCategory.webMenuFontSize;
      existingSubCategory.webMenuHoverColor = webMenuHoverColor || existingSubCategory.webMenuHoverColor;
      existingSubCategory.webMenuHoverTextColor = webMenuHoverTextColor || existingSubCategory.webMenuHoverTextColor;
      const updatedSubCategory = await existingSubCategory.save();
      res.json({
        _id: updatedSubCategory._id,
        webMenuBgColor: updatedSubCategory.webMenuBgColor,
        webMenuTextColor: updatedSubCategory.webMenuTextColor,
        webMenuFontSize: updatedSubCategory.webMenuFontSize,
        webMenuHoverColor: updatedSubCategory.webMenuHoverColor,
        webMenuHoverTextColor: updatedSubCategory.webMenuHoverTextColor,
      });
    } else {
      const newSubCategory = new SubCategory({
        webMenuBgColor: webMenuBgColor || "#ffffff",
        webMenuTextColor: webMenuTextColor || "#000000",
        webMenuFontSize: webMenuFontSize || 16,
        webMenuHoverColor: webMenuHoverColor || "#cccccc",
        webMenuHoverTextColor: webMenuHoverTextColor || "#cccccc",
      });
      const savedSubCategory = await newSubCategory.save();
      res.status(201).json({
        _id: savedSubCategory._id,
        webMenuBgColor: savedSubCategory.webMenuBgColor,
        webMenuTextColor: savedSubCategory.webMenuTextColor,
        webMenuFontSize: savedSubCategory.webMenuFontSize,
        webMenuHoverColor: savedSubCategory.webMenuHoverColor,
        webMenuHoverTextColor: savedSubCategory.webMenuHoverTextColor,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;