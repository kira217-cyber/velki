// routes/categories.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Category from "../models/Categories.js";

const router = express.Router();

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
    }
  },
});

// CREATE Category
router.post(
  "/",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { categoryName, providerId, providerName } = req.body;

      if (!req.files?.mainImage || !req.files?.iconImage) {
        return res.status(400).json({ message: "Both images are required" });
      }

      const newCategory = new Category({
        categoryName,
        providerId,
        providerName,
        mainImage: `/uploads/${req.files.mainImage[0].filename}`,
        iconImage: `/uploads/${req.files.iconImage[0].filename}`,
      });

      await newCategory.save();
      res.status(201).json({ success: true, data: newCategory });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Category
router.put(
  "/:id",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "iconImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { categoryName, providerId, providerName } = req.body;
      const updateData = { categoryName, providerId, providerName };

      if (req.files?.mainImage) {
        updateData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
      }
      if (req.files?.iconImage) {
        updateData.iconImage = `/uploads/${req.files.iconImage[0].filename}`;
      }

      const updated = await Category.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!updated) return res.status(404).json({ message: "Category not found" });

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE Category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;