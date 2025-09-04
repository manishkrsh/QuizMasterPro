import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    if (!storedResults) {
      navigate('/');
      return;
    }
    setResults(JSON.parse(storedResults));
  }, [navigate]);

  const handleRestart = () => {
    localStorage.removeItem('quizResults');
    navigate('/');
  };

  if (!results) {
    return <div>Loading...</div>;
  }

  const { score, totalQuestions, userAnswers, quizData } = results;
  
  // Calculate accuracy based on attended questions (non-skipped)
  const attendedQuestions = userAnswers.filter(answer => answer !== null && answer !== undefined).length;
  const accuracy = attendedQuestions > 0 ? Math.round((score / attendedQuestions) * 100) : 0;

  const generateAnswersReview = () => {
    return quizData.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correct;
      
      return (
        <div key={index} className="p-5 flex items-start gap-4">
          <div className={`flex-shrink-0 ${isCorrect ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'} rounded-full p-2`}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isCorrect ? (
                <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round"></path>
              ) : (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
              )}
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">Question {index + 1}: {question.question}</p>
            <p className="text-sm text-gray-400 mt-1">
              {userAnswer !== null && userAnswer !== undefined ? (
                <>
                  Your answer: <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400 line-through'}`}>
                    {question.options[userAnswer]}
                  </span>
                </>
              ) : (
                <>
                  Your answer: <span className="font-semibold text-gray-400">Skipped</span>
                </>
              )}
            </p>
            {!isCorrect && (
              <p className="text-sm text-gray-400 mt-1">
                Correct answer: <span className="font-semibold text-green-400">{question.options[question.correct]}</span>
              </p>
            )}
          </div>
          <span className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gray-900 text-white" style={{fontFamily: '"Spline Sans", "Noto Sans", sans-serif'}}>
      <header className="sticky top-0 z-10 w-full bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-[#38e07b]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">QuizMaster Pro</h1>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6 text-sm">
                <button 
                  onClick={() => navigate('/')}
                  className="font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Home
                </button>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Quizzes
                </button>
                <span className="font-bold text-[#38e07b] transition-colors hover:text-[#38e07b]">
                  Results
                </span>
              </nav>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACVIjkO7PrpGZKRRmt1wGeSBkPbcpcNOvcE4BoAvyVQOqHq8tp74qnKfWwvtU6K8uOKetZIp544_W323MejBk9LAf_fZXc2bUit5-9D6QnvBSLTwtQEpecdaIEROeJy2r_osw-1urzSD6VqOcfeUazUjL7vWsOn8gkADIKbhN1hWxncy0AdQD_lxiSrB5UkK0DI8y1p0IM5hmTO8sm-uv5tp7f4xijaDo6aKBfEYSmPWuRX5NCJYiQ_BqYZoWbrud1QyPiAP-0IBg")'}}></div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Quiz Results</h2>
              <p className="mt-4 text-lg text-gray-400">Great job on completing the quiz! Here's how you did.</p>
            </div>
            
            <div className="mb-8 rounded-xl bg-gray-800 p-6 shadow-lg">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-400">Your Score</p>
                  <p className="text-5xl font-bold text-[#38e07b]">{score}/{totalQuestions}</p>
                </div>
                <div className="h-16 w-px bg-gray-700"></div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-400">Accuracy</p>
                  <p className="text-5xl font-bold">{accuracy}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold tracking-tight">Review Your Answers</h3>
                <div className="divide-y divide-gray-800 rounded-lg bg-gray-800/50 overflow-hidden">
                  {generateAnswersReview()}
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold tracking-tight">High Scores</h3>
                <div className="rounded-lg bg-gray-800/50 p-5">
                  <ul className="divide-y divide-gray-800">
                    <li className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-yellow-400">1.</span>
                        <p className="font-medium">PlayerOne</p>
                      </div>
                      <p className="font-bold text-lg text-[#38e07b]">10/10</p>
                    </li>
                    <li className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-400">2.</span>
                        <p className="font-medium">QuizWhiz</p>
                      </div>
                      <p className="font-bold text-lg">9/10</p>
                    </li>
                    <li className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-yellow-600">3.</span>
                        <p className="font-medium">You</p>
                      </div>
                      <p className="font-bold text-lg">{score}/{totalQuestions}</p>
                    </li>
                    <li className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-500">4.</span>
                        <p className="font-medium">TriviaMaster</p>
                      </div>
                      <p className="font-bold text-lg">6/10</p>
                    </li>
                    <li className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-500">5.</span>
                        <p className="font-medium">Newbie</p>
                      </div>
                      <p className="font-bold text-lg">5/10</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <button
                onClick={handleRestart}
                className="inline-flex items-center justify-center rounded-full bg-[#38e07b] px-8 py-3 text-base font-bold text-white shadow-lg transition-transform duration-200 hover:bg-[#2fbc6a] hover:scale-105 active:scale-100"
              >
                Restart Quiz
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm sm:px-6 lg:px-8">
          <p>© 2024 QuizMaster Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Results;
