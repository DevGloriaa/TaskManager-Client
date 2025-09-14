document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "https://taskmanagerapi-1-142z.onrender.com";
  const registerForm = document.getElementById("registerForm");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");

const loader = document.getElementById('loader');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  loader.style.display = 'block'; 

  try {
    const response = await fetch('YOUR_API_URL', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
   
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
});

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

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();

    if (!username || !email || !password) {
      showMessage("All fields are required!", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        sessionStorage.setItem("emailForOTP", email);
        showMessage("Registration successful! Redirecting to OTP verification...", "success");

        setTimeout(() => {
          hideMessage();
          window.location.href = "verify-otp.html";
        }, 1500);
      } else {
        showMessage(data.message || "Registration failed.", "error");
        setTimeout(hideMessage, 3000);
      }
    } catch (err) {
      console.error("Registration fetch error:", err);
      showMessage("Network error. Check console for details.", "error");
      setTimeout(hideMessage, 3000);
    }
  });
});
