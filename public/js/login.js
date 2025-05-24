

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Get login/logout links
    const loginLinkDesktop = document.getElementById('login-link-desktop');
    const logoutLinkDesktop = document.getElementById('logout-link-desktop');
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
                    showAuthMessage('Login successful! Redirecting...', 'green');
                    await checkAuthStatus();
                    // Redirect to dashboard or home page after successful login
                    setTimeout(() => window.location.href = '/shop-grid.html', 1500);
                } else {
                    showAuthMessage(data.message || 'Login failed.', 'red');
                }
            } catch (err) {
                console.error('Login error:', err);
                showAuthMessage('Connection error. Please try again.', 'red');
            }
        });
    }

    // Setup logout handlers for all logout elements
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (logoutLinkDesktop) logoutLinkDesktop.addEventListener('click', handleLogout);
    if (logoutLinkMobile) logoutLinkMobile.addEventListener('click', handleLogout);

    // Check authentication status
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/check-auth', {
                credentials: 'include' // Important for cookies
            });

            if (response.ok) {
                const data = await response.json();
                updateAuthUI(data.authenticated);
                
                // If on login page and already logged in, redirect
                if (window.location.pathname.includes('login.html') && data.authenticated) {
                    window.location.href = '/shop-grid.html';
                }
            }
        } catch (err) {
            console.error('Auth check error:', err);
        }
    }

    // Handle logout
    async function handleLogout(e) {
        if (e) e.preventDefault();
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                showAuthMessage('Logged out successfully. Redirecting...', 'green');
                updateAuthUI(false);
                // Redirect to home page after logout
                setTimeout(() => window.location.href = '/index.html', 1000);
            } else {
                showAuthMessage('Logout failed', 'red');
            }
        } catch (err) {
            console.error('Logout error:', err);
            showAuthMessage('Connection error during logout', 'red');
        }
    }

    // Update UI based on auth status
    function updateAuthUI(isAuthenticated) {
        // Form visibility (if on login page)
        if (form) form.style.display = isAuthenticated ? 'none' : 'block';
        
        // Logout button visibility
        if (logoutBtn) logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
        
        // Desktop links
        if (loginLinkDesktop) loginLinkDesktop.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutLinkDesktop) logoutLinkDesktop.style.display = isAuthenticated ? 'block' : 'none';
        
        // Mobile links
        if (loginLinkMobile) loginLinkMobile.style.display = isAuthenticated ? 'none' : 'block';
        if (logoutLinkMobile) logoutLinkMobile.style.display = isAuthenticated ? 'block' : 'none';
    }

    // Show status messages
    function showAuthMessage(message, type) {
        if (!authMsg) return;
        
        authMsg.textContent = message;
        authMsg.style.color = type === 'error' ? 'red' : 'green';
        
        // Clear message after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                authMsg.textContent = '';
            }, 5000);
        }
    }
});