const form = document.getElementById("verifyForm");
const message = document.getElementById("message");
const resendOtp = document.getElementById("resendOtp");


const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:8081"
  : "https://taskmanagerapi-1-142z.onrender.com";


const email = sessionStorage.getItem("emailForOTP");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!email) {
    message.style.color = "red";
    message.textContent = "Email not found. Please register again.";
    return;
  }

  const otp = document.getElementById("otp").value.trim();

  if (!otp) {
    message.style.color = "red";
    message.textContent = "Please enter the OTP.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent = data.message;
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      message.style.color = "red";
      message.textContent = data.message || "OTP verification failed";
    }
  } catch (error) {
    message.style.color = "red";
    message.textContent = "Error verifying OTP. Check console for details.";
    console.error(error);
  }
});

resendOtp.addEventListener("click", async () => {
  if (!email) {
    message.style.color = "red";
    message.textContent = "Email not found. Please register again.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.textContent = data.message || "OTP resent successfully!";
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Failed to resend OTP";
    }
  } catch (error) {
    message.style.color = "red";
    message.textContent = "Error resending OTP. Check console for details.";
    console.error(error);
  }
});
