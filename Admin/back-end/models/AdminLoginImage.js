import mongoose from "mongoose";

const adminLoginImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminLoginImage = mongoose.model("AdminLoginImage", adminLoginImageSchema);
export default AdminLoginImage;