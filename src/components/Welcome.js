import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { difficulties } from '../data/quizData';

const Welcome = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Store selected difficulty in localStorage
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
    // Navigate to quiz page
    navigate('/quiz');
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#111827] dark group/design-root overflow-x-hidden" style={{fontFamily: '"Spline Sans", "Noto Sans", sans-serif'}}>
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center p-6 lg:p-8">
          <div className="flex w-full max-w-lg flex-col items-center space-y-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-[#38e07b]">
                <svg className="lucide lucide-brain-circuit" fill="none" height="64" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="64" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5a3 3 0 1 0-5.993.142"></path>
                  <path d="M18 5a3 3 0 1 0-5.993.142"></path>
                  <path d="M12 13a3 3 0 1 0-5.993.142"></path>
                  <path d="M18 13a3 3 0 1 0-5.993.142"></path>
                  <path d="M12 21a3 3 0 1 0-5.993.142"></path>
                  <path d="M18 21a3 3 0 1 0-5.993.142"></path>
                  <path d="M12 5a3 3 0 1 0-5.993.142"></path>
                  <path d="M18 5a3 3 0 1 0-5.993.142"></path>
                  <path d="M6 5h.01"></path>
                  <path d="M18 5h.01"></path>
                  <path d="M6 13h.01"></path>
                  <path d="M18 13h.01"></path>
                  <path d="M6 21h.01"></path>
                  <path d="M18 21h.01"></path>
                  <path d="M9 8V7"></path>
                  <path d="M9 16v-1"></path>
                  <path d="M15 8V7"></path>
                  <path d="M15 16v-1"></path>
                  <path d="M9 21a2.99 2.99 0 0 0 2.122-.879"></path>
                  <path d="M15 21a2.99 2.99 0 0 1-2.122-.879"></path>
                  <path d="m14.12 13.88.75.75"></path>
                  <path d="m9.13 13.88-.75.75"></path>
                </svg>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">QuizMaster Pro</h1>
            </div>
            <p className="max-w-md text-lg text-gray-300 md:text-xl">
              Ready to test your knowledge? Our quizzes are designed to be fun, engaging, and challenging. See where you stand!
            </p>
            <div className="flex w-full max-w-xs flex-col space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-base font-medium text-gray-300" htmlFor="difficulty">Select Difficulty</label>
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-800 p-1">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.id}
                      onClick={() => setSelectedDifficulty(difficulty.id)}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-700 hover:text-white focus:outline-none ${
                        selectedDifficulty === difficulty.id
                          ? 'bg-[#38e07b] text-[#111827]'
                          : 'text-gray-400'
                      }`}
                    >
                      {difficulty.name}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleStartQuiz}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[#38e07b] text-[#111827] text-lg font-bold leading-normal tracking-wide shadow-lg transition-transform duration-200 hover:scale-105"
              >
                <span className="truncate">Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
