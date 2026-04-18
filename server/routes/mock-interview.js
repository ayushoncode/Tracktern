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

const ROLE_KEYWORDS = {
  "SDE Intern": ["javascript", "python", "java", "c++", "dsa", "sql", "git", "api"],
  "SDE": ["javascript", "python", "java", "c++", "dsa", "sql", "git", "system design"],
  "SDE 2": ["system design", "distributed systems", "sql", "api", "docker", "aws", "git", "leadership"],
  "Software Engineer": ["javascript", "python", "java", "sql", "git", "api", "debugging", "testing"],
  "Software Developer": ["javascript", "python", "java", "sql", "git", "api", "oop", "debugging"],
  "Frontend Engineer": ["javascript", "typescript", "react", "next.js", "css", "html", "ui", "api"],
  "Backend Engineer": ["node.js", "express", "python", "java", "sql", "mongodb", "api", "system design"],
  "Full Stack Developer": ["react", "next.js", "node.js", "express", "sql", "mongodb", "api", "git"],
  "Data Analyst": ["sql", "excel", "python", "power bi", "tableau", "statistics", "pandas", "visualization"],
  "Data Scientist": ["python", "machine learning", "statistics", "pandas", "numpy", "sql", "data visualization", "scikit-learn"],
  "ML Engineer": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "sql", "mlops", "docker"],
  "AI Engineer": ["python", "machine learning", "llm", "prompt engineering", "deep learning", "api", "vector database", "pytorch"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd", "linux", "terraform", "monitoring", "git"],
  "Cloud Engineer": ["aws", "azure", "gcp", "docker", "terraform", "linux", "networking", "ci/cd"],
  "Security Engineer": ["network security", "owasp", "linux", "python", "siem", "threat modeling", "cryptography", "api security"],
  "Product Manager": ["product sense", "analytics", "sql", "roadmap", "stakeholder management", "user research", "experiments", "communication"],
  "Associate Product Manager": ["product sense", "analytics", "communication", "roadmap", "stakeholder management", "user research", "sql", "experiments"],
  "QA Engineer": ["testing", "selenium", "automation", "bug tracking", "api testing", "postman", "java", "javascript"],
  "Test Engineer": ["testing", "automation", "selenium", "postman", "api testing", "java", "debugging", "qa"],
  "Android Developer": ["kotlin", "java", "android", "jetpack", "mvvm", "rest api", "firebase", "git"],
  "iOS Developer": ["swift", "ios", "xcode", "swiftui", "uikit", "rest api", "mvvm", "git"],
};

const COMPANY_KEYWORDS = {
  Google: ["algorithms", "scalability", "distributed systems", "leadership", "ownership"],
  Amazon: ["ownership", "leadership", "scalability", "metrics", "customer"],
  Microsoft: ["collaboration", "product thinking", "system design", "impact"],
  Meta: ["performance", "experimentation", "scale", "product"],
  Flipkart: ["e-commerce", "scale", "backend", "metrics"],
  Razorpay: ["payments", "backend", "api", "reliability"],
  "JPMorgan Chase": ["finance", "risk", "security", "compliance"],
};

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

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean).map((value) => value.trim()))).filter(Boolean);
}

