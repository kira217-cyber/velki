import express from "express";
import SelectedGame from "../models/SelectedGame.js";

const router = express.Router();

// GET All Selected Games
router.get("/", async (req, res) => {
  try {
    const selectedGames = await SelectedGame.find();
    res.json({ success: true, data: selectedGames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// NEW: GET Only Array of gameId only
router.get("/ids", async (req, res) => {
  try {
    const selectedGames = await SelectedGame.find({}, "gameId");
    const gameIds = selectedGames.map((game) => game.gameId.toString());

    res.json({
      success: true,
      count: gameIds.length,
      data: gameIds, // শুধু array of strings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Select Game
router.post("/", async (req, res) => {
  try {
    const { gameId, gameUuid } = req.body;
    const existing = await SelectedGame.findOne({ gameId });
    if (existing) return res.status(400).json({ message: "Already selected" });

    const newSelected = new SelectedGame({ gameId, gameUuid });
    await newSelected.save();
    res.status(201).json({ success: true, data: newSelected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Update Flags
router.put("/:id", async (req, res) => {
  try {
    const updated = await SelectedGame.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Deselect Game
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SelectedGame.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ success: true, message: "Deselected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;