document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("authToken");
  const taskList = document.getElementById("taskList");

  if (!token) {
    window.location.href = "login.html";
  }

  async function loadTasks() {
    try {
      const res = await fetch("https://taskmanagerapi-1-142z.onrender.com/tasks/gettasks", {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }
      });
      if (res.status === 401) {
        sessionStorage.removeItem("authToken");
        window.location.href = "login.html";
        return;
      }
      const tasks = await res.json();
      renderTasks(tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }

  function renderTasks(tasks) {
    taskList.innerHTML = "";
    if (!tasks || tasks.length === 0) {
      taskList.innerHTML = "<p>No tasks yet. Create one!</p>";
      return;
    }
    tasks.forEach(task => {
      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || ""}</p>
        <p><strong>Due:</strong> ${task.dueDate || "No date"}</p>
        <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span>
        ${
          task.completed
            ? `<span class="completed-badge">Completed</span>`
            : `<button class="complete-btn" data-id="${task.id}">Mark as Completed</button>`
        }
      `;
      taskList.appendChild(card);
    });

    
    document.querySelectorAll(".complete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const taskId = btn.getAttribute("data-id");
        try {
          const res = await fetch(`https://taskmanagerapi-1-142z.onrender.com/tasks/${taskId}/complete`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            loadTasks();
          } else if (res.status === 403) {
            console.error("Forbidden: You can only complete your own tasks.");
          } else {
            console.error("Error completing task");
          }
        } catch (err) {
          console.error("Error:", err);
        }
      });
    });
  }

  const modal = document.getElementById("taskModal");
  const openModal = document.getElementById("openModal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");

  openModal.onclick = () => modal.classList.add("show");
  closeModal.onclick = () => modal.classList.remove("show");
  cancelBtn.onclick = () => modal.classList.remove("show");
  window.onclick = e => { if (e.target === modal) modal.classList.remove("show"); };

  document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTask = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value
    };
    try {
      const res = await fetch("https://taskmanagerapi-1-142z.onrender.com/tasks/createtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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
      } else {
        console.error("Error creating task");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("authToken");
    window.location.href = "login.html";
  });

  loadTasks();
});
