const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.userId = decoded.id; next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

router.post("/prep", protect, async (req, res) => {
  try {
    const { company, role } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `You are an expert interview coach. Generate interview prep for a ${role} role at ${company}. Return ONLY valid JSON, no markdown, no backticks:\n{"questions":["q1","q2","q3","q4","q5","q6","q7","q8","q9","q10"],"skills":[{"name":"skill1","priority":"high"},{"name":"skill2","priority":"medium"},{"name":"skill3","priority":"low"}],"prepPlan":[{"day":1,"title":"Day 1 title","tasks":["t1","t2","t3"]},{"day":2,"title":"Day 2 title","tasks":["t1","t2","t3"]},{"day":3,"title":"Day 3 title","tasks":["t1","t2","t3"]}]}` }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    const data = await response.json();
    const text = data.choices[0].message.content;
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (err) {
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

router.post("/followup", protect, async (req, res) => {
  try {
    const { company, role } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `Write a professional follow-up email for a ${role} internship application at ${company}. Under 150 words. Return only the email body, no subject line.` }],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    const data = await response.json();
    res.json({ email: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

module.exports = router;
