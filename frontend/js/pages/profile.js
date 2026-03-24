(function() {
  const token = localStorage.getItem("token");
  if (!token) {
    history.replaceState(null, "", "/login.html");
    window.location.replace("/login.html");
  }
})();

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

fetch(`${BASE_URL}/api/auth/profile`, {
  headers: {
    Authorization: "Bearer " + token
  }
})
  .then(res => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "../login.html?expired=true";
      return;
    }
    return res.json();
  })
  .then(data => {
    if (!data || !data.user) {
      localStorage.removeItem("token");
      window.location.href = "../login.html";
      return;
    }

    document.getElementById("name").innerText = data.user.name;
    document.getElementById("email").innerText = data.user.email;
  })
  .catch(() => {
    localStorage.removeItem("token");
    window.location.href = "../login.html";
  });

// Back to dashboard
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  history.pushState(null, "", "/login.html");
  window.location.replace("/login.html");
});
