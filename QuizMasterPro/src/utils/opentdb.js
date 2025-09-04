// Utilities for fetching and transforming questions from OpenTDB

const EASY_URL = 'https://opentdb.com/api.php?amount=50&difficulty=easy&type=multiple';
const MEDIUM_URL = 'https://opentdb.com/api.php?amount=50&difficulty=medium&type=multiple';
const HARD_URL = 'https://opentdb.com/api.php?amount=50&difficulty=hard&type=multiple';

function decodeHtml(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.documentElement.textContent || '';
}

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function fetchOpenTdbQuestions(difficulty, amount = 10) {
  try {
    const url = difficulty === 'easy' ? EASY_URL : difficulty === 'hard' ? HARD_URL : MEDIUM_URL;
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`API request failed: ${resp.status}`);
    }
    const data = await resp.json();
    if (!data || !Array.isArray(data.results)) {
      throw new Error('Malformed response from OpenTDB');
    }

    // Transform questions into app format
    const transformed = data.results.map((q, idx) => {
      const decodedQuestion = decodeHtml(q.question);
      const decodedCorrect = decodeHtml(q.correct_answer);
      const decodedIncorrect = (q.incorrect_answers || []).map(decodeHtml);
      const allOptions = shuffleArray([decodedCorrect, ...decodedIncorrect]);
      const correctIndex = allOptions.findIndex((opt) => opt === decodedCorrect);
      return {
        id: idx + 1,
        question: decodedQuestion,
        options: allOptions,
        correct: correctIndex,
        category: q.category,
        difficulty: q.difficulty,
      };
    });

    // Sample the first `amount` questions (after shuffle)
    const randomized = shuffleArray(transformed).slice(0, amount);
    return randomized;
  } catch (error) {
    console.warn('API failed, loading offline questions:', error.message);
    // Fallback to offline questions
    return await fetchOfflineQuestions(difficulty, amount);
  }
}

export async function fetchOfflineQuestions(difficulty, amount = 10) {
  try {
    const response = await fetch('/questions.json');
    if (!response.ok) {
      throw new Error('Failed to load offline questions');
    }
    const data = await response.json();
    
    if (!data[difficulty] || !Array.isArray(data[difficulty])) {
      throw new Error('Invalid offline questions format');
    }

    // Transform questions into app format
    const transformed = data[difficulty].map((q, idx) => {
      const allOptions = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
      const correctIndex = allOptions.findIndex((opt) => opt === q.correct_answer);
      return {
        id: idx + 1,
        question: q.question,
        options: allOptions,
        correct: correctIndex,
        category: 'General Knowledge',
        difficulty: difficulty,
      };
    });

    // Sample the first `amount` questions (after shuffle)
    const randomized = shuffleArray(transformed).slice(0, amount);
    return randomized;
  } catch (error) {
    throw new Error('Failed to load questions. Please check your internet connection and try again.');
  }
}


