import express from "express";
import WithdrawalRequest from "../models/WithdrawalRequest.js";
import Admin from "../models/Admin.js";

const router = express.Router();

// POST: উইথড্র রিকোয়েস্ট তৈরি
router.post("/withdraw/request", async (req, res) => {
  try {
    const newRequest = new WithdrawalRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "পেন্ডিং উইথড্র রিকোয়েস্ট তৈরি সফল" });
  } catch (error) {
    res.status(500).json({ message: "রিকোয়েস্ট তৈরি ব্যর্থ", error: error.message });
  }
});

// GET: পেন্ডিং উইথড্র রিকোয়েস্ট (অ্যাডমিন)
router.get("/withdraw/requests/pending", async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ status: "pending" }).populate("userId", "username email");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "পেন্ডিং রিকোয়েস্ট লোড ব্যর্থ", error: error.message });
  }
});

// PUT: রিকোয়েস্ট অ্যাপ্রুভ
router.put("/withdraw/request/:id/approve", async (req, res) => {
  try {
    const request = await WithdrawalRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "রিকোয়েস্ট পাওয়া যায়নি" });
    request.status = "approved";
    await request.save();

    // PBU ব্যালেন্স কাটা
    const user = await Admin.findById(request.userId);
    if (!user) return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });
    if (user.balance < request.pbuAmount) return res.status(400).json({ message: "অপর্যাপ্ত PBU ব্যালেন্স" });
    user.balance -= request.pbuAmount;
    await user.save();

    res.status(200).json({ message: "অ্যাপ্রুভ সফল! PBU কাটা হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: "অ্যাপ্রুভ ব্যর্থ", error: error.message });
  }
});

// PUT: রিকোয়েস্ট ক্যানসেল
router.put("/withdraw/request/:id/cancel", async (req, res) => {
  try {
    const request = await WithdrawalRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "রিকোয়েস্ট পাওয়া যায়নি" });
    request.status = "cancelled";
    await request.save();
    res.status(200).json({ message: "ক্যানসেল সফল" });
  } catch (error) {
    res.status(500).json({ message: "ক্যানসেল ব্যর্থ", error: error.message });
  }
});

// GET: ইউজারের উইথড্র হিস্ট্রি
router.get("/withdraw/history/user/:userId", async (req, res) => {
  try {
    const history = await WithdrawalRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "হিস্ট্রি লোড ব্যর্থ", error: error.message });
  }
});

// GET: সকল উইথড্র হিস্ট্রি (অ্যাডমিন)
router.get("/withdraw/history", async (req, res) => {
  try {
    const history = await WithdrawalRequest.find({ status: { $ne: "pending" } }).populate("userId", "username email").sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "হিস্ট্রি লোড ব্যর্থ", error: error.message });
  }
});

export default router;