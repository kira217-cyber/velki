import mongoose from "mongoose";

const loginImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoginImage = mongoose.model("LoginImage", loginImageSchema);
export default LoginImage;