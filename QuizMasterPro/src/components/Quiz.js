import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { difficulties } from '../data/quizData';
import { fetchOpenTdbQuestions } from '../utils/opentdb';

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [perQuestionTimeLeft, setPerQuestionTimeLeft] = useState([]);
  const [timedOut, setTimedOut] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Initialize quiz
  useEffect(() => {
    async function init() {
      try {
        const difficulty = localStorage.getItem('selectedDifficulty') || 'medium';
        setSelectedDifficulty(difficulty);
        const difficultyConfig = difficulties.find(d => d.id === difficulty);
        setTimeLeft(difficultyConfig.timeLimit);
        localStorage.removeItem('quizResults');
        setLoading(true);
        setError('');
        const fetched = await fetchOpenTdbQuestions(difficulty, 10);
        setQuestions(fetched);
        // Initialize per-question timers and timeout flags
        const defaultLimit = difficultyConfig.timeLimit;
        setPerQuestionTimeLeft(new Array(fetched.length).fill(defaultLimit));
        setTimedOut(new Array(fetched.length).fill(false));
      } catch (e) {
        setError(e.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!questions.length) return;
    if (timedOut[currentQuestion]) return; // already timed out, do not tick
    if (isAnswered) return; // answered, do not tick
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => {
        const nextVal = Math.max(prev - 1, 0);
        setPerQuestionTimeLeft(prevArr => {
          const updated = [...prevArr];
          updated[currentQuestion] = nextVal;
          return updated;
        });
        if (nextVal === 0) {
          setTimedOut(prevArr => {
            const updated = [...prevArr];
            updated[currentQuestion] = true;
            return updated;
          });
          // flash a toast when the timer hits zero
          setToastMessage("Time's up for this question. Please proceed to the next question.");
          setShowToast(true);
        }
        return nextVal;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [questions.length, currentQuestion, timeLeft, isAnswered, timedOut, questions]);

  // Load saved answer when question changes
  useEffect(() => {
    const savedAnswer = userAnswers[currentQuestion];
    setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : null);
    setIsAnswered(savedAnswer !== undefined);
    // Restore timer for this question
    const difficultyConfig = difficulties.find(d => d.id === selectedDifficulty) || { timeLimit: 30 };
    const restored = perQuestionTimeLeft[currentQuestion];
    const restoredTime = typeof restored === 'number' ? restored : difficultyConfig.timeLimit;
    setTimeLeft(restoredTime);
  }, [currentQuestion, userAnswers]);

  const totalQuestions = questions.length || 1;
  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    if (timedOut[currentQuestion]) {
      setToastMessage("Time's up for this question. Please proceed to the next question.");
      setShowToast(true);
      return;
    }
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    // Save answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
    
    // Update score if correct
    if (answerIndex === currentQuestionData.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    // Persist remaining time before navigating
    setPerQuestionTimeLeft(prevArr => {
      const updated = [...prevArr];
      updated[currentQuestion] = timeLeft;
      return updated;
    });
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const handleSkip = () => {
    // Save skipped answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = null;
    setUserAnswers(newAnswers);
    // Persist remaining time when skipping
    setPerQuestionTimeLeft(prevArr => {
      const updated = [...prevArr];
      updated[currentQuestion] = timeLeft;
      return updated;
    });
    
    handleNext();
  };

  const finishQuiz = () => {
    // Store results in localStorage
    const results = {
      score,
      totalQuestions,
      userAnswers,
      quizData: questions,
      selectedDifficulty
    };
    
    localStorage.setItem('quizResults', JSON.stringify(results));
    navigate('/results');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root" style={{fontFamily: '"Spline Sans", "Noto Sans", sans-serif'}}>
        <div className="flex h-full grow items-center justify-center text-gray-300">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root" style={{fontFamily: '"Spline Sans", "Noto Sans", sans-serif'}}>
        <div className="flex h-full grow flex-col items-center justify-center gap-4 text-center px-6">
          <p className="text-red-400 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#38e07b] px-6 py-3 font-bold text-[#111827]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return null;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root" style={{fontFamily: '"Spline Sans", "Noto Sans", sans-serif'}}>
      <div className="flex h-full grow flex-col">
        <header className="flex shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-gray-800 px-6 py-4">
          <div className="flex items-center gap-3 text-white">
            <div className="size-6 text-[#38e07b]">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5V7.5l-4.5 4.5 4.5 4.5zm2 0l4.5-4.5-4.5-4.5v9z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold">Quiz Time</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-300">
              Score: <span className="font-bold text-[#38e07b]">{score}</span>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA-aYzW6K1opI_aFoB9XIQRfk-I7x7e_xnJraVgrBK_p-TD_8mq2_p7H-GR-WLHEhNoPoYPtVQhj61Dn1UT59THI1JfwYeBTArnvginaJdIm3EKX6KkCMptQWdQFRrsl6cCQQGefMyBN4cWMOO9gJqOLsD-9j_C1j_Es-EAkDgpybPdgTRnapondrh-3rTI2z6eKRwdCfAGas-7lkfwGk3E_ISL1zpV8C8vhv5kd3LhEK2wy7MAR-4jOsPDmIlrCeA9pak9QSc3EEs")'}}></div>
          </div>
        </header>
        
        <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-400">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>
                    {timedOut[currentQuestion] ? "Time's up! Please proceed to the next question" : formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-[#38e07b] h-2.5 rounded-full transition-all duration-300" 
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
              <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-6">
                {currentQuestionData.question}
              </h3>
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-[#38e07b] bg-gray-700/50'
                        : 'border-gray-700 hover:border-[#38e07b]'
                    } ${(isAnswered || timedOut[currentQuestion]) ? 'cursor-default' : ''}`}
                    onClick={(e) => {
                      if (timedOut[currentQuestion]) {
                        e.preventDefault();
                        setToastMessage("Time's up for this question. Please proceed to the next question.");
                        setShowToast(true);
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name="quiz-option"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(index)}
                      className="h-5 w-5 shrink-0 appearance-none rounded-full border-2 border-gray-600 bg-transparent checked:border-[#38e07b] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38e07b] focus:ring-offset-gray-800"
                      disabled={isAnswered || timedOut[currentQuestion]}
                    />
                    <span className="text-base font-medium text-gray-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handleSkip}
                className="flex min-w-[120px] items-center justify-center rounded-full border-2 border-gray-600 py-3 px-6 text-base font-bold text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span>Skip</span>
                <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="flex min-w-[120px] items-center justify-center rounded-full bg-[#38e07b] py-3 px-6 text-base font-bold text-gray-900 transition-colors hover:bg-[#2fbc6a] focus:outline-none focus:ring-2 focus:ring-[#38e07b] focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span>{currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* Toast */}
      {showToast && (
        <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div className="max-w-xl w-full">
            <div className="rounded-lg bg-gray-900/95 border border-gray-700 text-gray-100 shadow-xl px-4 py-3 flex items-start gap-3">
              <div className="text-[#f59e0b] mt-0.5">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <div className="text-sm font-medium">{toastMessage}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
