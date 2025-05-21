document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
        credentials: 'include'  // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const logoutMessage = document.getElementById('logoutMessage');
            logoutMessage.textContent = data.message;
            logoutMessage.style.display = 'block';
            
            // Redirect to login page or home page after a delay
            setTimeout(() => {
                window.location.href = '/login';  // Change this URL as needed
            }, 2000);  // Redirect after 2 seconds
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
});