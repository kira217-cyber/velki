import express from "express";
import TennisBanner from "../models/TennisBanner.js"; // নতুন TennisBanner মডেল
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

// সব টেনিস ব্যানার পাওয়া
router.get("/", async (req, res) => {
  try {
    const banners = await TennisBanner.find();
    res.json(banners.map((b) => ({ _id: b._id, imageUrl: `/uploads/${b.imageUrl}` })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নতুন টেনিস ব্যানার আপলোড
router.post("/", upload.single("tennisBanner"), async (req, res) => {
  try {
    const { filename } = req.file;
    const banner = new TennisBanner({ imageUrl: filename });
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// টেনিস ব্যানার ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const banner = await TennisBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Tennis banner not found" });

    const filePath = path.join(__dirname, "../uploads", banner.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await TennisBanner.findByIdAndDelete(req.params.id);
    res.json({ message: "Tennis banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;