// Fetch and display questions from Firestore
db.collection("questions").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question');
        questionContainer.innerHTML = `<p><strong>${doc.data().name} (${doc.data().residence})</strong></p><p>${doc.data().question}</p>`;
        document.getElementById('questionsContainer').appendChild(questionContainer);
    });
});

// Add new question to Firestore
document.getElementById('questionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const residence = document.getElementById('residence').value;
    const question = document.getElementById('question').value;
    
    db.collection("questions").add({
        name: name,
        residence: residence,
        question: question
    }).then(() => {
        alert('New question added!');
        document.getElementById('questionForm').reset();
    }).catch((error) => {
        alert('Error adding question: ' + error);
    });
});
