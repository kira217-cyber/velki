const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const usersApi = (usersCollection, bankingCollection) => {
  const router = express.Router();
  const jwtSecret = process.env.JWT_SECRET;

  // Middleware to validate JWT tokens
  const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization")?.replace("Bearer ", "");
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    try {
      const decoded = jwt.verify(authHeader, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };

  // Register a new user
  router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    try {
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        status: "activated",
        balance: 0,
      };

      const result = await usersCollection.insertOne(newUser);
      res.status(201).json({ message: "User registered successfully", result });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login a user and issue JWT
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("this is login ",username,password);
    

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      const user = await usersCollection.findOne({ username });

      console.log("this is user id -> ",user);
      

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, {
        expiresIn: "7d",
      });

      await usersCollection.updateOne({ username }, { $set: { lastLoginAt: new Date() } });
      res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get user profile (protected)
  router.get("/profile", authenticateToken, async (req, res) => {
    try {
      const user = await usersCollection.findOne(
        { _id: new ObjectId(req.user.userId) },
        { projection: { password: 0 } }
      );
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Get all users (excluding passwords)
  router.get("/", async (req, res) => {
    try {
      const result = await usersCollection
        .find({}, { projection: { password: 0 } })
        .toArray();
      res.status(200).json(result);
    } catch (error) {
      console.error("Fetch users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get user by ID
  router.get("/:id", async (req, res) => {
    try {
      const result = await usersCollection.findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );
      if (!result) return res.status(404).json({ error: "User not found" });
      res.status(200).json(result);
    } catch (error) {
      console.error("Fetch user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Update user remark
  router.put("/remark/:id", authenticateToken, async (req, res) => {
    const { remark } = req.body;
    if (!remark) return res.status(400).json({ error: "Remark is required" });

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { remark } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "Remark updated successfully", result });
    } catch (error) {
      console.error("Update remark error:", error);
      res.status(500).json({ error: "Failed to update remark" });
    }
  });

  // Update user balance
  router.put("/balance/:id", authenticateToken, async (req, res) => {
    const { type, amount, parentId } = req.body;
    if (!type || !amount || !parentId) {
      return res.status(400).json({ error: "Type, amount, and parentId are required" });
    }
    if (!["deposit", "withdrawal"].includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    if (amount <= 0) return res.status(400).json({ error: "Amount must be positive" });

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: "User not found" });

      const parent = await usersCollection.findOne({ _id: new ObjectId(parentId) });
      if (!parent) return res.status(404).json({ error: "Parent user not found" });

      const session = usersCollection.client.startSession();
      try {
        await session.withTransaction(async () => {
          await usersCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $inc: { balance: type === "deposit" ? amount : -amount } },
            { session }
          );
          await usersCollection.updateOne(
            { _id: new ObjectId(parentId) },
            { $inc: { balance: type === "deposit" ? -amount : amount } },
            { session }
          );
          await bankingCollection.insertOne(
            { userId: req.params.id, parentId, type, amount, createdAt: new Date() },
            { session }
          );
        });
        res.status(200).json({ message: "Balance updated successfully" });
      } finally {
        await session.endSession();
      }
    } catch (error) {
      console.error("Balance update error:", error);
      res.status(500).json({ error: "Failed to update balance" });
    }
  });

  // Update user profile
  router.put("/profile/:id", authenticateToken, async (req, res) => {
    const profileInfo = req.body;

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (profileInfo.password) {
        profileInfo.password = await bcrypt.hash(profileInfo.password, 10);
      } else {
        delete profileInfo.password;
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...profileInfo, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "Profile updated successfully", result });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Add mother admin balance
  router.put("/mother-admin-balance/:id", authenticateToken, async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: "Valid amount is required" });

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { balance: amount } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "Mother admin balance updated successfully", result });
    } catch (error) {
      console.error("Mother admin balance update error:", error);
      res.status(500).json({ error: "Failed to update mother admin balance" });
    }
  });

  // Update user active status
  router.put("/active-status/:id", authenticateToken, async (req, res) => {
    const { status } = req.body;
    if (!status || !["activated", "deactivated"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required" });
    }

    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status } }
      );
      if (result.matchedCount === 0) return res.status(404).json({ error: "User not found" });
      res.status(200).json({ message: "Status updated successfully", result });
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  return router;
};

module.exports = usersApi;