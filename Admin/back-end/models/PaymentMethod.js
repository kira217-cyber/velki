import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // যেমন 'bkash'
  name: { type: String, required: true },
  logo: { type: String }, // ইমেজ URL
  companyName: { type: String },
  bgColor: { type: String, default: "#f7f8fc" },
  formBgColor: { type: String, default: "#e2136e" },
  transactionId: { type: String, required: true },
  transactionNumber: { type: String, required: true },
  transactionIdLabel: { type: String, default: "ট্রানজেকশন আইডি দিন" },
  transactionIdHint: { type: String, default: "দয়া করে আপনার ট্রানজেকশন আইডি দিন" },
  numberLabel: { type: String, default: "লেনদেন নম্বর লিখুন" },
  numberHint: { type: String, default: "দয়া করে আপনার লেনদেন নম্বর দিন" },
  submitButtonText: { type: String, default: "যাচাই করুন" },
  instructions: [
    {
      text: { type: String, required: true },
      isNumber: { type: Boolean, default: false },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    },
  ],
});

export default mongoose.model("PaymentMethod", paymentMethodSchema);