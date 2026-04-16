const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());

app.use(express.json());

const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companies");

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/ai", require("./routes/ai"));
app.use("/api/journal", require("./routes/journal"));
app.use("/api/mock-interview", require("./routes/mock-interview"));
app.use("/api/community", require("./routes/community"));


app.get("/", (req, res) => {
  res.json({ message: "Tracktern API is running 🚀" });
});

// ✅ ADD THIS
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
