const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const QuizResult = require("../models/QuizResult");

router.post("/", auth, async (req, res) => {
  try {
    const { subject, chapter, score, total, date } = req.body;

    if (!subject || !chapter || score == null || total == null) {
      return res.status(400).json({ message: "Missing required quiz fields" });
    }

    const result = await QuizResult.create({
      userId: req.user.userId,
      subject,
      chapter,
      score,
      total,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .lean();

    return res.json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/import", auth, async (req, res) => {
  try {
    const { results } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ message: "No results to import" });
    }

    const sanitized = results
      .filter(
        (item) =>
          item &&
          item.subject &&
          item.chapter &&
          item.score != null &&
          item.total != null
      )
      .map((item) => ({
        userId: req.user.userId,
        subject: item.subject,
        chapter: item.chapter,
        score: item.score,
        total: item.total,
        date: item.date ? new Date(item.date) : new Date(),
      }));

    if (sanitized.length === 0) {
      return res.status(400).json({ message: "No valid results to import" });
    }

    const inserted = await QuizResult.insertMany(sanitized, { ordered: false });
    return res.status(201).json({ importedCount: inserted.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
