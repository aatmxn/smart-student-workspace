require("dotenv").config({ path: 'c:/Users/admin/Desktop/work/smart student-workspace/backend/.env' });
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

async function checkToken() {
    await mongoose.connect(process.env.MONGO_URI);

    // Login to get token
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "apitest@example.com", password: "password123" })
    });
    const { token } = await loginRes.json();
    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.userId);
    console.log("User found by ID:", user != null);

    if (user) {
        console.log("aiRequestCount:", user.aiRequestCount);
        console.log("aiLastRequestDate:", user.aiLastRequestDate);
    }

    process.exit();
}
checkToken();
