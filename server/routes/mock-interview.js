const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.userId = decoded.id; next(); }
  catch { res.status(401).json({ message: "Invalid token" }); }
};

const groq = async (messages, max_tokens = 1000) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, temperature: 0.7, max_tokens })
  });
  const data = await response.json();
  return data.choices[0].message.content;
};

router.post("/question", protect, async (req, res) => {
  try {
    const { company, role, type, difficulty, previousQuestions = [] } = req.body;
    const prev = previousQuestions.length > 0 ? `Avoid these questions: ${previousQuestions.join(", ")}` : "";
    const text = await groq([{ role: "user", content: `You are a senior interviewer at ${company} for ${role}. Generate ONE ${type} question at ${difficulty} difficulty. ${prev} Return ONLY valid JSON: {"question":"the question","type":"${type}","hints":["hint1","hint2"],"expectedTopics":["topic1","topic2"]}` }]);
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (err) { res.status(500).json({ message: "AI error", error: err.message }); }
});

router.post("/score", protect, async (req, res) => {
  try {
    const { question, answer, type, company, role } = req.body;
    const text = await groq([{ role: "user", content: `You are a senior interviewer at ${company} for ${role}. Question: ${question} Answer: ${answer} Type: ${type}. Return ONLY valid JSON: {"score":85,"grade":"B+","strengths":["s1","s2"],"improvements":["i1","i2"],"idealAnswer":"brief ideal answer","feedback":"overall feedback","passed":true}` }], 800);
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (err) { res.status(500).json({ message: "AI error", error: err.message }); }
});

router.post("/resume", protect, async (req, res) => {
  try {
    const { resume, company, role } = req.body;
    const text = await groq([{ role: "user", content: `You are a recruiter at ${company} hiring for ${role}. Resume: ${resume}. Return ONLY valid JSON: {"overallScore":75,"strengths":["s1","s2"],"missingSkills":["skill1","skill2"],"suggestions":["suggestion1","suggestion2"],"atsScore":80,"keywordsMissing":["kw1","kw2"],"summary":"2-3 sentence assessment"}` }], 1200);
    res.json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (err) { res.status(500).json({ message: "AI error", error: err.message }); }
});

module.exports = router;
