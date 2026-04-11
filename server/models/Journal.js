const mongoose = require("mongoose");
const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ["phone","technical","behavioral","onsite"], default: "technical" },
  notes: { type: String, default: "" },
  questions: { type: [String], default: [] },
  date: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model("Journal", journalSchema);
