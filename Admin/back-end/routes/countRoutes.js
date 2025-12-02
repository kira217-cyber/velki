import express from "express";
import Count from "../models/Count.js";

const router = express.Router();

// কাউন্ট সেটিংস ফেচ
router.get("/count", async (req, res) => {
  try {
    const count = await Count.findOne();
    if (!count) return res.json({});
    res.json({
      _id: count._id,
      bgColor: count.bgColor,
      textColor: count.textColor,
      fontSize: count.fontSize,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// কাউন্ট সেটিংস আপডেট
router.post("/count", async (req, res) => {
  try {
    const { bgColor, textColor, fontSize } = req.body;
    const existingCount = await Count.findOne();

    if (existingCount) {
      existingCount.bgColor = bgColor || existingCount.bgColor;
      existingCount.textColor = textColor || existingCount.textColor;
      existingCount.fontSize = fontSize || existingCount.fontSize;
      const updatedCount = await existingCount.save();
      res.json({
        _id: updatedCount._id,
        bgColor: updatedCount.bgColor,
        textColor: updatedCount.textColor,
        fontSize: updatedCount.fontSize,
      });
    } else {
      const newCount = new Count({
        bgColor: bgColor || "#ffffff",
        textColor: textColor || "#000000",
        fontSize: fontSize || 16,
      });
      const savedCount = await newCount.save();
      res.status(201).json({
        _id: savedCount._id,
        bgColor: savedCount.bgColor,
        textColor: savedCount.textColor,
        fontSize: savedCount.fontSize,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;