import express from "express";
import Settings from "../models/Settings.js"; // New model
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

// সেটিংস ফেচ
router.get("/settings", async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return res.json({});
    res.json({
      _id: settings._id,
      title: settings.title,
      faviconUrl: settings.faviconUrl ? `/uploads/${settings.faviconUrl}` : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// সেটিংস আপডেট
router.post("/settings", upload.single("favicon"), async (req, res) => {
  try {
    const { title } = req.body;
    const existingSettings = await Settings.findOne();

    if (existingSettings) {
      // Update existing settings
      if (req.file) {
        // Delete old favicon if it exists
        if (existingSettings.faviconUrl) {
          const oldFilePath = path.join(__dirname, "../uploads", existingSettings.faviconUrl);
          try {
            await unlink(oldFilePath);
          } catch (fileErr) {
            console.error("Error deleting old favicon:", fileErr);
          }
        }
        existingSettings.faviconUrl = req.file.filename;
      }
      existingSettings.title = title || existingSettings.title;
      const updatedSettings = await existingSettings.save();
      res.json({
        _id: updatedSettings._id,
        title: updatedSettings.title,
        faviconUrl: updatedSettings.faviconUrl ? `/uploads/${updatedSettings.faviconUrl}` : null,
      });
    } else {
      // Create new settings
      const newSettings = new Settings({
        title: title || "",
        faviconUrl: req.file ? req.file.filename : null,
      });
      const savedSettings = await newSettings.save();
      res.status(201).json({
        _id: savedSettings._id,
        title: savedSettings.title,
        faviconUrl: savedSettings.faviconUrl ? `/uploads/${savedSettings.faviconUrl}` : null,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete favicon
router.delete("/settings/favicon/:id", async (req, res) => {
  try {
    const settings = await Settings.findById(req.params.id);
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    if (settings.faviconUrl) {
      const filePath = path.join(__dirname, "../uploads", settings.faviconUrl);
      try {
        await unlink(filePath);
      } catch (fileErr) {
        console.error("Error deleting favicon:", fileErr);
      }
      settings.faviconUrl = null;
      await settings.save();
    }

    res.json({ message: "Favicon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;