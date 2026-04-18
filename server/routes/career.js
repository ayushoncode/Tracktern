const express = require("express");
const jwt = require("jsonwebtoken");

const CareerProfile = require("../models/CareerProfile");
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

const CAREER_PROMPT = ({ skills, interests, year }) => `You are a career guidance AI for Indian engineering students.
Based on these inputs: Skills: ${skills.join(", ")}, Interests: ${interests}, Year: ${year}
Return ONLY valid JSON (no markdown) in this exact format:
{
  careerPaths: [
    {
      title: string,
      matchScore: number,
      matchingSkills: string[],
      skillGaps: string[],
      roadmap: [
        { step: 1, action: string, duration: string },
        { step: 2, action: string, duration: string },
        { step: 3, action: string, duration: string }
      ],
      timeToReady: string,
      internshipKeywords: string[]
    }
  ]
}`;

function cleanStringArray(values, limit = 8) {
  if (!Array.isArray(values)) return [];

  return values
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) === index)
    .slice(0, limit);
}

function extractJson(rawText) {
  if (typeof rawText !== "string") {
    throw new Error("AI response was empty");
  }

  const trimmed = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("AI did not return valid JSON");
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function normalizeCareerPath(path) {
  const roadmap = Array.isArray(path?.roadmap)
    ? path.roadmap
        .map((step, index) => ({
          step: Number(step?.step) || index + 1,
          action: typeof step?.action === "string" ? step.action.trim() : "",
          duration: typeof step?.duration === "string" ? step.duration.trim() : "",
        }))
        .filter((step) => step.action && step.duration)
        .slice(0, 3)
    : [];

  return {
    title: typeof path?.title === "string" && path.title.trim() ? path.title.trim() : "Career Path",
    matchScore: Math.max(0, Math.min(100, Math.round(Number(path?.matchScore) || 0))),
    matchingSkills: cleanStringArray(path?.matchingSkills),
    skillGaps: cleanStringArray(path?.skillGaps),
    roadmap,
    timeToReady: typeof path?.timeToReady === "string" ? path.timeToReady.trim() : "",
    internshipKeywords: cleanStringArray(path?.internshipKeywords, 3),
  };
}

async function generateCareerPaths({ skills, interests, year }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: CAREER_PROMPT({ skills, interests, year }) }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini request failed");
  }

  const rawText = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part?.text || "")
    .join("")
    .trim();

  const parsed = extractJson(rawText);
  const careerPaths = Array.isArray(parsed?.careerPaths)
    ? parsed.careerPaths.map(normalizeCareerPath).filter((path) => path.title)
    : [];

  if (careerPaths.length === 0) {
    throw new Error("No career paths returned by AI");
  }

  return careerPaths.slice(0, 3);
}

router.get("/profile", protect, async (req, res) => {
  try {
    const [profile, user] = await Promise.all([
      CareerProfile.findOne({ userId: req.userId }),
      User.findById(req.userId).select("skills"),
    ]);

    if (!profile) {
      return res.json({
        userId: req.userId,
        skills: user?.skills || [],
        interests: "",
        year: "",
        savedPaths: [],
      });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/predict", protect, async (req, res) => {
  try {
    const skills = cleanStringArray(req.body.skills, 12);
    const interests = typeof req.body.interests === "string" ? req.body.interests.trim() : "";
    const year = typeof req.body.year === "string" ? req.body.year.trim() : "";

    if (skills.length === 0 || !interests || !year) {
      return res.status(400).json({ message: "Skills, interests, and year are required" });
    }

    const careerPaths = await generateCareerPaths({ skills, interests, year });

    const profile = await CareerProfile.findOneAndUpdate(
      { userId: req.userId },
      { $set: { skills, interests, year } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await User.findByIdAndUpdate(req.userId, { $set: { skills } });

    res.json({
      careerPaths,
      profile: {
        skills: profile.skills,
        interests: profile.interests,
        year: profile.year,
        savedPaths: profile.savedPaths,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Career prediction failed", error: err.message });
  }
});

router.post("/track-path", protect, async (req, res) => {
  try {
    const path = normalizeCareerPath(req.body.path);
    const skills = cleanStringArray(req.body.skills, 12);
    const interests = typeof req.body.interests === "string" ? req.body.interests.trim() : "";
    const year = typeof req.body.year === "string" ? req.body.year.trim() : "";

    if (!path.title || path.internshipKeywords.length === 0) {
      return res.status(400).json({ message: "A valid career path with internship keywords is required" });
    }

    const profile = await CareerProfile.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          skills,
          interests,
          year,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const existingPathIndex = profile.savedPaths.findIndex(
      (savedPath) => savedPath.title.toLowerCase() === path.title.toLowerCase()
    );

    if (existingPathIndex >= 0) {
      profile.savedPaths[existingPathIndex] = {
        ...profile.savedPaths[existingPathIndex].toObject(),
        ...path,
        trackedAt: new Date(),
      };
    } else {
      profile.savedPaths.unshift({
        ...path,
        trackedAt: new Date(),
      });
    }

    profile.savedPaths = profile.savedPaths.slice(0, 10);
    await profile.save();

    const createdCards = [];

    for (const keyword of path.internshipKeywords) {
      const role = /intern/i.test(keyword) ? keyword : `${keyword} Intern`;
      const existingCompany = await Company.findOne({
        userId: req.userId,
        name: path.title,
        role,
        status: "wishlist",
      });

      if (existingCompany) {
        createdCards.push(existingCompany);
        continue;
      }

      const company = await Company.create({
        userId: req.userId,
        name: path.title,
        role,
        companyType: "product",
        status: "wishlist",
        notes: `AI Career Path Predictor suggestion for ${path.title}. Search keyword: ${keyword}. Time to ready: ${path.timeToReady}`,
      });

      createdCards.push(company);
    }

    res.status(201).json({
      message: "Career path tracked successfully",
      savedPath: path,
      createdCards,
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not track career path", error: err.message });
  }
});

module.exports = router;
