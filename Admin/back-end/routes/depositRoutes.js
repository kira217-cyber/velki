import express from "express";
import DepositSettings from "../models/DepositSettings.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname সেটআপ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer সেটআপ ইমেজ আপলোডের জন্য (uploads ফোল্ডারে সংরক্ষণ)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET: ডিপোজিট সেটিংস ফেচ করা
router.get("/deposit/settings", async (req, res) => {
  try {
    let settings = await DepositSettings.findOne();
    if (!settings) {
      settings = new DepositSettings(); // ডিফল্ট তৈরি করা
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// PUT: ডিপোজিট সেটিংস আপডেট করা
router.put("/deposit/settings", async (req, res) => {
  try {
    const settings = await DepositSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // না থাকলে তৈরি করা
    });
    res.status(200).json({ message: "সেটিংস আপডেট সফল", settings });
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// POST: ইমেজ আপলোড (payment method-এর লোগো)
router.post("/upload/payment-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "ইমেজ আপলোড ব্যর্থ" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// POST: ডিপোজিট রিকোয়েস্ট সাবমিট (Deposit কম্পোনেন্ট থেকে)
router.post("/deposit", async (req, res) => {
  try {
    const { selectedMethod, paymentType, amount, pbuAmount, totalPBU } = req.body;
    if (!selectedMethod || !paymentType || !amount) {
      return res.status(400).json({ message: "সকল ফিল্ড পূরণ করুন" });
    }
    const settings = await DepositSettings.findOne();
    if (amount < settings.min_amount || amount > settings.max_amount) {
      return res.status(400).json({ message: `পরিমাণ ${settings.min_amount} থেকে ${settings.max_amount} এর মধ্যে হতে হবে` });
    }
    // এখানে ডিপোজিট সংরক্ষণ করুন (চাইলে নতুন মডেল তৈরি করুন)
    res.status(200).json({ message: "ডিপোজিট রিকোয়েস্ট সফল" });
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

export default router;