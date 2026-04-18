const mongoose = require("mongoose");

const roadmapStepSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    action: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const savedPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    matchingSkills: { type: [String], default: [] },
    skillGaps: { type: [String], default: [] },
    roadmap: { type: [roadmapStepSchema], default: [] },
    timeToReady: { type: String, default: "" },
    internshipKeywords: { type: [String], default: [] },
    trackedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const careerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    skills: { type: [String], default: [] },
    interests: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    savedPaths: { type: [savedPathSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerProfile", careerProfileSchema);
