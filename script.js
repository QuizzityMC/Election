// Initialize Firestore and Auth after Firebase is initialized
const db = firebase.firestore();
const auth = firebase.auth();

// Firebase Authentication State
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in:', user);
        document.getElementById('loginContainer').style.display = 'none';
        fetchAndDisplayQuestions();
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
    }).catch(error => {
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
    });
});

function fetchAndDisplayQuestions() {
    db.collection("questions").get().then((querySnapshot) => {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = '';  // Clear previous questions
        querySnapshot.forEach((doc) => {
            const questionContainer = document.createElement('div');
            questionContainer.classList.add('question');
            questionContainer.innerHTML = `
                <p><strong>${doc.data().name} (${doc.data().residence})</strong></p>
                <p>${doc.data().question}</p>
                <div class="answers"></div>
                <form class="answerForm">
                    <label for="answer">Your Answer:</label>
                    <textarea name="answer" required></textarea>
                    <button type="submit">Submit Answer</button>
                </form>
            `;
            questionsContainer.appendChild(questionContainer);

            // Attach event listener to the answer form
            questionContainer.querySelector('.answerForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const answer = this.querySelector('textarea').value;
                const answersDiv = this.previousElementSibling; // The div where answers are displayed

                // Add answer to Firestore under the corresponding question
                db.collection("questions").doc(doc.id).collection("answers").add({
                    answer: answer
                }).then(() => {
                    // Display the new answer under the question
                    const answerContainer = document.createElement('div');
                    answerContainer.classList.add('answer');
                    answerContainer.textContent = answer;
                    answersDiv.appendChild(answerContainer);

                    // Reset the answer form
                    this.reset();
                }).catch((error) => {
                    console.error('Error adding answer:', error);
                    alert('Error adding answer: ' + error);
                });
            });

            // Fetch and display answers for this question
            db.collection("questions").doc(doc.id).collection("answers").get().then((answerSnapshot) => {
                answerSnapshot.forEach((answerDoc) => {
                    const answerContainer = document.createElement('div');
                    answerContainer.classList.add('answer');
                    answerContainer.textContent = answerDoc.data().answer;
                    questionContainer.querySelector('.answers').appendChild(answerContainer);
                });
            });
        });
    }).catch((error) => {
        console.error('Error fetching questions:', error);
    });
}
