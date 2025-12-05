// routes/callback.js
import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      account_id,
      username: rawUsername,
      provider_code,
      amount,
      game_code,
      verification_key,
      bet_type,
      transaction_id,
      times,
    } = req.body;

    console.log("Callback received ->", {
      account_id,
      rawUsername,
      provider_code,
      amount,
      bet_type,
    });

    // Required fields
    if (
      !rawUsername ||
      !provider_code ||
      amount === undefined ||
      !game_code ||
      !bet_type
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // শেষের সব সংখ্যা কেটে দাও → "user45" → "user"
    const cleanUsername = rawUsername.replace(/[0-9]+$/, "").trim();

    if (!cleanUsername) {
      return res.status(400).json({
        success: false,
        message: "Invalid username format",
      });
    }

    console.log("Searching user with username:", cleanUsername);

    // ডাটাবেসে খুঁজো
    const player = await Admin.findOne({ username: cleanUsername });

    if (!player) {
      console.log("User NOT found for:", cleanUsername);
      return res.status(404).json({
        success: false,
        message: "User not found",
        debug: { searched: cleanUsername, original: rawUsername },
      });
    }

    console.log("Player found:", player.username, "Balance:", player.balance);

    const amountFloat = parseFloat(amount);
    if (isNaN(amountFloat)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // ব্যালেন্স চেঞ্জ
    let balanceChange = 0;
    if (bet_type === "BET") {
      balanceChange = -amountFloat;
    } else if (bet_type === "SETTLE") {
      balanceChange = amountFloat;
    }

    const newBalance = (player.balance || 0) + balanceChange;

    // গেম হিস্ট্রি
    const gameRecord = {
      username: player.username,
      provider_code,
      game_code,
      bet_type,
      amount: amountFloat,
      transaction_id: transaction_id || null,
      verification_key: verification_key || null,
      times: times || null,
      status: balanceChange > 0 ? "won" : "lost",
      createdAt: new Date(),
    };

    // আপডেট
    const updatedPlayer = await Admin.findOneAndUpdate(
      { _id: player._id },
      {
        $set: { balance: newBalance },
        $push: { gameHistory: gameRecord },
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Callback processed successfully",
      data: {
        original_username: rawUsername,
        matched_username: player.username,
        new_balance: updatedPlayer.balance,
        change: balanceChange,
      },
    });
  } catch (error) {
    console.error("Callback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
