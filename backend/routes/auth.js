const bcrypt = require("bcryptjs");
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = { userId: user._id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, secret, options);
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", require("../middleware/authMiddleware"), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
