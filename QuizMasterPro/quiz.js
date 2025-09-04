

// Quiz state
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timeLeft = 30;
let timerInterval;
let quizData = [];
let selectedDifficulty = 'medium';

// DOM elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const currentScoreSpan = document.getElementById('current-score');
const timerSpan = document.getElementById('timer');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const prevBtn = document.getElementById('prev-btn');

function decodeHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.documentElement.textContent || '';
}

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getApiUrl(difficulty) {
    if (difficulty === 'easy') return 'https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple';
    if (difficulty === 'hard') return 'https://opentdb.com/api.php?amount=50&difficulty=hard&type=multiple';
    return 'https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple';
}

function getTimeLimit(difficulty) {
    if (difficulty === 'easy') return 45;
    if (difficulty === 'hard') return 15;
    return 30;
}

async function loadQuestions() {
    const url = getApiUrl(selectedDifficulty);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch questions');
    const data = await res.json();
    if (!data || !Array.isArray(data.results)) throw new Error('Malformed response');

    const transformed = data.results.map((q, idx) => {
        const correct = decodeHtml(q.correct_answer);
        const incorrect = (q.incorrect_answers || []).map(decodeHtml);
        const options = shuffleArray([correct, ...incorrect]);
        const correctIndex = options.findIndex(o => o === correct);
        return {
            id: idx + 1,
            question: decodeHtml(q.question),
            options,
            correct: correctIndex
        };
    });

    quizData = shuffleArray(transformed).slice(0, 10);
}

// Initialize quiz
async function initQuiz() {
    try {
        selectedDifficulty = localStorage.getItem('selectedDifficulty') || 'medium';
        timeLeft = getTimeLimit(selectedDifficulty);

        // Show loading state
        if (questionText) questionText.textContent = 'Loading questions...';
        if (optionsContainer) optionsContainer.innerHTML = '';

        await loadQuestions();

        totalQuestionsSpan.textContent = quizData.length;
        loadQuestion();
        startTimer();
    } catch (e) {
        if (questionText) questionText.textContent = 'Error loading questions';
        if (optionsContainer) optionsContainer.innerHTML = `<p class="text-red-400">${e.message || 'Please retry.'}</p>`;
    }
}

// Load current question
function loadQuestion() {
    const question = quizData[currentQuestion];
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    // Update progress bar
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressBar.style.width = progress + '%';
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'flex items-center gap-4 rounded-lg border-2 border-gray-700 p-4 cursor-pointer transition-all duration-200 hover:border-[#38e07b] has-[:checked]:border-[#38e07b] has-[:checked]:bg-gray-700/50';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option';
        input.value = index;
        input.className = 'h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-gray-600 bg-transparent checked:border-[#38e07b] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38e07b] focus:ring-offset-gray-800';
        
        // Check prior state for this question
        const prior = userAnswers[currentQuestion];
        const wasAnswered = prior !== undefined && prior !== null;
        if (prior !== undefined) {
            input.checked = prior === index;
        }
        if (wasAnswered) {
            input.disabled = true;
            label.className += ' cursor-default';
        }

        // Record answer immediately on option selection and lock inputs
        input.addEventListener('change', () => {
            // Only record if not previously answered (non-null)
            if (userAnswers[currentQuestion] === undefined || userAnswers[currentQuestion] === null) {
                userAnswers[currentQuestion] = index;
                if (index === quizData[currentQuestion].correct) {
                    score++;
                    currentScoreSpan.textContent = score;
                }
                // lock all inputs for this question
                const inputs = optionsContainer.querySelectorAll('input[name="quiz-option"]');
                inputs.forEach((inp) => { inp.disabled = true; });
            }
        });
        
        const span = document.createElement('span');
        span.className = 'text-base font-medium text-gray-300';
        span.textContent = option;
        
        label.appendChild(input);
        label.appendChild(span);
        optionsContainer.appendChild(label);
    });
    
    // Update button label and prev state
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Finish' : 'Next';
    if (prevBtn) prevBtn.disabled = currentQuestion === 0;
    
    // Reset timer
    timeLeft = getTimeLimit(selectedDifficulty);
    updateTimer();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Handle time up
function handleTimeUp() {
    clearInterval(timerInterval);
    // Auto-skip to next question
    nextQuestion();
}

// Get selected answer
function getSelectedAnswer() {
    const selected = document.querySelector('input[name="quiz-option"]:checked');
    return selected ? parseInt(selected.value) : null;
}

// Save answer
function saveAnswer() {
    const selectedAnswer = getSelectedAnswer();
    // If already answered before, do not allow changing or double scoring
    if (userAnswers[currentQuestion] !== undefined && userAnswers[currentQuestion] !== null) {
        return;
    }
    if (selectedAnswer !== null) {
        userAnswers[currentQuestion] = selectedAnswer;
        
        // Check if answer is correct
        if (selectedAnswer === quizData[currentQuestion].correct) {
            score++;
            currentScoreSpan.textContent = score;
        }
    }
}

// Next question
function nextQuestion() {
    saveAnswer();
    
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        clearInterval(timerInterval);
        loadQuestion();
        startTimer();
    } else {
        // Quiz finished
        finishQuiz();
    }
}

// Skip question
function skipQuestion() {
    userAnswers[currentQuestion] = null;
    nextQuestion();
}

// Previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        clearInterval(timerInterval);
        currentQuestion--;
        loadQuestion();
        startTimer();
    }
}

// Finish quiz
function finishQuiz() {
    clearInterval(timerInterval);
    
    // Store results in localStorage
    const results = {
        score: score,
        totalQuestions: quizData.length,
        userAnswers: userAnswers,
        quizData: quizData
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    // Redirect to results page
    window.location.href = 'results.html';
}

// Event listeners
nextBtn.addEventListener('click', nextQuestion);
skipBtn.addEventListener('click', skipQuestion);
if (prevBtn) prevBtn.addEventListener('click', previousQuestion);

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', initQuiz);
