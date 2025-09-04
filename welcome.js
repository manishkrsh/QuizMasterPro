// DOM elements
const startQuizBtn = document.getElementById('start-quiz-btn');
const difficultyButtons = document.querySelectorAll('.grid button');

// Selected difficulty
let selectedDifficulty = 'medium'; // Default to medium

// Initialize welcome page
function initWelcome() {
    // Set default difficulty selection
    difficultyButtons[1].classList.add('bg-[#38e07b]', 'text-[#111827]');
    difficultyButtons[1].classList.remove('text-gray-400');
    
    // Add click listeners to difficulty buttons
    difficultyButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove active state from all buttons
            difficultyButtons.forEach(btn => {
                btn.classList.remove('bg-[#38e07b]', 'text-[#111827]');
                btn.classList.add('text-gray-400');
            });
            
            // Add active state to clicked button
            button.classList.add('bg-[#38e07b]', 'text-[#111827]');
            button.classList.remove('text-gray-400');
            
            // Set selected difficulty
            const difficulties = ['easy', 'medium', 'hard'];
            selectedDifficulty = difficulties[index];
        });
    });
}

// Start quiz
function startQuiz() {
    // Store selected difficulty in localStorage
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
    
    // Clear any previous quiz results
    localStorage.removeItem('quizResults');
    
    // Navigate to quiz page
    window.location.href = 'quiz.html';
}

// Event listeners
startQuizBtn.addEventListener('click', startQuiz);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initWelcome);
