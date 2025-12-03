import mongoose from "mongoose";

const selectedGameSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    gameUuid: {
      type: String,
      required: true,
    },
    isHot: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("SelectedGame", selectedGameSchema);