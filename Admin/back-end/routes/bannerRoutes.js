import express from "express";
import Banner2 from "../models/Banner2.js";

const router = express.Router();

// ব্যানার সেটিংস ফেচ
router.get("/banner", async (req, res) => {
  try {
    const banner = await Banner2.findOne();
    if (!banner) return res.json({});
    res.json({
      _id: banner._id,
      bgColor: banner.bgColor,
      textColor: banner.textColor,
      fontSize: banner.fontSize,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ব্যানার সেটিংস আপডেট
router.post("/banner", async (req, res) => {
  try {
    const { bgColor, textColor, fontSize } = req.body;
    const existingBanner = await Banner2.findOne();

    if (existingBanner) {
      existingBanner.bgColor = bgColor || existingBanner.bgColor;
      existingBanner.textColor = textColor || existingBanner.textColor;
      existingBanner.fontSize = fontSize || existingBanner.fontSize;
      const updatedBanner = await existingBanner.save();
      res.json({
        _id: updatedBanner._id,
        bgColor: updatedBanner.bgColor,
        textColor: updatedBanner.textColor,
        fontSize: updatedBanner.fontSize,
      });
    } else {
      const newBanner = new Banner2({
        bgColor: bgColor || "#ffffff",
        textColor: textColor || "#000000",
        fontSize: fontSize || 16,
      });
      const savedBanner = await newBanner.save();
      res.status(201).json({
        _id: savedBanner._id,
        bgColor: savedBanner.bgColor,
        textColor: savedBanner.textColor,
        fontSize: savedBanner.fontSize,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;