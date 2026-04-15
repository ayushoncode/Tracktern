const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// 🔐 AUTH
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🏢 COMPANIES
const COMPANIES = [
  "Google","Amazon","Microsoft","Meta","Apple","Netflix",
  "Uber","Airbnb","Stripe","Dropbox","Twitter","LinkedIn","Spotify",
  "Flipkart","Swiggy","Zomato","Paytm","Razorpay","CRED","PhonePe",
  "Adobe","Oracle","SAP","Salesforce","ServiceNow","VMware","Atlassian",
  "Intel","NVIDIA","AMD","Qualcomm",
  "TCS","Infosys","Wipro","HCL","Accenture","Capgemini","Cognizant",
  "Goldman Sachs","Morgan Stanley","JPMorgan Chase","Visa","Mastercard",
  "Zoho","Freshworks","BrowserStack","Postman","InMobi"
];

// 🎯 ROLES
const ROLES = [
  "SDE Intern","SDE","SDE 2","Software Engineer","Software Developer",
  "Frontend Engineer","Backend Engineer","Full Stack Developer",
  "Data Analyst","Data Scientist","ML Engineer","AI Engineer",
  "DevOps Engineer","Cloud Engineer","Security Engineer",
  "Product Manager","Associate Product Manager",
  "QA Engineer","Test Engineer",
  "Android Developer","iOS Developer"
];

// 🤖 GROQ
const groq = async (messages, max_tokens = 1000) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.6,
      max_tokens
    })
  });

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) throw new Error("AI error");

  return data.choices[0].message.content;
};

// 🧹 CLEAN JSON
const cleanJSON = (text) => {
  return text
    .replace(/```json|```/g, "")
    .replace(/^[^{]*/, "")
    .replace(/[^}]*$/, "")
    .trim();
};

// 🧠 QUESTION ROUTE
router.post("/question", protect, async (req, res) => {
  try {
    let { company, role, type, difficulty } = req.body;

    // 🔥 COMPANY VALIDATION
    if (!company || typeof company !== "string") {
      return res.status(400).json({ message: "Company is required" });
    }

    const inputCompany = company.trim().toLowerCase();

    if (inputCompany.length < 3) {
      return res.status(400).json({ message: "Invalid company name" });
    }

    const matchedCompany = COMPANIES.find(
      c => c.toLowerCase() === inputCompany
    );

    if (!matchedCompany) {
      return res.status(400).json({
        message: "Invalid company. Please select from list."
      });
    }

    company = matchedCompany;

    // 🔥 SMART ROLE VALIDATION
    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "Role is required" });
    }

    let inputRole = role.trim().toLowerCase();

    // normalize
    inputRole = inputRole.replace(/engineer|developer|intern/g, "").trim();

    const ROLE_ALIASES = {
      frontend: "Frontend Engineer",
      front: "Frontend Engineer",

      backend: "Backend Engineer",
      back: "Backend Engineer",

      fullstack: "Full Stack Developer",
      full: "Full Stack Developer",

      data: "Data Analyst",
      analyst: "Data Analyst",

      ml: "ML Engineer",
      ai: "AI Engineer",

      devops: "DevOps Engineer",
      cloud: "Cloud Engineer",

      sde: "SDE",
      software: "Software Engineer",

      swe: "Software Engineer"
    };

    let matchedRole = ROLE_ALIASES[inputRole];

    if (!matchedRole) {
      matchedRole = ROLES.find(r =>
        r.toLowerCase().includes(inputRole)
      );
    }

    if (!matchedRole) {
      return res.status(400).json({
        message: "Invalid role. Please select a valid role."
      });
    }

    role = matchedRole;

    // 🧠 COMPANY STYLE
    let companyHint = "";

    if (["google","meta"].includes(inputCompany)) {
      companyHint = "DSA, graphs, trees, optimization";
    } else if (inputCompany === "amazon") {
      companyHint = "arrays, strings, greedy";
    } else if (inputCompany === "microsoft") {
      companyHint = "DP, recursion";
    } else if (["tcs","infosys","wipro"].includes(inputCompany)) {
      companyHint = "easy-medium DSA";
    } else {
      companyHint = "standard coding";
    }

    // 🧠 ROLE STYLE
    let roleHint = "";

    if (matchedRole.includes("Frontend")) {
      roleHint = "JavaScript, React, DOM";
    } else if (matchedRole.includes("Backend")) {
      roleHint = "APIs, databases, Node.js";
    } else if (matchedRole.includes("Full")) {
      roleHint = "frontend + backend";
    } else if (matchedRole.includes("Data")) {
      roleHint = "SQL, analytics";
    } else if (matchedRole.includes("ML") || matchedRole.includes("AI")) {
      roleHint = "ML models, probability";
    } else if (matchedRole.includes("DevOps")) {
      roleHint = "Docker, cloud, CI/CD";
    } else {
      roleHint = "DSA, algorithms";
    }

    let prompt = "";

    if (type === "OA") {
      prompt = `You are creating a REAL interview MCQ.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}

RULES:
- Real interview style
- EXACTLY 4 options
- No generic questions
- Avoid repeated problems

Return ONLY JSON:
{
  "question": "text",
  "type": "OA",
  "options": ["A) ...","B) ...","C) ...","D) ..."],
  "correctAnswer": "A"
}`;
    } else {
      prompt = `You are designing a REAL coding interview question.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}

RULES:
- Real interview question
- Not generic
- Avoid repeated problems

Return ONLY JSON:
{
  "question": "problem statement",
  "type": "${type}",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2"]
}`;
    }

    const raw = await groq([{ role: "user", content: prompt }]);
    const cleaned = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON FAIL:", raw);
      parsed = { question: cleaned, type };
    }

    // fallback MCQ
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
    res.status(500).json({ message: "Error generating question" });
  }
});

