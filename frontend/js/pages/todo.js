const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span style="text-decoration:${task.done ? "line-through" : "none"}">
        ${task.text}
      </span>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// Initial load
renderTasks();
