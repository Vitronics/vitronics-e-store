 // JavaScript code moved here to ensure it runs after DOM is loaded
 document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    } else {
        console.error('Hamburger or navLinks element not found.');
    }
});