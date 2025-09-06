# Modern Quiz App

A unique, modern, and responsive quiz application built with React and Next.js, featuring a dynamic question system powered by the Open Trivia DB API.

## Live Demo

[Link to live demo](https://modern-quiz-app-psi.vercel.app/)

## Features

- **Dynamic Questions**: Fetches new questions from the Open Trivia DB API for each quiz session.
- **Difficulty Selection**: Choose between easy, medium, and hard difficulty levels.
- **Interactive Quiz Experience**: A clean and engaging interface for answering questions.
- **Timer System**: A 30-second timer for each question to keep you on your toes.
- **Progress Tracking**: A real-time progress bar and score tracking during the quiz.
- **Responsive Design**: A mobile-first design that works seamlessly on all screen sizes.
- **Results Page**: A dedicated page to review your results, including a question-by-question breakdown.
- **High Score Tracking**: Your high score for each difficulty is saved in your browser's local storage.
- **Accessibility**: Full keyboard navigation and ARIA support for an inclusive experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14 with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Custom React Hooks (`useState`, `useEffect`)
- **Data Fetching**: Open Trivia DB API

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thefznkhan/modern-quiz-app.git
    cd modern-quiz-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
/app
  /results
    page.tsx          # The results page
  page.tsx            # Main quiz application page
  layout.tsx          # Root layout
  globals.css         # Global styles
/components
  /ui                   # UI components from shadcn/ui
  QuestionCard.tsx    # Component for displaying a question
  OptionTile.tsx      # Component for an answer option
  ProgressBar.tsx     # Progress bar component
  Timer.tsx           # Timer component
  ResultsList.tsx     # Component for the results breakdown
/hooks
  useQuiz.ts          # Custom hook for quiz state management
/lib
  utils.ts            # Utility functions
```

## API Integration

The application fetches questions from the [Open Trivia DB API](https://opentdb.com/). The API is called when a difficulty level is selected on the home page. The questions are then formatted and used to initialize the quiz state.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is licensed under the MIT License © Md Faizan Khan.
