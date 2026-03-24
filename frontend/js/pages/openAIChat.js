(function() {
  const token = localStorage.getItem("token");
  if (!token) {
    history.replaceState(null, "", "/pages/login.html");
    window.location.replace("/pages/login.html");
  }
})();

// OPTIONAL: only if you are using same-page sections
function openAIChat() {
  document.getElementById("aiSection").style.display = "block";

  const dashboard = document.getElementById("dashboardSection");
  const task = document.getElementById("taskSection");

  if (dashboard) dashboard.style.display = "none";
  if (task) task.style.display = "none";
}


// =======================
// 💬 SEND MESSAGE FUNCTION
// =======================
async function sendMessage(event) {
  // Prevent page reload (IMPORTANT)
  if (event) event.preventDefault();

  const messageInput = document.getElementById("messageInput");
  const fileInput = document.getElementById("imageInput");
  const chatBox = document.getElementById("chatBox");

  const message = messageInput.value.trim();
  const file = fileInput.files[0];

  // Prevent empty send
  if (!message && !file) return;

  // Show user message
  if (message) {
    chatBox.innerHTML += `<div class="user-msg">You: ${message}</div>`;
  }

  // Show loading
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "ai-msg";
  loadingDiv.innerText = "Thinking...";
  chatBox.appendChild(loadingDiv);

  try {
    const formData = new FormData();
    formData.append("message", message);

    if (file) {
      formData.append("image", file);
    }

    const res = await fetch("${BASE_URL}/api/ai/chat", {
      method: "POST",
      body: formData,
    });

    // Handle non-JSON errors safely
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid response from server");
    }

    // Remove loading
    loadingDiv.remove();

    // Show AI response (with formatting)
    const aiDiv = document.createElement("div");
    aiDiv.className = "ai-msg";
    aiDiv.innerHTML = marked.parse(data.reply);
    chatBox.appendChild(aiDiv);

  } catch (err) {
    console.error("Frontend Error:", err);

    loadingDiv.remove();

    chatBox.innerHTML += `
      <div class="ai-msg">⚠️ Error: Could not get response</div>
    `;
  }

  // Auto scroll
  chatBox.scrollTop = chatBox.scrollHeight;

  // Clear inputs
  messageInput.value = "";
  const newFileInput = fileInput.cloneNode(true);
  fileInput.parentNode.replaceChild(newFileInput, fileInput);
}


// =======================
// ⌨️ ENTER TO SEND
// =======================
document.getElementById("messageInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage(e);
  }
});