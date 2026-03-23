// Load env variables
require("dotenv").config();

// Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Groq = require("groq-sdk");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const path = require("path");
const fs = require("fs");

// Disable mongoose buffering
mongoose.set("bufferCommands", false);

// App
const app = express();
app.use(cors());
app.use(express.json());

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Multer setup (image only)
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/pages", express.static(path.join(__dirname, "../frontend/pages")));

// Auth routes
app.use("/api/auth", require("./routes/auth"));

// Test route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});


//HELPER: COUNT SIGNIFICANT FIGURES

function countSignificantFigures(numStr) {
  numStr = numStr.trim();

  // Convert to number string safely
  if (!numStr.includes(".")) {
    return numStr.replace(/^0+/, "").length;
  }

  // Step 1: Remove leading zeros
  let cleaned = numStr.replace(/^0+/, "");

  // Step 2: Remove decimal point
  cleaned = cleaned.replace(".", "");

  // Step 3: Remove leading zeros again (important for cases like 0.002560)
  cleaned = cleaned.replace(/^0+/, "");

  return cleaned.length;
}


// AI CHAT (TEXT + IMAGE + HYBRID FIX)

app.post("/api/ai/chat", upload.single("image"), async (req, res) => {
  try {
    let userMessage = req.body?.message || "";

    // IMAGE → OCR
    if (req.file) {
      const imagePath = req.file.path;

      const result = await Tesseract.recognize(imagePath, "eng");
      const extractedText = result.data.text;

      fs.unlinkSync(imagePath);

      userMessage = userMessage + "\n" + extractedText;
    }

    if (!userMessage.trim()) {
      return res.status(400).json({ error: "Message or image required" });
    }

    // AI RESPONSE
    const history = req.body.history || [];

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an elite JEE (Joint Entrance Examination) tutor specializing in Physics, Chemistry, and Mathematics.

Your primary goal is to solve problems with COMPLETE accuracy and exam-level clarity.

-----------------------------------
CORE BEHAVIOR RULES
-----------------------------------
1. Always solve problems step-by-step.
2. Be concise but clear (avoid unnecessary theory).
3. Use proper formulas and highlight them clearly.
4. Maintain logical flow: Given → Formula → Calculation → Final Answer.
5. Double-check calculations before giving the final answer.

-----------------------------------
SUBJECT-SPECIFIC RULES
-----------------------------------

PHYSICS:
- Include units at every step.
- Use correct formulas and laws.
- Clearly mention direction/sign conventions.
- NEVER convert displacement to absolute value unless asked.

CHEMISTRY:
- Follow correct mole concept, units, and significant figures.
- Apply proper rules for significant figures:
  - Leading zeros are NOT significant
  - Trailing zeros after decimal ARE significant
  - Zeros between digits ARE significant

MATHEMATICS:
- Show all steps clearly.
- Avoid skipping steps in algebra/calculus.
- Simplify final answers properly.

-----------------------------------
IMAGE INPUT HANDLING
-----------------------------------
If the question is extracted from an image:
- First, rewrite the question cleanly.
- Correct OCR mistakes logically (e.g., t° → t², ms~ → m/s).
- Then solve it step-by-step.

-----------------------------------
MULTIPLE CHOICE QUESTIONS (MCQs)
-----------------------------------
- Solve fully before choosing an option.
- Compare final answer with options.
- Clearly mention the correct option.

-----------------------------------
ERROR PREVENTION RULES
-----------------------------------
- DO NOT assume missing data — infer carefully.
- If unsure, state assumptions clearly.
- NEVER give approximate answers unless required.
- ALWAYS verify final answer matches units and logic.

Rules for significant figures:
- Leading zeros (before first non-zero digit) are NEVER significant
- Zeros between non-zero digits are ALWAYS significant
- Trailing zeros are significant ONLY if a decimal point is present
- Convert to scientific notation if needed to count properly

COUNTING & VERIFICATION RULES:
- Always explicitly list items before counting
- Count them numerically step-by-step
- Ensure final answer matches the count exactly
- Re-check final answer before responding

- When counting (digits, terms, roots, etc.), ALWAYS explicitly list and count them step-by-step before giving final answer

-----------------------------------
OUTPUT FORMAT (STRICT)
-----------------------------------

## Given:
(rewrite the question briefly)

## Approach:
(what concept/formula is used)

## Solution:
(step-by-step working)

## Final Answer:
(highlight clearly, with units and correct sign)

-----------------------------------
STYLE
-----------------------------------
- Clean, structured, exam-ready answers
- No unnecessary long paragraphs
- Focus on scoring marks in JEE

IMPORTANT: FOLLOW ALL RULES RIGIDLY FOR EVERY PROBLEM. After solving, re-evaluate the final answer once before responding

- The final answer MUST match the derived result exactly
- If mismatch occurs, recompute before responding

- After obtaining the result, verify the count numerically before giving final answer
`
        },
        ...history.slice(-10),
        {
          role: "user",
          content: userMessage + "\n\nDouble-check your final answer before responding.",
        },
      ],
    });

    let finalReply = response.choices[0].message.content;

    
    //  HYBRID FIX: SIGNIFICANT FIGURES

    const isSigFig = userMessage.toLowerCase().includes("significant");

    if (isSigFig) {
    const numberMatch = userMessage.match(/\bin\s+([\d.]+)/i);

    if (numberMatch) {
      const correct = countSignificantFigures(numberMatch[1]);
      finalReply = finalReply + `\n\n---\n✅ **Verified Answer: ${correct} significant figures** (deterministic — trust this if the above differs)`;
    }
  }

    res.json({
      input: userMessage,
      reply: finalReply,
    });

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI failed" });
  }
});


// START SERVER

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();