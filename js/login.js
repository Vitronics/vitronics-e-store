document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form')
    

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Continue?')
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const authMsg = document.getElementById('auth-msg');


        try{
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = response.data;

            if(!response.ok) {
                authMsg.textContent = "Invalid email or password!"
            } else {
                authMsg.textContent = "Login successfull"
                window.location.href = 'upload.html';
                
            }

        } catch (err) {
            authMsg.textContent = 'An error occured'
        }
    });

});

//This code handles redirect after login success.....
function handleLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform your login logic here
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'user' && password === 'pass') {
        // Redirect to the dashboard after successful login
        window.location.href = 'upload.html';
    } else {
        alert('Invalid credentials');
    }
}
