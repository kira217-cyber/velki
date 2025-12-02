import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Logo from "../models/Logo.js";

const router = express.Router();

// __dirname সেটআপ (ES মডিউলের জন্য)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer স্টোরেজ সেটআপ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    // uploads ফোল্ডার না থাকলে তৈরি করুন
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ফাইল ফিল্টার (শুধু ইমেজ)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpg, jpeg, png) are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// POST: লোগো আপলোড (যদি থাকে আপডেট, না থাকলে নতুন)
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newPath = `/uploads/${req.file.filename}`;
    let logo = await Logo.findOne();

    if (logo) {
      // পুরনো ফাইল ডিলিট
      const oldFilePath = path.join(__dirname, "..", logo.path);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      logo.path = newPath;
      await logo.save();
      res.json(logo);
    } else {
      logo = new Logo({ path: newPath });
      await logo.save();
      res.json(logo);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET: কারেন্ট লোগো ফেচ (মেইন ওয়েবসাইটের জন্যও এটাই ব্যবহার করুন)
router.get("/", async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.json(logo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: লোগো ডিলিট (ফাইলও রিমুভ)
router.delete("/:id", async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) return res.status(404).json({ message: "Logo not found" });

    // ফাইল ডিলিট
    const filePath = path.join(__dirname, "..", logo.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Logo.findByIdAndDelete(req.params.id);
    res.json({ message: "Logo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;