import mongoose from "mongoose";

const depositRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Changed ref to "Admin"
  paymentType: { type: String, required: true },
  selectedMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  pbuAmount: { type: Number, required: true },
  totalPBU: { type: Number, required: true },
  transactionId: { type: String, required: true },
  number: { type: String, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved", "cancelled"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DepositRequest", depositRequestSchema);