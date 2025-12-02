import mongoose from "mongoose";

const withdrawalRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  methodId: { type: String, required: true },
  paymentType: { type: String, required: true },
  amount: { type: Number, required: true },
  pbuAmount: { type: Number, required: true },
  number: { type: String, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "cancelled"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WithdrawalRequest", withdrawalRequestSchema);