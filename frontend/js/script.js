const params = new URLSearchParams(window.location.search);
if (params.get("expired")) {
  document.getElementById("errorMsg").innerText =
    "Session expired. Please log in again.";
}
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.innerText = "";

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        console.log("Login successful");

        localStorage.setItem("token", data.token);

        window.location.href = "dashboard.html";
      } else {
        errorMsg.innerText = data.message || "Login failed";
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      errorMsg.innerText = "Something went wrong. Try again.";
    });
});
