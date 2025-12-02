import express from "express";
import PaymentMethod from "../models/PaymentMethod.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// __dirname সেটআপ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer সেটআপ লোগো আপলোডের জন্য (uploads/logos ফোল্ডারে সংরক্ষণ)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET: সকল পেমেন্ট মেথড ফেচ করা
router.get("/deposit/methods", async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});


// GET: স্পেসিফিক পেমেন্ট মেথড ফেচ
router.get("/deposit/payment-method/:id", async (req, res) => {
  try {
    const method = await PaymentMethod.findOne({ id: req.params.id });
    if (!method) {
      return res
        .status(404)
        .json({ message: `পেমেন্ট মেথড ${req.params.id} পাওয়া যায়নি 2` });
    }
    res.status(200).json(method);
  } catch (error) {
    console.error(`Error fetching payment method ${req.params.id}:`, error);
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// POST: নতুন পেমেন্ট মেথড যোগ করা
router.post("/deposit/method", async (req, res) => {
  try {
    const newMethod = new PaymentMethod(req.body);
    await newMethod.save();
    res.status(201).json({ message: "মেথড যোগ সফল", method: newMethod });
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// PUT: পেমেন্ট মেথড আপডেট করা
router.put("/deposit/method/:id", async (req, res) => {
  try {
    const updatedMethod = await PaymentMethod.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedMethod) {
      return res.status(404).json({ message: "মেথড পাওয়া যায়নি" });
    }
    res.status(200).json({ message: "মেথড আপডেট সফল", method: updatedMethod });
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// DELETE: পেমেন্ট মেথড ডিলিট করা
router.delete("/deposit/method/:id", async (req, res) => {
  try {
    const deletedMethod = await PaymentMethod.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedMethod) {
      return res.status(404).json({ message: "মেথড পাওয়া যায়নি" });
    }
    res.status(200).json({ message: "মেথড ডিলিট সফল" });
  } catch (error) {
    res.status(500).json({ message: "সার্ভার এরর", error: error.message });
  }
});

// POST: লোগো আপলোড
router.post("/upload/logo", upload.single("logo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "কোনো লোগো আপলোড করা হয়নি" });
    }
    const logoUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ logoUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "লোগো আপলোড ব্যর্থ", error: error.message });
  }
});

export default router;
