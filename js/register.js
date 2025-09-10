const registerForm = document.getElementById('registerForm');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePasswordBtn.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordBtn.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    togglePasswordBtn.textContent = 'Show';
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value.trim();

  if (!username || !email || !password) {
    alert('All fields are required!');
    return;
  }

  try {
    const res = await fetch('http://localhost:8081/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    console.log(data);

    if (res.ok && data.success) {
      sessionStorage.setItem('emailForOTP', email);
      window.location.href = 'verify-otp.html';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Registration failed. Check console for details.');
  }
});
