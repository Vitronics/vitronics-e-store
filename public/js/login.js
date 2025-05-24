// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('form');
//     const authMsg = document.getElementById('auth-msg');
//     const loginLink = document.getElementById('login-link');

//     // Event listener for form submission
//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         try {
//             // Make a POST request to the login API
//             const response = await fetch('/api/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, password })
//             });

//             const data = await response.json();
//             console.log('Response data:', data); // Log to inspect the data structure

//             if (!response.ok || data.message !== 'Login successful') {
//                 // Display error message if login fails
//                 authMsg.textContent = "Invalid email or password!";
//                 authMsg.style.color = 'red';
//             } else {
//                 // Display success message and redirect
//                 authMsg.textContent = "Login successful, Redirecting Shortly...";
//                 authMsg.style.color = 'green';

//                 // Store login status and user data in localStorage
//                 localStorage.setItem('isLoggedIn', 'true');
//                 localStorage.setItem('user_id', data.user_id);
//                 localStorage.setItem('user', JSON.stringify(data.user));

//                 // Hide login link
//                 if (loginLink) {
//                     loginLink.style.display = 'none';
//                 }

//                 // Redirect to the homepage after a short delay
//                 setTimeout(() => {
//                     window.location.href = 'index.html';
//                 }, 2500);
//             }
//         } catch (err) {
//             // Display error message if there's an issue with the request
//             console.error('Error during fetch:', err); // Log error for debugging
//             authMsg.textContent = 'An error occurred';
//             authMsg.style.color = 'red';
//         }
//     });

//     // Function to check if the user is logged in
//     function checkLoginStatus() {
//         if (localStorage.getItem('isLoggedIn') === 'true') {
//             // Hide login link if user is already logged in
//             if (loginLink) {
//                 loginLink.style.display = 'none';
//             }
//         }
//     }

//     // Check login status on page load
//     checkLoginStatus();
// });



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if already logged in (optional: you may use session instead of localStorage)
    if (localStorage.getItem('isLoggedIn') === 'true') {
        logoutBtn.style.display = 'block';
        form.style.display = 'none';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            authMsg.textContent = 'Please enter both email and password.';
            authMsg.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                authMsg.textContent = data.message;
                authMsg.style.color = 'green';

                // Save to localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(data.user));

                logoutBtn.style.display = 'block';
                form.style.display = 'none';
            } else {
                authMsg.textContent = data.message || 'Login failed.';
                authMsg.style.color = 'red';
            }
        } catch (err) {
            console.error('Login error:', err);
            authMsg.textContent = 'Something went wrong.';
            authMsg.style.color = 'red';
        }
    });

    // Logout logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        logoutBtn.style.display = 'none';
        form.style.display = 'block';
        authMsg.textContent = 'Logged out successfully.';
        authMsg.style.color = 'green';
    });
});
