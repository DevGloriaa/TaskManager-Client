document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://taskmanagerapi-1-142z.onrender.com";
  const token = sessionStorage.getItem("authToken");
  const taskList = document.getElementById("taskList");
  const taskStats = document.getElementById("taskStats");

  if (!token) window.location.href = "login.html";

  let editingTaskId = null;

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

      const taskContent = document.createElement("div");
      taskContent.className = "task-content";
      taskContent.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || ""}</p>
        <p><strong>Due:</strong> ${task.dueDate || "No date"}</p>
      `;
      card.appendChild(taskContent);

      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => openEditModal(task));
      card.appendChild(editBtn);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const checkboxLabel = document.createElement("label");
      checkboxLabel.innerHTML = `
        <input type="checkbox" class="complete-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
        Completed
      `;
      actions.appendChild(checkboxLabel);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.setAttribute("data-id", task.id);
      deleteBtn.innerHTML = "<span>Delete</span>";
      actions.appendChild(deleteBtn);

      card.appendChild(actions);
      taskList.appendChild(card);
    });

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

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const taskId = btn.getAttribute("data-id");
        try {
          const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          });
          if (res.ok) loadTasks();
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

  const modal = document.getElementById("taskModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const taskForm = document.getElementById("taskForm");

  openModal.onclick = () => {
    editingTaskId = null;
    taskForm.reset();
    modal.classList.add("show");
  };
  closeModal.onclick = () => modal.classList.remove("show");
  cancelBtn.onclick = () => modal.classList.remove("show");
  window.onclick = e => { if (e.target === modal) modal.classList.remove("show"); };

  function openEditModal(task) {
    editingTaskId = task.id;
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description || "";
    document.getElementById("priority").value = task.priority.toUpperCase();
    document.getElementById("dueDate").value = task.dueDate || "";
    modal.classList.add("show");
  }

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value
    };

    try {
      if (editingTaskId) {
        const res = await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) console.error("Error updating task");
      } else {
        const res = await fetch(`${API_BASE}/tasks/createtask`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) console.error("Error creating task");
      }
      modal.classList.remove("show");
      loadTasks();
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  loadTasks();
});
