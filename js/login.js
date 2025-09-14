document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const API_BASE = "https://taskmanagerapi-1-142z.onrender.com";


  togglePasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordBtn.textContent = "Hide";
    } else {
      passwordInput.type = "password";
      togglePasswordBtn.textContent = "Show";
    }
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
    message.style.display = "block";
    setTimeout(() => message.classList.add("show"), 10);
  }

  function hideMessage() {
    message.classList.remove("show");
    setTimeout(() => { message.style.display = "none"; }, 500);
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showMessage("Both email and password are required.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Login failed" }));
        showMessage(errorData.error || "Login failed.", "error");
        setTimeout(hideMessage, 3000);
        return;
      }

      const data = await res.json();

      if (data.token) {
        sessionStorage.setItem("authToken", data.token);
        showMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
          hideMessage();
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        showMessage(data.error || "Login failed.", "error");
        setTimeout(hideMessage, 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessage("Network error. Check console for details.", "error");
      setTimeout(hideMessage, 3000);
    }
  });
});
