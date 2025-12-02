import express from "express";
import LoginImage from "../models/LoginImage.js";
import AdminLoginImage from "../models/AdminLoginImage.js"; // Import the new model
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { unlink } from "fs/promises";

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

// Regular admin Login Image Routes
router.get("/admin-login-image", async (req, res) => {
  try {
    const loginImage = await LoginImage.findOne();
    if (!loginImage) return res.json({});
    res.json({ _id: loginImage._id, loginImageUrl: `/uploads/${loginImage.imageUrl}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/admin-login-image", upload.single("loginImage"), async (req, res) => {
  try {
    const existingImage = await LoginImage.findOne();
    if (existingImage) {
      const oldFilePath = path.join(__dirname, "../uploads", existingImage.imageUrl);
      try {
        await unlink(oldFilePath);
      } catch (fileErr) {
        console.error("Error deleting old file:", fileErr);
      }
      await LoginImage.findByIdAndDelete(existingImage._id);
    }

    const { filename } = req.file;
    const newLoginImage = new LoginImage({ imageUrl: filename });
    const savedImage = await newLoginImage.save();
    res.status(201).json({ _id: savedImage._id, loginImageUrl: `/uploads/${filename}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/admin-login-image/:id", async (req, res) => {
  try {
    const loginImage = await LoginImage.findById(req.params.id);
    if (!loginImage) return res.status(404).json({ message: "Login image not found" });

    const filePath = path.join(__dirname, "../uploads", loginImage.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await LoginImage.findByIdAndDelete(req.params.id);
    res.json({ message: "Login image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Image Routes
router.get("/login-image", async (req, res) => {
  try {
    const adminLoginImage = await AdminLoginImage.findOne();
    if (!adminLoginImage) return res.json({});
    res.json({ _id: adminLoginImage._id, loginImageUrl: `/uploads/${adminLoginImage.imageUrl}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login-image", upload.single("loginImage"), async (req, res) => {
  try {
    const existingImage = await AdminLoginImage.findOne();
    if (existingImage) {
      const oldFilePath = path.join(__dirname, "../uploads", existingImage.imageUrl);
      try {
        await unlink(oldFilePath);
      } catch (fileErr) {
        console.error("Error deleting old file:", fileErr);
      }
      await AdminLoginImage.findByIdAndDelete(existingImage._id);
    }

    const { filename } = req.file;
    const newAdminLoginImage = new AdminLoginImage({ imageUrl: filename });
    const savedImage = await newAdminLoginImage.save();
    res.status(201).json({ _id: savedImage._id, loginImageUrl: `/uploads/${filename}` });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/login-image/:id", async (req, res) => {
  try {
    const adminLoginImage = await AdminLoginImage.findById(req.params.id);
    if (!adminLoginImage) return res.status(404).json({ message: "Admin login image not found" });

    const filePath = path.join(__dirname, "../uploads", adminLoginImage.imageUrl);
    try {
      await unlink(filePath);
    } catch (fileErr) {
      console.error("Error deleting file:", fileErr);
    }

    await AdminLoginImage.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin login image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;