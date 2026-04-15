const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Auth middleware
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

// Groq API
const groq = async (messages, max_tokens = 1000) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens
    })
  });

  const data = await response.json();
  if (!data.choices || !data.choices[0]) throw new Error("No response");

  return data.choices[0].message.content;
};

// Question route
router.post("/question", protect, async (req, res) => {
  try {
    const { company, role, type, difficulty } = req.body;

    let prompt = "";

    if (type === "OA") {
      prompt = `Generate ONE MCQ for ${company} ${role} at ${difficulty} difficulty.

Return JSON:
{
  "question": "text",
  "type": "OA",
  "options": ["A) opt1","B) opt2","C) opt3","D) opt4"],
  "correctAnswer": "A"
}`;
    } else {
      prompt = `Generate ONE ${type} interview question for ${company} ${role}.

Return JSON:
{
  "question": "text",
  "type": "${type}",
  "hints": ["hint1","hint2"]
}`;
    }

    const text = await groq([{ role: "user", content: prompt }]);
    const cleaned = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleaned));

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;