document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const authMsg = document.getElementById('auth-msg');
    const loginLink = document.getElementById('login-link');

    // Event listener for form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Make a POST request to the login API
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Response data:', data); // Log to inspect the data structure

            if (!response.ok || data.message !== 'Login successful') {
                // Display error message if login fails
                authMsg.textContent = "Invalid email or password!";
                authMsg.style.color = 'red';
            } else {
                // Display success message and redirect
                authMsg.textContent = "Login successful, Redirecting Shortly...";
                authMsg.style.color = 'green';

                // Store login status and user data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Hide login link
                if (loginLink) {
                    loginLink.style.display = 'none';
                }

                // Redirect to the homepage after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2500);
            }
        } catch (err) {
            // Display error message if there's an issue with the request
            console.error('Error during fetch:', err); // Log error for debugging
            authMsg.textContent = 'An error occurred';
            authMsg.style.color = 'red';
        }
    });

    // Function to check if the user is logged in
    function checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            // Hide login link if user is already logged in
            if (loginLink) {
                loginLink.style.display = 'none';
            }
        }
    }

    // Check login status on page load
    checkLoginStatus();
});
