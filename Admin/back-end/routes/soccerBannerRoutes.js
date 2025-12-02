import express from "express";
import SoccerBanner from "../models/SoccerBanner.js"; // নতুন SoccerBanner মডেল
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

// সব সকার ব্যানার পাওয়া
router.get("/", async (req, res) => {
  try {
    const banners = await SoccerBanner.find();
    res.json(banners.map((b) => ({ _id: b._id, imageUrl: `/uploads/${b.imageUrl}` })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// নতুন সকার ব্যানার আপলোড
router.post("/", upload.single("soccerBanner"), async (req, res) => {
  try {
    const { filename } = req.file;
    const banner = new SoccerBanner({ imageUrl: filename });
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// সকার ব্যানার ডিলিট
router.delete("/:id", async (req, res) => {
  try {
    const banner = await SoccerBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Soccer banner not found" });

    const filePath = path.join(__dirname, "../uploads", banner.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await SoccerBanner.findByIdAndDelete(req.params.id);
    res.json({ message: "Soccer banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;