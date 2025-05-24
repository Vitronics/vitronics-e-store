// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('form');
//     const authMsg = document.getElementById('auth-msg');
//     const logoutBtn = document.getElementById('logout-btn');

//     // Check if already logged in (optional: you may use session instead of localStorage)
//     if (localStorage.getItem('isLoggedIn') === 'true') {
//         logoutBtn.style.display = 'block';
//         form.style.display = 'none';
//     }

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const email = document.getElementById('email').value.trim();
//         const password = document.getElementById('password').value.trim();

//         if (!email || !password) {
//             authMsg.textContent = 'Please enter both email and password.';
//             authMsg.style.color = 'red';
//             return;
//         }

//         try {
//             const response = await fetch('/api/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 authMsg.textContent = data.message;
//                 authMsg.style.color = 'green';

//                 // Save to localStorage
//                 localStorage.setItem('isLoggedIn', 'true');
//                 localStorage.setItem('user', JSON.stringify(data.user));

//                 logoutBtn.style.display = 'block';
//                 form.style.display = 'none';
//             } else {
//                 authMsg.textContent = data.message || 'Login failed.';
//                 authMsg.style.color = 'red';
//             }
//         } catch (err) {
//             console.error('Login error:', err);
//             authMsg.textContent = 'Something went wrong.';
//             authMsg.style.color = 'red';
//         }
//     });

//     // Logout logic
//     logoutBtn.addEventListener('click', () => {
//         localStorage.removeItem('isLoggedIn');
//         localStorage.removeItem('user');
//         logoutBtn.style.display = 'none';
//         form.style.display = 'block';
//         authMsg.textContent = 'Logged out successfully.';
//         authMsg.style.color = 'green';
//     });
// });


document.addEventListener('DOMContentLoaded', async () => {
    // Get all authentication elements
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
    
    // Desktop elements
    const loginLinkDesktop = document.getElementById('login-link-desktop');
    const logoutLinkDesktop = document.getElementById('logout-link-desktop');
    
    // Mobile elements
    const loginLinkMobile = document.getElementById('login-link-mobile');
    const logoutLinkMobile = document.getElementById('logout-link-mobile');

    // Check authentication status on page load
    await checkAuthStatus();

    // Login form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                showAuthMessage('Please enter both email and password.', 'red');
                return;
            }

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    credentials: 'include', // Important for cookies
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showAuthMessage(data.message, 'green');
                    await checkAuthStatus();
                    // Redirect after successful login
                    window.location.href = '/index.html';
                } else {
                    showAuthMessage(data.message || 'Login failed.', 'red');
                }
            } catch (err) {
                console.error('Login error:', err);
                showAuthMessage('Something went wrong.', 'red');
            }
        });
    }

    // Logout functionality for both desktop and mobile
    if (logoutLinkDesktop) {
        logoutLinkDesktop.addEventListener('click', handleLogout);
    }
    if (logoutLinkMobile) {
        logoutLinkMobile.addEventListener('click', handleLogout);
    }

    // Function to check authentication status
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/check-auth', {
                credentials: 'include' // Important for cookies
            });

            if (response.ok) {
                const data = await response.json();
                updateAuthUI(data.authenticated);
            }
        } catch (err) {
            console.error('Auth check error:', err);
        }
    }

    // Function to update UI based on authentication status
    function updateAuthUI(isAuthenticated) {
        // Desktop elements
        if (loginLinkDesktop) loginLinkDesktop.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutLinkDesktop) logoutLinkDesktop.style.display = isAuthenticated ? 'block' : 'none';
        
        // Mobile elements
        if (loginLinkMobile) loginLinkMobile.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutLinkMobile) logoutLinkMobile.style.display = isAuthenticated ? 'block' : 'none';
        
        // Form visibility (if on login page)
        if (form) form.style.display = isAuthenticated ? 'none' : 'block';
    }

    // Function to handle logout
    async function handleLogout(e) {
        e.preventDefault();
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                showAuthMessage('Logged out successfully.', 'green');
                await checkAuthStatus();
                // Redirect to home page after logout
                window.location.href = '/index.html';
            } else {
                showAuthMessage('Logout failed.', 'red');
            }
        } catch (err) {
            console.error('Logout error:', err);
            showAuthMessage('Something went wrong.', 'red');
        }
    }

    // Helper function to show authentication messages
    function showAuthMessage(message, color) {
        if (authMsg) {
            authMsg.textContent = message;
            authMsg.style.color = color;
        }
    }
});