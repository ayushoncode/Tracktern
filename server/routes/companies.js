const express = require("express");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const User = require("../models/User");
const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/stats", protect, async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.userId });
    const stats = {
      total: companies.filter(c => c.status !== "wishlist").length,
      wishlist: companies.filter(c => c.status === "wishlist").length,
      applied: companies.filter(c => c.status === "applied").length,
      shortlisted: companies.filter(c => c.status === "shortlisted").length,
      interview: companies.filter(c => c.status === "interview").length,
      offer: companies.filter(c => c.status === "offer").length,
      rejected: companies.filter(c => c.status === "rejected").length,
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { name, role, companyType, jobUrl, status, appliedDate, deadline, notes } = req.body;
    const company = await Company.create({
      userId: req.userId,
      name,
      role,
      companyType: ["startup", "product", "mnc"].includes(companyType) ? companyType : "product",
      jobUrl,
      status: status || "applied",
      appliedDate: appliedDate || Date.now(),
      deadline,
      notes,
    });
    const user = await User.findById(req.userId);
    const today = new Date().toDateString();
    const lastApplied = user.lastAppliedDate ? new Date(user.lastAppliedDate).toDateString() : null;
    if (lastApplied !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      user.streak = lastApplied === yesterday.toDateString() ? user.streak + 1 : 1;
      if (user.streak > user.longestStreak) user.longestStreak = user.streak;
      user.lastAppliedDate = new Date();
      await user.save();
    }
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, userId: req.userId });
    if (!company) return res.status(404).json({ message: "Company not found" });
    ["name","role","companyType","jobUrl","status","deadline","notes","followUpSent"].forEach(field => {
      if (req.body[field] !== undefined) company[field] = req.body[field];
    });
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
