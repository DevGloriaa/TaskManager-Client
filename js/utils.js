document.addEventListener("DOMContentLoaded", () => {
   fetch("https://taskmanagerapi-1-142z.onrender.com/tasks")
      .then(response => response.json())
      .then(data => {
         console.log("Tasks:", data);
         const list = document.getElementById("task-list");
         data.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.name;
            list.appendChild(li);
         });
      })
      .catch(error => console.error("Error fetching tasks:", error));
});
