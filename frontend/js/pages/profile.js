const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

fetch("http://localhost:5000/api/auth/profile", {
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
  window.location.href = "../login.html";
});
