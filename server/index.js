const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

const authRoutes = require("./routes/auth");
const companyRoutes = require("./routes/companies");

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/ai", require("./routes/ai"));

app.get("/", (req, res) => {
  res.json({ message: "Tracktern API is running 🚀" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5001, () => {
      console.log(`✅ Server running on port ${process.env.PORT || 5001}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
app.use("/api/journal", require("./routes/journal"));
