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
    const {
      company,
      role,
      days,
      tone,
      status,
      recruiterName,
      applicationSource,
      extraContext
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const safeDays = Number.isFinite(Number(days)) ? Number(days) : 7;
    const safeTone = typeof tone === "string" && tone.trim() ? tone.trim() : "Professional";
    const safeStatus = typeof status === "string" && status.trim() ? status.trim() : "Applied";
    const safeRecruiterName = typeof recruiterName === "string" ? recruiterName.trim() : "";
    const safeSource = typeof applicationSource === "string" ? applicationSource.trim() : "";
    const safeContext = typeof extraContext === "string" ? extraContext.trim() : "";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: `Write a concise follow-up email for this job application.

Company: ${company}
Role: ${role}
Current application status: ${safeStatus}
Days since the last update or application: ${safeDays}
Tone: ${safeTone}
Recruiter or hiring manager name: ${safeRecruiterName || "Not provided"}
Application source: ${safeSource || "Not provided"}
Extra context from candidate: ${safeContext || "None"}

RULES:
- Under 170 words
- Sound human, polite, and confident
- Match the requested tone
- Mention the elapsed time naturally
- If a recruiter name is provided, use it in the greeting
- Do not invent interviews, referrals, or prior conversations unless the context says so
- Return ONLY valid JSON with no markdown

{
  "subject": "short subject line",
  "email": "full email body"
}`
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      return res.status(500).json({ message: "AI error" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      parsed = {
        subject: `Follow-up on ${role} application at ${company}`,
        email: text.trim()
      };
    }

    res.json({
      subject: typeof parsed.subject === "string" && parsed.subject.trim()
        ? parsed.subject.trim()
        : `Follow-up on ${role} application at ${company}`,
      email: typeof parsed.email === "string" && parsed.email.trim()
        ? parsed.email.trim()
        : "Could not generate email body."
    });
  } catch (err) {
    res.status(500).json({ message: "AI error", error: err.message });
  }
});

module.exports = router;
