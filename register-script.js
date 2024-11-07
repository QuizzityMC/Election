document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log('Registration successful:', userCredential.user);
        alert('Registration successful! You can now log in.');
        window.location.href = "index.html"; // Redirect to login page after registration
    })
    .catch((error) => {
        console.error('Registration failed:', error.message);
        alert('Registration failed: ' + error.message);
    });
});
