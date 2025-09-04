// DOM elements
const finalScoreSpan = document.getElementById('final-score');
const accuracySpan = document.getElementById('accuracy');
const yourRankSpan = document.getElementById('your-rank');
const answersReviewContainer = document.getElementById('answers-review');
const restartBtn = document.getElementById('restart-btn');

// Load results
function loadResults() {
    const results = JSON.parse(localStorage.getItem('quizResults'));
    
    if (!results) {
        // No results found, redirect to home
        window.location.href = 'index.html';
        return;
    }
    
    const { score, totalQuestions, userAnswers, quizData } = results;
    const accuracy = Math.round((score / totalQuestions) * 100);
    
    // Update score display
    finalScoreSpan.textContent = `${score}/${totalQuestions}`;
    accuracySpan.textContent = `${accuracy}%`;
    yourRankSpan.textContent = `${score}/${totalQuestions}`;
    
    // Generate answers review
    generateAnswersReview(quizData, userAnswers);
}

// Generate answers review
function generateAnswersReview(quizData, userAnswers) {
    answersReviewContainer.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        const answerDiv = document.createElement('div');
        answerDiv.className = 'p-5 flex items-start gap-4';
        
        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = `flex-shrink-0 ${isCorrect ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} rounded-full p-2`;
        
        const icon = document.createElement('svg');
        icon.className = 'h-6 w-6';
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '1.5');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        if (isCorrect) {
            icon.innerHTML = '<path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"></path>';
        } else {
            icon.innerHTML = '<path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>';
        }
        
        iconDiv.appendChild(icon);
        
        // Question and answer info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex-1';
        
        const questionP = document.createElement('p');
        questionP.className = 'font-medium';
        questionP.textContent = `Question ${index + 1}: ${question.question}`;
        
        const userAnswerP = document.createElement('p');
        userAnswerP.className = 'text-sm text-gray-400 mt-1';
        
        if (userAnswer !== null && userAnswer !== undefined) {
            const userAnswerText = question.options[userAnswer];
            userAnswerP.innerHTML = `Your answer: <span class="font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400 line-through'}">${userAnswerText}</span>`;
        } else {
            userAnswerP.innerHTML = `Your answer: <span class="font-semibold text-gray-400">Skipped</span>`;
        }
        
        const correctAnswerP = document.createElement('p');
        correctAnswerP.className = 'text-sm text-gray-400 mt-1';
        correctAnswerP.innerHTML = `Correct answer: <span class="font-semibold text-green-400">${question.options[question.correct]}</span>`;
        
        infoDiv.appendChild(questionP);
        infoDiv.appendChild(userAnswerP);
        if (!isCorrect) {
            infoDiv.appendChild(correctAnswerP);
        }
        
        // Status
        const statusSpan = document.createElement('span');
        statusSpan.className = `text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`;
        statusSpan.textContent = isCorrect ? 'Correct' : 'Incorrect';
        
        answerDiv.appendChild(iconDiv);
        answerDiv.appendChild(infoDiv);
        answerDiv.appendChild(statusSpan);
        
        answersReviewContainer.appendChild(answerDiv);
    });
}

// Restart quiz
function restartQuiz() {
    // Clear stored results
    localStorage.removeItem('quizResults');
    
    // Redirect to quiz page
    window.location.href = 'quiz.html';
}

// Event listeners
restartBtn.addEventListener('click', restartQuiz);

// Load results when page loads
document.addEventListener('DOMContentLoaded', loadResults);
