import { quizData } from './data.js';

const questionText = document.getElementById('question-text');
const choicesList = document.getElementById('choices-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

let currentQuestionIndex = 0;
const userAnswers = new Array(quizData.length).fill(null);

function loadQuestion(index) {
  const q = quizData[index];
  questionText.textContent = q.question;

  choicesList.innerHTML = '';
  ['a', 'b', 'c', 'd'].forEach(letter => {
    const li = document.createElement('li');
    li.innerHTML = `
      <label>
        <input type="radio" name="answer" value="${letter}" ${userAnswers[index] === letter ? 'checked' : ''} />
        ${letter.toUpperCase()}: ${q.choices[letter]}
      </label>
    `;
    choicesList.appendChild(li);
  });

  prevBtn.disabled = index === 0;
  nextBtn.style.display = index === quizData.length - 1 ? 'none' : 'inline-block';
  submitBtn.style.display = index === quizData.length - 1 ? 'inline-block' : 'none';
  resultDiv.textContent = '';
}

choicesList.addEventListener('change', (e) => {
  if (e.target.name === 'answer') {
    userAnswers[currentQuestionIndex] = e.target.value;
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion(currentQuestionIndex);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  }
});

submitBtn.addEventListener('click', () => {
  let score = 0;
  userAnswers.forEach((answer, i) => {
    if (answer === quizData[i].correct) score++;
  });
  resultDiv.textContent = `You scored ${score} out of ${quizData.length}`;
  
  // Disable submit button after submission
  submitBtn.disabled = true;
});

// Initialize the quiz
window.addEventListener('DOMContentLoaded', () => {
  loadQuestion(currentQuestionIndex);
});