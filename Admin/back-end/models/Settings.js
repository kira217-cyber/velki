import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "",
  },
  faviconUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;