function analyzeResumeHeuristics(resume, company, role) {
  const normalizedResume = resume.toLowerCase();
  const roleKeywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS["Software Engineer"];
  const companyKeywords = COMPANY_KEYWORDS[company] || [];
  const combinedKeywords = uniqueStrings([...roleKeywords, ...companyKeywords]);

  const matchedKeywords = combinedKeywords.filter((keyword) => normalizedResume.includes(keyword.toLowerCase()));
  const missingKeywords = combinedKeywords.filter((keyword) => !normalizedResume.includes(keyword.toLowerCase()));

  const projectMentions = (normalizedResume.match(/\b(project|internship|experience|built|developed|designed)\b/g) || []).length;
  const metricMentions = (resume.match(/\b\d+[%+xkK]?\b/g) || []).length;
  const sectionMentions = ["education", "experience", "project", "skills"].filter((section) =>
    normalizedResume.includes(section)
  ).length;
  const actionVerbs = (normalizedResume.match(/\b(built|developed|led|improved|optimized|implemented|designed|launched|created)\b/g) || []).length;
  const atsBase = 35
    + (matchedKeywords.length / Math.max(combinedKeywords.length, 1)) * 38
    + Math.min(metricMentions, 6) * 3
    + Math.min(sectionMentions, 4) * 2
    + Math.min(actionVerbs, 6) * 2;

  const overallBase = 30
    + (matchedKeywords.length / Math.max(combinedKeywords.length, 1)) * 32
    + Math.min(projectMentions, 5) * 4
    + Math.min(metricMentions, 6) * 3
    + Math.min(actionVerbs, 6) * 2;

  const strengths = [];
  if (matchedKeywords.length >= 4) strengths.push(`Strong role alignment through keywords like ${matchedKeywords.slice(0, 4).join(", ")}.`)
  if (metricMentions >= 2) strengths.push("Resume includes measurable impact, which improves recruiter trust and ATS relevance.")
  if (projectMentions >= 2) strengths.push("Projects and experience are visible enough to support interview follow-up questions.")
  if (actionVerbs >= 3) strengths.push("Bullet points use action-oriented language instead of passive descriptions.")

  const suggestions = [];
  if (metricMentions < 2) suggestions.push("Add more quantified outcomes such as percentages, user counts, latency improvements, or time saved.")
  if (projectMentions < 2) suggestions.push("Make at least 2 projects or internships more visible with clearer titles, tech stack, and impact.")
  if (missingKeywords.length > 0) suggestions.push(`Add role-relevant keywords naturally in projects or skills, starting with ${missingKeywords.slice(0, 3).join(", ")}.`)
  if (!normalizedResume.includes("github") && !normalizedResume.includes("portfolio")) suggestions.push("Add a GitHub or portfolio link to strengthen technical credibility.")

  const quickWins = [];
  if (missingKeywords[0]) quickWins.push(`Add "${missingKeywords[0]}" where it genuinely appears in your work.`)
  if (metricMentions < 2) quickWins.push("Rewrite one project bullet with a number-backed result.")
  if (!normalizedResume.includes("impact")) quickWins.push("Highlight outcomes, not only responsibilities.")

  return {
    atsScore: clampScore(atsBase),
    overallScore: clampScore(overallBase),
    matchedKeywords,
    missingKeywords,
    strengths,
    suggestions,
    quickWins,
  };
}

