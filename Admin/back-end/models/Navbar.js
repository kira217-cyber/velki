import mongoose from "mongoose";

const navbarSchema = new mongoose.Schema({
  bgColor: {
    type: String,
    default: "#ffffff",
  },
  textColor: {
    type: String,
    default: "#000000",
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Navbar = mongoose.model("Navbar", navbarSchema);
export default Navbar;