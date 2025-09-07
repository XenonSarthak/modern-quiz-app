"use client";

import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";

export interface Question {
    id: string;
    category: string;
    difficulty: Difficulty;
    question: string;
    options: string[];
    correctIndex: number;
}

export interface QuizState {
    questions: Question[];
    currentQuestionIndex: number;
    selectedAnswers: (number | null)[];
    isCompleted: boolean;
    score: number;
    timeRemaining: number;
    isTimerActive: boolean;
}

export interface QuizResult {
    question: Question;
    selectedAnswer: number | null;
    isCorrect: boolean;
}

const getHighScore = (difficulty: Difficulty): number => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`quiz-high-score-${difficulty}`);
    return stored ? Number.parseInt(stored, 10) : 0;
};

const setHighScore = (difficulty: Difficulty, score: number): void => {
    if (typeof window === "undefined") return;
    const currentHigh = getHighScore(difficulty);
    if (score > currentHigh) {
        localStorage.setItem(`quiz-high-score-${difficulty}`, score.toString());
    }
};

export const useQuiz = (
    questions: Question[],
    timerDuration = 30,
    difficulty: Difficulty = "medium"
) => {
    const [state, setState] = useState<QuizState>(() => ({
        questions: questions,
        currentQuestionIndex: 0,
        selectedAnswers: new Array(questions.length).fill(null),
        isCompleted: false,
        score: 0,
        timeRemaining: timerDuration,
        isTimerActive: false,
    }));

    useEffect(() => {
        if (questions && questions.length > 0) {
            setState((prev) => ({
                ...prev,
                questions,
                selectedAnswers: new Array(questions.length).fill(null),
            }));
        }
    }, [questions]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (
            state.isTimerActive &&
            state.timeRemaining > 0 &&
            !state.isCompleted
        ) {
            interval = setInterval(() => {
                setState((prev) => {
                    if (prev.timeRemaining <= 1) {
                        // Time's up - auto advance to next question
                        return {
                            ...prev,
                            timeRemaining: timerDuration,
                            currentQuestionIndex:
                                prev.currentQuestionIndex + 1 >=
                                prev.questions.length
                                    ? prev.currentQuestionIndex
                                    : prev.currentQuestionIndex + 1,
                            isCompleted:
                                prev.currentQuestionIndex + 1 >=
                                prev.questions.length,
                        };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [
        state.isTimerActive,
        state.timeRemaining,
        state.isCompleted,
        timerDuration,
    ]);

    const selectAnswer = (answerIndex: number) => {
        if (state.isCompleted) return;

        setState((prev) => {
            const newSelectedAnswers = [...prev.selectedAnswers];
            newSelectedAnswers[prev.currentQuestionIndex] = answerIndex;
            return { ...prev, selectedAnswers: newSelectedAnswers };
        });
    };

    const nextQuestion = () => {
        if (state.currentQuestionIndex < state.questions.length - 1) {
            setState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                timeRemaining: timerDuration,
            }));
        }
    };

    const previousQuestion = () => {
        if (state.currentQuestionIndex > 0) {
            setState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1,
                timeRemaining: timerDuration,
            }));
        }
    };

    const submitQuiz = () => {
        const score = state.selectedAnswers.reduce(
            (acc: number, answer, index) => {
                if (answer === state.questions[index].correctIndex) {
                    return acc + 1;
                }
                return acc;
            },
            0
        );

        setHighScore(difficulty, score);

        setState((prev) => ({
            ...prev,
            isCompleted: true,
            score,
            isTimerActive: false,
        }));
    };

    const restartQuiz = () => {
        setState({
            questions,
            currentQuestionIndex: 0,
            selectedAnswers: new Array(questions.length).fill(null),
            isCompleted: false,
            score: 0,
            timeRemaining: timerDuration,
            isTimerActive: false,
        });
    };

    const startTimer = () => {
        setState((prev) => ({ ...prev, isTimerActive: true }));
    };

    const stopTimer = () => {
        setState((prev) => ({ ...prev, isTimerActive: false }));
    };

    const getResults = (): QuizResult[] => {
        return state.questions.map((question, index) => ({
            question,
            selectedAnswer: state.selectedAnswers[index],
            isCorrect: state.selectedAnswers[index] === question.correctIndex,
        }));
    };

    const canProceed = () => {
        return state.selectedAnswers[state.currentQuestionIndex] !== null;
    };

    const getCurrentScore = () => {
        return state.selectedAnswers
            .slice(0, state.currentQuestionIndex + 1)
            .reduce((acc: number, answer, index) => {
                if (answer === state.questions[index]?.correctIndex) {
                    return acc + 1;
                }
                return acc;
            }, 0);
    };

    const currentQuestion =
        state.questions.length > 0
            ? state.questions[state.currentQuestionIndex]
            : null;

    return {
        ...state,
        selectAnswer,
        nextQuestion,
        previousQuestion,
        submitQuiz,
        restartQuiz,
        startTimer,
        stopTimer,
        getResults,
        canProceed,
        currentQuestion,
        getCurrentScore,
        getHighScore: () => getHighScore(difficulty),
        progress:
            state.questions.length > 0
                ? ((state.currentQuestionIndex + 1) / state.questions.length) *
                  100
                : 0,
        isLastQuestion:
            state.currentQuestionIndex === state.questions.length - 1,
    };
};
