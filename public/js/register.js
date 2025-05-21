document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
  
      // Simple validation
      if (!email || !username || !password) {
        authMsg.textContent = 'All fields are required.';
        authMsg.style.color = 'red';
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, username, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          authMsg.textContent = data.message;
          authMsg.style.color = 'green';
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({ email, username }));
          localStorage.setItem('isLoggedIn', 'true');
          setTimeout(() => {
            window.location.href = '/login.html';
          }, 1500);
        } else {
          authMsg.textContent = data.message || 'Registration failed.';
          authMsg.style.color = 'red';
        }
      } catch (err) {
        console.error('Error:', err);
        authMsg.textContent = 'An error occurred. Please try again later.';
        authMsg.style.color = 'red';
      }
    });
  });
  