// 🧠 QUESTION ROUTE
router.post("/question", protect, async (req, res) => {
  try {
    let { company, role, type, round, difficulty, customTopic, resume, previousQuestions = [] } = req.body;
    const interviewRound = (round || type || "DSA").trim();

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
      companyHint = "high-bar, analytical, structured";
    } else if (inputCompany === "amazon") {
      companyHint = "customer-focused, practical, ownership-driven";
    } else if (inputCompany === "microsoft") {
      companyHint = "collaborative, product-aware, thoughtful";
    } else if (["tcs","infosys","wipro"].includes(inputCompany)) {
      companyHint = "clear fundamentals, practical interview style";
    } else {
      companyHint = "standard interview style";
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
      roleHint = "core engineering fundamentals";
    }

    let prompt = "";
    const trimmedResume = typeof resume === "string" ? resume.trim() : "";
    const previousQuestionText = Array.isArray(previousQuestions)
      ? previousQuestions
          .filter((question) => typeof question === "string" && question.trim())
          .slice(-5)
          .join("\n- ")
      : "";
    const previousQuestionRule = previousQuestionText
      ? `\nAVOID REPEATING THESE PREVIOUS QUESTIONS:\n- ${previousQuestionText}\n`
      : "";

    if (interviewRound === "OA") {
      prompt = `You are creating a REAL interview MCQ.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Real interview style
- EXACTLY 4 options
- No generic questions
- Avoid repeated problems
- Choose a different concept or scenario than earlier questions

Return ONLY JSON:
{
  "question": "text",
  "type": "OA",
  "options": ["A) ...","B) ...","C) ...","D) ..."],
  "correctAnswer": "A"
}`;
    } else if (interviewRound === "System Design") {
      prompt = `You are a senior System Design interviewer at ${company} hiring for ${role}.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Ask a realistic system design question
- Focus on architecture, scale, trade-offs, reliability, and APIs
- Do not ask DSA/coding-only questions
- Avoid generic textbook prompts
- If previous questions covered one system area, switch to a different product or scaling challenge

Return ONLY JSON:
{
  "question": "system design problem statement",
  "type": "System Design",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2","topic3"],
  "followUp": "natural follow-up question"
}`;
    } else if (interviewRound === "Behavioral") {
      prompt = `You are a senior Behavioral interviewer at ${company} hiring for ${role}.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Ask a realistic behavioral question
- Use STAR-style prompting
- Do not ask DSA or coding questions
- Keep it specific to the company and role
- Ask about a different situation or competency than earlier questions

Return ONLY JSON:
{
  "question": "behavioral question text",
  "type": "Behavioral",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2","topic3"],
  "followUp": "natural follow-up question"
}`;
    } else if (interviewRound === "HR") {
      prompt = `You are an HR interviewer at ${company} hiring for ${role}.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Ask a realistic HR round question
- Focus on motivation, culture fit, communication, compensation, and work style
- Do not ask DSA or coding questions
- Ask about a different HR theme than earlier questions

Return ONLY JSON:
{
  "question": "HR interview question text",
  "type": "HR",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2","topic3"],
  "followUp": "natural follow-up question"
}`;
    } else if (interviewRound === "Resume") {
      if (!trimmedResume) {
        return res.status(400).json({ message: "Resume text is required for the Resume round" });
      }

      prompt = `You are a resume interviewer at ${company} hiring for ${role}.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}
Candidate Resume:
${trimmedResume.slice(0, 5000)}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Ask a question based on the candidate's resume, projects, or experience
- The question must directly reference something present in the resume
- Tailor it to the target company and role
- Do not ask DSA or coding questions unless the resume clearly suggests it
- Keep the question practical and follow-up friendly
- Ask about a DIFFERENT project, internship, skill, achievement, or decision than prior questions
- If earlier questions focused on one project, switch to another part of the resume

Return ONLY JSON:
{
  "question": "resume review question text",
  "type": "Resume",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2","topic3"],
  "followUp": "natural follow-up question"
}`;
    } else if (interviewRound === "Custom") {
      prompt = `You are an interviewer at ${company} hiring for ${role}.

Custom Topic: ${customTopic || "general interview fundamentals"}
Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Ask one realistic question about the custom topic
- Do not default to DSA unless the custom topic is explicitly DSA
- Keep the question sharp and practical
- Choose a different angle than earlier questions on the same custom topic

Return ONLY JSON:
{
  "question": "custom interview question text",
  "type": "Custom",
  "hints": ["hint1","hint2"],
  "expectedTopics": ["topic1","topic2","topic3"],
  "followUp": "natural follow-up question"
}`;
    } else {
      prompt = `You are designing a REAL DSA interview question.

Company: ${company}
Role: ${role}
Difficulty: ${difficulty}

Company Style: ${companyHint}
Role Focus: ${roleHint}
${previousQuestionRule}

RULES:
- Real DSA / coding interview question
- Not generic
- Avoid repeated problems
- Focus on algorithms, data structures, complexity, and edge cases
- Use a different pattern or problem framing than earlier questions

Return ONLY JSON:
{
  "question": "problem statement",
  "type": "${interviewRound}",
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
      parsed = { question: cleaned, type: interviewRound };
    }

    // fallback MCQ
    if (interviewRound === "OA" && !parsed.options) {
      parsed.options = [
        "A) True",
        "B) False",
        "C) Depends",
        "D) None"
      ];
      parsed.correctAnswer = "A";
    }

    parsed.type = parsed.type || interviewRound;

    res.json(parsed);

  } catch (err) {
    console.error("Question error:", err.message);
    res.status(500).json({ message: "Error generating question" });
  }
});

// 📊 SCORE ROUTE
router.post("/score", protect, async (req, res) => {
  try {
    const { question, answer, company, role, round, type, transcript, timeUsed, hintsUsed } = req.body;
    const interviewRound = (round || type || question?.type || "DSA").trim();
    const penalty = hintsUsed ? "Deduct 5 points for hint usage." : "";
    const timeNote = timeUsed ? `Candidate used ${timeUsed} seconds.` : "";
    const answerText = typeof answer === "string" ? answer : "";
    const questionText = question?.question || question;

    const raw = await groq([{
      role: "user",
      content: `You are a strict interviewer at ${company}.

Question: ${questionText}
Round Type: ${interviewRound}
Candidate Answer: ${answerText}
${transcript ? `Speech Transcript: ${transcript}` : ""}
${timeNote} ${penalty}

RULES:
- Wrong → low score
- Random → very low score
- Correct → high score
- Adjust expectations to the interview round
- DSA answers should be judged on correctness, approach, complexity, and edge cases
- System Design answers should be judged on architecture, scalability, trade-offs, and clarity
- Behavioral/HR answers should be judged on structure, honesty, and relevance
- OA answers should be scored strictly by answer accuracy

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

// 📈 FINAL REPORT
router.post("/final-report", protect, async (req, res) => {
  try {
    const { rounds = [], company, role, totalTime } = req.body;
    const summary = rounds
      .map((r, i) => `Round ${i + 1} (${r.type || "Unknown"}): Score ${r.score}, Grade ${r.grade}`)
      .join("\n");

    const raw = await groq([{
      role: "user",
      content: `You are a hiring manager at ${company} for ${role}.

Here are interview results:
${summary}

Total time: ${totalTime || 0}s

Return ONLY valid JSON:
{
  "decision": "Strong Hire",
  "overallGrade": "B+",
  "avgScore": 78,
  "summary": "overall assessment",
  "topStrength": "biggest strength",
  "topWeakness": "biggest weakness",
  "hiringChance": 72,
  "nextSteps": ["step1","step2","step3"],
  "studyPlan": [
    {"week": 1, "focus": "topic", "tasks": ["task1","task2"]},
    {"week": 2, "focus": "topic", "tasks": ["task1","task2"]}
  ]
}`
    }], 1200);

    const cleaned = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Final report JSON fail:", raw);
      return res.status(500).json({ message: "Final report parsing failed" });
    }

    parsed.nextSteps = Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [];
    parsed.studyPlan = Array.isArray(parsed.studyPlan) ? parsed.studyPlan : [];

    res.json(parsed);
  } catch (err) {
    console.error("Final report error:", err.message);
    res.status(500).json({ message: "Error generating final report" });
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

    const heuristics = analyzeResumeHeuristics(resume.trim(), company.trim(), role.trim());

    const raw = await groq([{
      role: "user",
      content: `You are a senior recruiter at ${company.trim()} hiring for ${role.trim()}.

Analyze this resume critically:
${resume.trim()}

Return ONLY valid JSON:
{
  "strengths": ["s1", "s2", "s3"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "keywordsMissing": ["kw1", "kw2"],
  "summary": "2-3 sentence honest assessment",
  "experienceGap": "what experience is missing",
  "quickWins": ["easy fix 1", "easy fix 2"]
}

RULES:
- Do not return placeholder feedback
- Make the feedback depend on the actual resume content
- Do not invent skills or projects that are not present
- Be strict if the resume is generic
- Focus especially on ${role.trim()} alignment for ${company.trim()}`
    }], 1500);

    const cleaned = cleanJSON(raw);

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Resume JSON fail:", raw);
      return res.status(500).json({ message: "Resume analysis parsing failed" });
    }

    parsed.strengths = uniqueStrings(Array.isArray(parsed.strengths) ? parsed.strengths : []).slice(0, 4);
    parsed.missingSkills = uniqueStrings(Array.isArray(parsed.missingSkills) ? parsed.missingSkills : []);
    parsed.suggestions = uniqueStrings(Array.isArray(parsed.suggestions) ? parsed.suggestions : []).slice(0, 4);
    parsed.keywordsMissing = uniqueStrings(Array.isArray(parsed.keywordsMissing) ? parsed.keywordsMissing : []);
    parsed.summary = typeof parsed.summary === "string" ? parsed.summary : "Analysis complete.";
    parsed.quickWins = uniqueStrings(Array.isArray(parsed.quickWins) ? parsed.quickWins : []).slice(0, 3);

    const mergedMissingKeywords = uniqueStrings([
      ...parsed.keywordsMissing,
      ...heuristics.missingKeywords,
    ]).slice(0, 6);

    const mergedMissingSkills = uniqueStrings([
      ...parsed.missingSkills,
      ...heuristics.missingKeywords,
    ]).slice(0, 6);

    const mergedStrengths = uniqueStrings([
      ...parsed.strengths,
      ...heuristics.strengths,
    ]).slice(0, 5);

    const mergedSuggestions = uniqueStrings([
      ...parsed.suggestions,
      ...heuristics.suggestions,
    ]).slice(0, 5);

    const mergedQuickWins = uniqueStrings([
      ...parsed.quickWins,
      ...heuristics.quickWins,
    ]).slice(0, 4);

    res.json({
      overallScore: heuristics.overallScore,
      atsScore: heuristics.atsScore,
      summary: parsed.summary,
      strengths: mergedStrengths,
      missingSkills: mergedMissingSkills,
      suggestions: mergedSuggestions,
      keywordsMissing: mergedMissingKeywords,
      quickWins: mergedQuickWins,
      experienceGap: typeof parsed.experienceGap === "string" ? parsed.experienceGap : "",
    });
  } catch (err) {
    console.error("Resume error:", err.message);
    res.status(500).json({ message: "Error analyzing resume" });
  }
});

module.exports = router;
