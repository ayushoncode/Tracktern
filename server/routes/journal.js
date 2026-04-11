const express = require("express");
const jwt = require("jsonwebtoken");
const Journal = require("../models/Journal");
const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.userId = decoded.id; next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

router.get("/", protect, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.post("/", protect, async (req, res) => {
  try {
    const { company, type, notes, questions } = req.body;
    const entry = await Journal.create({ userId: req.userId, company, type, notes, questions });
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
