document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://taskmanagerapi-1-142z.onrender.com";
  const token = sessionStorage.getItem("authToken");
  const taskList = document.getElementById("taskList");
  const taskStats = document.getElementById("taskStats");

  if (!token) {
    window.location.href = "login.html";
  }

  async function loadTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks/gettasks`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        sessionStorage.removeItem("authToken");
        window.location.href = "login.html";
        return;
      }

      const tasks = await res.json();
      renderTasks(tasks);
      updateStats(tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    if (!tasks || tasks.length === 0) {
      taskList.innerHTML = "<p>No tasks yet. Create one!</p>";
      taskStats.textContent = "";
      return;
    }

    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = `task-card ${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}`;

      card.innerHTML = `
        <h3 class="${task.completed ? "completed-title" : ""}">${task.title}</h3>
        <p class="${task.completed ? "completed-text" : ""}">${task.description || ""}</p>
        <p><strong>Due:</strong> ${task.dueDate || "No date"}</p>
        <label>
          <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
          Completed
        </label>
        ${task.completed ? `<button class="delete-btn" data-id="${task.id}">Delete</button>` : ""}
      `;
      taskList.appendChild(card);
    });

    // Toggle completion
    document.querySelectorAll(".complete-checkbox").forEach(checkbox => {
      checkbox.addEventListener("change", async () => {
        const taskId = checkbox.getAttribute("data-id");
        try {
          await fetch(`${API_BASE}/tasks/${taskId}/toggle-complete`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          });
          loadTasks(); 
        } catch (err) {
          console.error("Error toggling task completion:", err);
        }
      });
    });

    // Delete completed task
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const taskId = btn.getAttribute("data-id");
        try {
          await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          });
          loadTasks();
        } catch (err) {
          console.error("Error deleting task:", err);
        }
      });
    });
  }

  function updateStats(tasks) {
    const completedCount = tasks.filter(t => t.completed).length;
    const remainingCount = tasks.length - completedCount;
    taskStats.textContent = `Tasks Completed: ${completedCount} | Tasks Remaining: ${remainingCount}`;
  }

  // Modal logic
  const modal = document.getElementById("taskModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");

  openModal.onclick = () => modal.classList.add("show");
  closeModal.onclick = () => modal.classList.remove("show");
  cancelBtn.onclick = () => modal.classList.remove("show");
  window.onclick = e => { if (e.target === modal) modal.classList.remove("show"); };

  // Create new task
  document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTask = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value
    };
    try {
      const res = await fetch(`${API_BASE}/tasks/createtask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTask)
      });
      if (res.status === 401) {
        sessionStorage.removeItem("authToken");
        window.location.href = "login.html";
        return;
      }
      if (res.ok) {
        modal.classList.remove("show");
        loadTasks();
      } else console.error("Error creating task");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  loadTasks();
});
