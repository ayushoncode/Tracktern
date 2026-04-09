const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  jobUrl: { type: String, default: "" },
  status: { type: String, enum: ["applied","shortlisted","interview","offer","rejected"], default: "applied" },
  appliedDate: { type: Date, default: Date.now },
  deadline: { type: Date, default: null },
  notes: { type: String, default: "" },
  gmailDetected: { type: Boolean, default: false },
  followUpSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
