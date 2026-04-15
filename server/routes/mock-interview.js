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
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🏢 REAL COMPANY LIST
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

// 🤖 GROQ API
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
  if (!data.choices || !data.choices[0]) throw new Error("No response from AI");
  return data.choices[0].message.content;
};

// 🧠 QUESTION ROUTE
router.post("/question", protect, async (req, res) => {
  try {
    let { company, role, type, difficulty } = req.body;

    // 🔥 HARD VALIDATION
    if (!company || typeof company !== "string") {
      return res.status(400).json({ message: "Company is required" });
    }

    const inputCompany = company.trim().toLowerCase();

    if (inputCompany.length < 3) {
      return res.status(400).json({ message: "Invalid company name" });
    }

    // 🔥 STRICT MATCH
    const matchedCompany = COMPANIES.find(
      c => c.toLowerCase() === inputCompany
    );

    if (!matchedCompany) {
      console.log("❌ Blocked invalid company:", company);
      return res.status(400).json({
        message: "Invalid company. Please select from list."
      });
    }

    company = matchedCompany;

    // 🧠 COMPANY STYLE
    let companyHint = "";

    if (["google","meta"].includes(inputCompany)) {
      companyHint = "Focus on DSA, graphs, trees, optimization";
    } else if (inputCompany === "amazon") {
      companyHint = "Focus on arrays, strings, greedy";
    } else if (inputCompany === "microsoft") {
      companyHint = "Focus on DP, recursion";
    } else if (["tcs","infosys","wipro"].includes(inputCompany)) {
      companyHint = "Focus on easy-medium DSA";
    } else {
      companyHint = "Focus on standard coding interview questions";
    }

    let prompt = "";

    if (type === "OA") {
      prompt = `You are creating a REAL interview MCQ.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style:
${companyHint}

RULES:
- Real interview style
- EXACTLY 4 options
- No generic questions

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

Company Style:
${companyHint}

RULES:
- Real interview question
- Not generic

Return ONLY JSON:
{
  "question": "problem statement",
  "type": "${type}",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2"]
}`;
    }

    const text = await groq([{ role: "user", content: prompt }]);

    const cleaned = text
      .replace(/```json|```/g, "")
      .replace(/^[^{]*/, "")
      .replace(/[^}]*$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { question: cleaned, type };
    }

    // 🔥 fallback MCQ
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

    const text = await groq([{
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

    const cleaned = text
      .replace(/```json|```/g, "")
      .replace(/^[^{]*/, "")
      .replace(/[^}]*$/, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        score: 50,
        grade: "C",
        strengths: ["Attempted the question"],
        improvements: ["Could not evaluate"],
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

module.exports = router;