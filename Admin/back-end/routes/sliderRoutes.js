import express from "express";
import Slider from "../models/Slider.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { unlink } from "fs/promises"; // ESM-এ fs.promises থেকে unlink ইম্পোর্ট

const router = express.Router();

// __dirname সেটআপ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer কনফিগারেশন
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// সব স্লাইডার পাওয়া
router.get("/", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders.map((s) => ({ _id: s._id, imageUrl: `/uploads/${s.imageUrl}` })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নতুন স্লাইডার আপলোড
router.post("/", upload.single("slider"), async (req, res) => {
  try {
    const { filename } = req.file;
    const slider = new Slider({ imageUrl: filename });
    const savedSlider = await slider.save();
    res.status(201).json(savedSlider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// স্লাইডার ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });

    // ফাইল ডিলিট (ESM-এ promises API ব্যবহার)
    const filePath = path.join(__dirname, "../uploads", slider.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
      // ফাইল ডিলিট ব্যর্থ হলে অগ্রাহ্য করা যেতে পারে
    }

    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Slider deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;