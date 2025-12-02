import mongoose from "mongoose";

const depositSettingsSchema = new mongoose.Schema({
  pbu_rate: { type: Number, default: 100 },
  pbu_rate2: { type: Number, default: 100 },
  min_amount: { type: Number, default: 100 },
  max_amount: { type: Number, default: 25000 },
  payment_types: [{ type: String }],
  promotions: [
    {
      id: Number,
      title: String,
      type: String,
      start: String,
      end: String,
      bonusPercent: Number,
    },
  ],
  payment_methods: [
    {
      id: String,
      name: String,
      image: String,
    },
  ],
  currencies: [{ type: String }],
  currencies2: [{ type: String }],
});

export default mongoose.model("DepositSettings", depositSettingsSchema);