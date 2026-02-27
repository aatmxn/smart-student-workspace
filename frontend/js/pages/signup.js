document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.innerText = data.message;
      return;
    }

    alert("Signup successful. Please login.");
    window.location.href = "../login.html";

  } catch {
    errorMsg.innerText = "Signup failed";
  }
});