// 📊 SCORE ROUTE
router.post("/score", protect, async (req, res) => {
  try {
    const { question, answer, company } = req.body;

    const raw = await groq([{
      role: "user",
      content: `You are a strict interviewer at ${company}.

Question: ${question.question || question}
Candidate Answer: ${answer}

RULES:
- Wrong → low score
- Random → very low score
- Correct → high score

Return ONLY JSON:
{
  "score": number,
  "grade": "A/B/C/D/F",
  "strengths": ["point1","point2"],
  "improvements": ["point1","point2"],
  "idealAnswer": "2-3 line correct answer",
  "feedback": "2-3 line explanation",
  "passed": true/false
}`
    }]);

    const cleaned = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Score JSON fail:", raw);
      parsed = {
        score: 50,
        grade: "C",
        strengths: ["Attempted"],
        improvements: ["Improve accuracy"],
        idealAnswer: "N/A",
        feedback: "Fallback evaluation",
        passed: true
      };
    }

    parsed.strengths = parsed.strengths || ["Good attempt"];
    parsed.improvements = parsed.improvements || ["Improve accuracy"];
    parsed.idealAnswer = parsed.idealAnswer || "N/A";

    res.json(parsed);

  } catch (err) {
    console.error("Score error:", err.message);
    res.status(500).json({ message: "Error scoring" });
  }
});

// 📄 RESUME ROUTE
router.post("/resume", protect, async (req, res) => {
  try {
    const { resume, company, role } = req.body;

    if (!resume || typeof resume !== "string" || !resume.trim()) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    if (!company || typeof company !== "string" || !company.trim()) {
      return res.status(400).json({ message: "Company is required" });
    }

    if (!role || typeof role !== "string" || !role.trim()) {
      return res.status(400).json({ message: "Role is required" });
    }

    const raw = await groq([{
      role: "user",
      content: `You are a senior recruiter at ${company.trim()} hiring for ${role.trim()}.

Analyze this resume critically:
${resume.trim()}

Return ONLY valid JSON:
{
  "overallScore": 75,
  "strengths": ["s1", "s2", "s3"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "atsScore": 80,
  "keywordsMissing": ["kw1", "kw2"],
  "summary": "2-3 sentence honest assessment",
  "experienceGap": "what experience is missing",
  "quickWins": ["easy fix 1", "easy fix 2"]
}`
    }], 1500);

    const cleaned = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Resume JSON fail:", raw);
      return res.status(500).json({ message: "Resume analysis parsing failed" });
    }

    parsed.strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
    parsed.missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [];
    parsed.suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    parsed.keywordsMissing = Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : [];
    parsed.summary = typeof parsed.summary === "string" ? parsed.summary : "Analysis complete.";

    res.json(parsed);
  } catch (err) {
    console.error("Resume error:", err.message);
    res.status(500).json({ message: "Error analyzing resume" });
  }
});

module.exports = router;
