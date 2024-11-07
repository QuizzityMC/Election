// Fetch and display questions from Firestore
db.collection("questions").get().then((querySnapshot) => {
    const questionsContainer = document.getElementById('questionsContainer');
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
});
