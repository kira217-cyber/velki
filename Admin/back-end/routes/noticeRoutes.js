import express from "express";
import Notice from "../models/Notice.js";

const router = express.Router();

// নোটিস ফেচ
router.get("/notices", async (req, res) => {
  try {
    const notice = await Notice.findOne();
    if (!notice) return res.json({});
    res.json({
      _id: notice._id,
      title: notice.title,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নোটিস তৈরি বা আপডেট
router.post("/notices", async (req, res) => {
  try {
    const { title } = req.body;
    const existingNotice = await Notice.findOne();

    if (existingNotice) {
      existingNotice.title = title || existingNotice.title;
      const updatedNotice = await existingNotice.save();
      res.json({
        _id: updatedNotice._id,
        title: updatedNotice.title,
      });
    } else {
      const newNotice = new Notice({ title: title || "" });
      const savedNotice = await newNotice.save();
      res.status(201).json({
        _id: savedNotice._id,
        title: savedNotice.title,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/notices/:id", async (req, res) => {
  try {
    const { title } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    notice.title = title || notice.title;
    const updatedNotice = await notice.save();
    res.json({
      _id: updatedNotice._id,
      title: updatedNotice.title,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// নোটিস ডিলিট
router.delete("/notices/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;