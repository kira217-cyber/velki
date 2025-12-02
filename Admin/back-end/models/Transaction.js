// transactionModel.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  // Transaction details
  fromAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  fromAdminName: {
    type: String,
    required: true,
  },
  toAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  toAdminName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["D", "W"], // D = Deposit, W = Withdraw
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["depositUpline", "depositDownline", "withdrawUpline", "withdrawDownline"],
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    default: "Fund Transfer",
  },
  fromTo: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    default: "-",
  },
  // Date and time
  datetime: {
    type: Date,
    default: Date.now,
  },
  // Admin who made the transaction
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  performedByName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Index for better query performance
transactionSchema.index({ fromAdminId: 1, datetime: -1 });
transactionSchema.index({ toAdminId: 1, datetime: -1 });
transactionSchema.index({ datetime: -1 });

export default mongoose.model("Transaction", transactionSchema);