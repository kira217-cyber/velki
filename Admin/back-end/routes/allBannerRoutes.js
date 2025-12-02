import express from "express";
import Banner from "../models/Banner.js"; // নতুন Banner মডেল ইম্পোর্ট
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { unlink } from "fs/promises"; // ESM-এ fs.promises থেকে unlink

const router = express.Router();

// __dirname সেটআপ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer কনফিগারেশন (ফাইল আপলোডের জন্য)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // আপলোড ফোল্ডার
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ফাইল নামে টাইমস্ট্যাম যোগ
  },
});

const upload = multer({ storage: storage });

// সব ব্যানার পাওয়া
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners.map((b) => ({ _id: b._id, imageUrl: `/uploads/${b.imageUrl}` })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নতুন ব্যানার আপলোড
router.post("/", upload.single("banner"), async (req, res) => {
  try {
    const { filename } = req.file;
    const banner = new Banner({ imageUrl: filename });
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ব্যানার ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    const filePath = path.join(__dirname, "../uploads", banner.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;