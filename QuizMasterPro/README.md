# QuizMaster Pro - React Edition

A modern, interactive quiz application built with React, featuring dynamic difficulty levels, real-time scoring, and comprehensive result tracking.

## 🚀 Features

- **React Functional Components** with hooks (useState, useEffect)
- **React Router** for seamless navigation between pages
- **Dynamic Difficulty Selection** (Easy: 45s, Medium: 30s, Hard: 15s per question)
- **Real-time Timer** with auto-skip functionality
- **Score Tracking** and progress visualization
- **Comprehensive Results** with answer review
- **Responsive Design** using Tailwind CSS
- **State Management** for quiz flow and data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── Welcome.js      # Landing page with difficulty selection
│   ├── Quiz.js         # Main quiz interface
│   └── Results.js      # Results and answer review
├── data/
│   └── quizData.js     # Quiz questions and configuration
├── App.js              # Main app with routing
├── index.js            # React entry point
└── index.css           # Global styles
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## 🎯 Key Changes Made

### ✅ Requirements Implemented

1. **Previous Button Removed**: No option to go back to previous questions
2. **Skip Button**: Replaces previous functionality for forward-only navigation
3. **React Functional Components**: All components use hooks (useState, useEffect)
4. **Props Usage**: Effective data passing between components
5. **Tailwind CSS**: Consistent styling throughout
6. **State Management**: Complete quiz flow state transitions
7. **React Router**: Routes for `/`, `/quiz`, and `/results`

### 🔄 State Flow

1. **Load Questions** → Initialize quiz state from `quizData.js`
2. **Question Flow** → Capture selection → Lock answer → Navigate next
3. **Completion** → Compute score → Navigate to Results → Allow Restart

### 🎮 User Experience

- **Welcome Page**: Select difficulty level and start quiz
- **Quiz Page**: Answer questions with timer, skip option, and progress tracking
- **Results Page**: View score, accuracy, detailed answer review, and restart option

## 🧩 Technical Implementation

### State Management
- `useState` for component-level state
- `useEffect` for side effects and lifecycle management
- `localStorage` for data persistence between routes

### Routing
- React Router v6 with BrowserRouter
- Programmatic navigation with `useNavigate`
- Route protection and data validation

### Quiz Logic
- Dynamic timer based on difficulty selection
- Answer locking mechanism
- Score calculation and progress tracking
- Auto-skip on timeout

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS Variables** for consistent theming
- **Responsive Design** for all screen sizes
- **Smooth Animations** and hover effects

## 📱 Responsive Features

- Mobile-first design approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized typography scaling

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

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📄 License

© 2024 QuizMaster Pro. All rights reserved.
