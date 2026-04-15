const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 🔐 Auth middleware
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

// 🤖 Groq API
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

// 🧠 Question route
router.post("/question", protect, async (req, res) => {
  try {
    const { company, role, type, difficulty } = req.body;

    // 🔥 simple validation
    if (!company || company.length < 2) {
      return res.status(400).json({ message: "Invalid company name" });
    }

    let prompt = "";

    if (type === "OA") {
      prompt = `Generate ONE MCQ for ${company} ${role} at ${difficulty} difficulty.

Return ONLY JSON:
{
  "question": "text",
  "type": "OA",
  "options": ["A) opt1","B) opt2","C) opt3","D) opt4"],
  "correctAnswer": "A"
}`;
    } else {
      prompt = `Generate ONE ${type} interview question for ${company} ${role}.

Return ONLY JSON:
{
  "question": "text",
  "type": "${type}",
  "hints": ["hint1","hint2"]
}`;
    }

    const text = await groq([{ role: "user", content: prompt }]);
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { question: cleaned, type };
    }

    // 🔥 fallback for MCQ
    if (type === "OA" && !parsed.options) {
      parsed.options = [
        "A) True",
        "B) False",
        "C) Depends",
        "D) None"
      ];
      parsed.correctAnswer = "A";
    }

    res.json(parsed);

  } catch (err) {
    console.error("Question error:", err.message);
    res.status(500).json({ message: "Error" });
  }
});


// 📊 Score route (IMPORTANT FIX)
router.post("/score", protect, async (req, res) => {
  try {
    const { question, answer, type, company, role } = req.body;

    const text = await groq([{
      role: "user",
      content: `You are an interviewer at ${company}.

Question: ${question.question || question}
Candidate Answer: ${answer}

Return ONLY JSON:
{
  "score": 85,
  "grade": "B+",
  "feedback": "2-3 line feedback",
  "passed": true
}`
    }]);

    const cleaned = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleaned));

  } catch (err) {
    console.error("Score error:", err.message);
    res.status(500).json({ message: "Error scoring" });
  }
});

module.exports = router;