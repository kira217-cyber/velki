import express from "express";
import DepositRequest from "../models/DepositRequest.js";
import Admin from "../models/Admin.js"; // Changed from User to Admin

const router = express.Router();

// POST: Create a deposit request
router.post("/deposit/request", async (req, res) => {
  try {
    const newRequest = new DepositRequest(req.body);
    await newRequest.save();
    res.status(201).json({ message: "পেন্ডিং রিকোয়েস্ট তৈরি সফল" });
  } catch (error) {
    res.status(500).json({ message: "রিকোয়েস্ট তৈরি ব্যর্থ", error: error.message });
  }
});

// GET: Fetch pending deposit requests
router.get("/deposit/requests/pending", async (req, res) => {
  try {
    const requests = await DepositRequest.find({ status: "pending" }).populate({
      path: "userId",
      select: "username firstName lastName email", // Include desired fields
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "পেন্ডিং রিকোয়েস্ট লোড ব্যর্থ", error: error.message });
  }
});

// PUT: Approve a deposit request
router.put("/deposit/request/:id/approve", async (req, res) => {
  try {
    const request = await DepositRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "রিকোয়েস্ট পাওয়া যায়নি" });
    request.status = "approved";
    await request.save();

    // Update user balance
    const admin = await Admin.findById(request.userId); // Changed from User to Admin
    if (!admin) return res.status(404).json({ message: "ইউজার পাওয়া যায়নি" });
    admin.balance += request.totalPBU;
    await admin.save();

    res.status(200).json({ message: "অ্যাপ্রুভ সফল! PBU যোগ হয়েছে" });
  } catch (error) {
    res.status(500).json({ message: "অ্যাপ্রুভ ব্যর্থ", error: error.message });
  }
});

// PUT: Cancel a deposit request
router.put("/deposit/request/:id/cancel", async (req, res) => {
  try {
    const request = await DepositRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "রিকোয়েস্ট পাওয়া যায়নি" });
    request.status = "cancelled";
    await request.save();
    res.status(200).json({ message: "ক্যানসেল সফল" });
  } catch (error) {
    res.status(500).json({ message: "ক্যানসেল ব্যর্থ", error: error.message });
  }
});

// GET: User deposit history
router.get("/deposit/history/user/:userId", async (req, res) => {
  try {
    const history = await DepositRequest.find({ userId: req.params.userId })
      .populate("userId", "username firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "হিস্ট্রি লোড ব্যর্থ", error: error.message });
  }
});

// ✅ সব ডিপোজিট হিস্ট্রি (pending বাদে)
router.get("/deposit/history", async (req, res) => {

  console.log("this is reposit calling ");
  


  try {
      const history = await DepositRequest.find({ status: { $ne: "pending" } }).populate("userId").sort({ createdAt: -1 });
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: "হিস্ট্রি লোড ব্যর্থ", error: error.message });
      console.log(res.status)
    }
});







export default router;