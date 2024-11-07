// Firebase Authentication State
auth.onAuthStateChanged(user => {
    console.log('Auth state changed:', user);
    if (user) {
        console.log('User logged in:', user);
        window.location.href = "election.html"; // Redirect to the election analysis page
    } else {
        console.log('No user logged in');
        document.getElementById('loginContainer').style.display = 'block';
    }
});

// Login Function
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        console.log('Login successful:', userCredential.user);
        window.location.href = "election.html"; // Redirect to the election analysis page
    }).catch(error => {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
    });
});
