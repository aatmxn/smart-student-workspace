// ===== CLEAR URL PARAMS SAFELY =====
const errorMsg = document.getElementById("errorMsg");

// If session expired param exists, show message ONCE and clean URL
if (window.location.search.includes("expired=true")) {
  errorMsg.innerText = "Session expired. Please log in again.";

  // Remove ?expired=true from URL without reloading
  window.history.replaceState({}, document.title, "login.html");
}

// ===== LOGIN FORM =====
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  errorMsg.innerText = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.innerText = data.message || "Login failed";
      return;
    }

    // ✅ SAVE TOKEN
    localStorage.setItem("token", data.token);

    // ✅ GO TO DASHBOARD
    window.location.href = "pages/dashboard.html";

  } catch {
    errorMsg.innerText = "Server error. Try again.";
  }
});
