const express = require("express");
const jwt = require("jsonwebtoken");
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
  if (!data.choices || !data.choices[0]) throw new Error("No response from Groq");
  return data.choices[0].message.content;
};

// Generate interview question
router.post("/question", protect, async (req, res) => {
  try {
    const { company, role, type, difficulty, previousQuestions } = req.body;
    const prev = previousQuestions && previousQuestions.length > 0
      ? `\nAvoid these questions: ${previousQuestions.join(", ")}`
      : "";
    const text = await groq([{
      role: "user",
      content: `You are a senior interviewer at ${company} interviewing for ${role}. Generate ONE ${type} interview question at ${difficulty} difficulty level.${prev}\nReturn ONLY valid JSON with no markdown: {"question":"the question here","type":"${type}","hints":["hint1","hint2"],"expectedTopics":["topic1","topic2","topic3"]}`
    }]);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (e) {
      console.error("JSON parse error:", text);
      res.status(500).json({ message: "Invalid AI response format" });
    }
  } catch (err) {
    console.error("Question error:", err.message);
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

// Score user answer
router.post("/score", protect, async (req, res) => {
  try {
    const { question, answer, type, company, role } = req.body;
    const text = await groq([{
      role: "user",
      content: `You are a senior interviewer at ${company} for ${role} role.\nQuestion: ${question}\nCandidate Answer: ${answer}\nQuestion Type: ${type}\n\nEvaluate and return ONLY valid JSON with no markdown:\n{"score":85,"grade":"B+","strengths":["strength1","strength2"],"improvements":["area1","area2"],"idealAnswer":"brief ideal answer in 2-3 sentences","feedback":"overall feedback in 2-3 sentences","passed":true}`
    }], 800);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (e) {
      console.error("JSON parse error:", text);
      res.status(500).json({ message: "Invalid AI response format" });
    }
  } catch (err) {
    console.error("Score error:", err.message);
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

// Resume analysis
router.post("/resume", protect, async (req, res) => {
  try {
    const { resume, company, role } = req.body;
    const text = await groq([{
      role: "user",
      content: `You are a senior recruiter at ${company} hiring for ${role}.\nAnalyze this resume and return ONLY valid JSON with no markdown:\nResume: ${resume}\n\n{"overallScore":75,"grade":"B","strengths":["s1","s2","s3"],"missingSkills":["skill1","skill2","skill3"],"missingExperiences":["exp1","exp2"],"suggestions":["suggestion1","suggestion2","suggestion3"],"atsScore":80,"keywordsMissing":["kw1","kw2","kw3"],"summary":"2-3 sentence overall assessment"}`
    }], 1200);
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (e) {
      console.error("JSON parse error:", text);
      res.status(500).json({ message: "Invalid AI response format" });
    }
  } catch (err) {
    console.error("Resume error:", err.message);
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

module.exports = router;
