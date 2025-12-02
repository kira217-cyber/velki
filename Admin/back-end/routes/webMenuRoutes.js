import express from "express";
import WebMenu from "../models/WebMenu.js";

const router = express.Router();

// ওয়েব মেনু সেটিংস ফেচ
router.get("/webmenu", async (req, res) => {
  try {
    const webMenu = await WebMenu.findOne();
    if (!webMenu) return res.json({});
    res.json({
      _id: webMenu._id,
      webMenuBgColor: webMenu.webMenuBgColor,
      webMenuTextColor: webMenu.webMenuTextColor,
      webMenuFontSize: webMenu.webMenuFontSize,
      webMenuHoverColor: webMenu.webMenuHoverColor,
      webMenuHoverTextColor: webMenu.webMenuHoverTextColor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ওয়েব মেনু সেটিংস আপডেট
router.post("/webmenu", async (req, res) => {
  try {
    const { webMenuBgColor, webMenuTextColor, webMenuFontSize, webMenuHoverColor, webMenuHoverTextColor } = req.body;
    const existingWebMenu = await WebMenu.findOne();

    if (existingWebMenu) {
      existingWebMenu.webMenuBgColor = webMenuBgColor || existingWebMenu.webMenuBgColor;
      existingWebMenu.webMenuTextColor = webMenuTextColor || existingWebMenu.webMenuTextColor;
      existingWebMenu.webMenuFontSize = webMenuFontSize || existingWebMenu.webMenuFontSize;
      existingWebMenu.webMenuHoverColor = webMenuHoverColor || existingWebMenu.webMenuHoverColor;
      existingWebMenu.webMenuHoverTextColor = webMenuHoverTextColor || existingWebMenu.webMenuHoverTextColor;
      const updatedWebMenu = await existingWebMenu.save();
      res.json({
        _id: updatedWebMenu._id,
        webMenuBgColor: updatedWebMenu.webMenuBgColor,
        webMenuTextColor: updatedWebMenu.webMenuTextColor,
        webMenuFontSize: updatedWebMenu.webMenuFontSize,
        webMenuHoverColor: updatedWebMenu.webMenuHoverColor,
        webMenuHoverTextColor: updatedWebMenu.webMenuHoverTextColor,
      });
    } else {
      const newWebMenu = new WebMenu({
        webMenuBgColor: webMenuBgColor || "#ffffff",
        webMenuTextColor: webMenuTextColor || "#000000",
        webMenuFontSize: webMenuFontSize || 16,
        webMenuHoverColor: webMenuHoverColor || "#cccccc",
        webMenuHoverTextColor: webMenuHoverTextColor || "#cccccc",
      });
      const savedWebMenu = await newWebMenu.save();
      res.status(201).json({
        _id: savedWebMenu._id,
        webMenuBgColor: savedWebMenu.webMenuBgColor,
        webMenuTextColor: savedWebMenu.webMenuTextColor,
        webMenuFontSize: savedWebMenu.webMenuFontSize,
        webMenuHoverColor: savedWebMenu.webMenuHoverColor,
        webMenuHoverTextColor: savedWebMenu.webMenuHoverTextColor,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;