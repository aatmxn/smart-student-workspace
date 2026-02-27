const quotes = [
  `"Discipline is choosing between what you want now and what you want most." — Abraham Lincoln`,
  `"The man who moves a mountain begins by carrying away small stones." — Confucius`,
  `"Success is the sum of small efforts, repeated day-in and day-out." — Robert Collier`
];

document.addEventListener("DOMContentLoaded", () => {
  const quoteEl = document.getElementById("dailyQuote");
  if (quoteEl) {
    quoteEl.innerText = quotes[Math.floor(Math.random() * quotes.length)];
  }
});

// ===== AUTH CHECK =====
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
} else {

  // ===== FETCH USER PROFILE ONLY IF TOKEN EXISTS =====
  fetch("http://localhost:5000/api/auth/profile", {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "../login.html?expired=true";
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then(data => {
      if (!data || !data.user) {
        localStorage.removeItem("token");
        window.location.href = "../login.html";
        return;
      }

      // ✅ SET USER NAME IN SIDEBAR AND BANNER
      const sidebarName = document.getElementById("name");
      const bannerName = document.getElementById("welcomeName");

      if (sidebarName) sidebarName.innerText = data.user.name;
      if (bannerName) {
        // Get first name
        const firstName = data.user.name.split(" ")[0];
        bannerName.innerText = firstName;
      }
    })
    .catch(err => {
      console.warn(err.message);
    });
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
  });
}
