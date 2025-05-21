document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'  
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const logoutMessage = document.getElementById('logoutMessage');
            logoutMessage.textContent = data.message;
            logoutMessage.style.display = 'block';
            
            // Redirect to login page or home page after a delay
            setTimeout(() => {
                window.location.href = '/login';  
            }, 2000);  // Redirect after 2 seconds
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
    });
});