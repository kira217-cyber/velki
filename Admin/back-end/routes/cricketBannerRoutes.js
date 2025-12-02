import express from "express";
import CricketBanner from "../models/CricketBanner.js"; // নতুন CricketBanner মডেল
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { unlink } from "fs/promises"; // ESM-এ fs.promises থেকে unlink

const router = express.Router();

// __dirname সেটআপ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer কনফিগারেশন
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // আপলোড ফোল্ডার
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ফাইল নামে টাইমস্ট্যাম
  },
});

const upload = multer({ storage: storage });

// সব ক্রিকেট ব্যানার পাওয়া
router.get("/", async (req, res) => {
  try {
    const banners = await CricketBanner.find();
    res.json(banners.map((b) => ({ _id: b._id, imageUrl: `/uploads/${b.imageUrl}` })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নতুন ক্রিকেট ব্যানার আপলোড
router.post("/", upload.single("cricketBanner"), async (req, res) => {
  try {
    const { filename } = req.file;
    const banner = new CricketBanner({ imageUrl: filename });
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ক্রিকেট ব্যানার ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const banner = await CricketBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Cricket banner not found" });

    const filePath = path.join(__dirname, "../uploads", banner.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await CricketBanner.findByIdAndDelete(req.params.id);
    res.json({ message: "Cricket banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;