# QuizMaster Pro

A modern, interactive quiz application with both a vanilla JS and a React implementation. It features dynamic difficulty, per‑question timers, progress and scoring, and a themed UI.

## 🚀 Features

Vanilla JS (in `quiz.html`, `quiz.js`):
- **Dynamic Difficulty** (Easy 45s, Medium 30s, Hard 15s per question)
- **Per‑question persistent timer**; no reset on revisit; timeout locks inputs
- **Skip/Next navigation**, progress bar, and live score
- **Themed toast notifications** (e.g., time’s up)

React (in `src/`):
- **React components** with hooks and React Router
- **Per‑question persistent timer** and timeout enforcement
- **Results page** with summary and review
- **Tailwind CSS** themed UI

## 📁 Project Structure

```
QuizMasterPro/
├── index.html          # Welcome (vanilla)
├── welcome.js          # Welcome logic (vanilla)
├── quiz.html           # Quiz (vanilla)
├── quiz.js             # Quiz logic (vanilla)
├── results.html        # Results (vanilla)
├── results.js          # Results logic (vanilla)
├── profile.html        # Profile (name only)
└── src/                # React app
    ├── components/
    │   ├── Welcome.js
    │   ├── Quiz.js
    │   └── Results.js
    ├── data/quizData.js
    ├── App.js
    ├── index.js
    └── index.css
```

## 🛠️ Installation & Setup (React)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**: `http://localhost:3000`

## 🧠 Behavior Notes

- Timers are tracked per question. Revisiting does not reset remaining time.
- If a question’s timer hits 0, inputs are disabled and a themed toast says: “Time's up for this question. Please proceed to the next question.”
- Navigation uses Skip/Next; previous is available in vanilla but respects timeouts.

## 🔧 Customization

### Adding Questions
Edit `src/data/quizData.js` to add new questions:

```javascript
{
  id: 11,
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correct: 2 // Index of correct answer (0-based)
}
```

### Modifying Difficulty
Update `src/data/quizData.js` difficulties array:

```javascript
export const difficulties = [
  { id: 'easy', name: 'Easy', timeLimit: 45 },
  { id: 'medium', name: 'Medium', timeLimit: 30 },
  { id: 'hard', name: 'Hard', timeLimit: 15 }
];
```

## 🚀 Build for Production (React)

```bash
npm run build
```

Creates an optimized build in the `build` folder.

## 📄 License

© 2024 QuizMaster Pro. All rights reserved.
