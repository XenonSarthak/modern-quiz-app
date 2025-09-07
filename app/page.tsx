"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Timer } from "@/components/Timer";
import { useQuiz, type Question } from "@/hooks/useQuiz";
import {
    ChevronLeft,
    ChevronRight,
    Trophy,
    RotateCcw,
    Play,
    Zap,
    Target,
    Flame,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { decodeHtml } from "@/lib/utils";

type Difficulty = "easy" | "medium" | "hard";

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const getHighScoreForDifficulty = (difficulty: Difficulty) => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`quiz-high-score-${difficulty}`);
    return stored ? Number.parseInt(stored, 10) : 0;
};

export default function QuizApp() {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] =
        useState<Difficulty | null>(null);
    const [highScores, setHighScores] = useState({
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        setHighScores({
            easy: getHighScoreForDifficulty("easy"),
            medium: getHighScoreForDifficulty("medium"),
            hard: getHighScoreForDifficulty("hard"),
        });
    }, []);

    const quiz = useQuiz(filteredQuestions, 30, selectedDifficulty || "medium");

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
                );
                if (!response.ok) throw new Error("Failed to load questions");
                const data = await response.json();
                const formattedQuestions = data.results.map(
                    (q: any, index: number) => {
                        const decodedQuestion = decodeHtml(q.question);
                        const decodedCorrectAnswer = decodeHtml(
                            q.correct_answer
                        );
                        const decodedIncorrectAnswers = q.incorrect_answers.map(
                            (a: string) => decodeHtml(a)
                        );
                        const options = shuffleArray([
                            ...decodedIncorrectAnswers,
                            decodedCorrectAnswer,
                        ]);
                        return {
                            id: `q${index + 1}`,
                            category: decodeHtml(q.category),
                            difficulty: q.difficulty,
                            question: decodedQuestion,
                            options: options,
                            correctIndex: options.indexOf(decodedCorrectAnswer),
                        };
                    }
                );
                setAllQuestions(formattedQuestions);
            } catch (error) {
                console.error("Error loading questions:", error);
                toast({
                    title: "Error",
                    description:
                        "Failed to load quiz questions. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedDifficulty) {
            loadQuestions();
        }
    }, [selectedDifficulty, toast]);

    useEffect(() => {
        if (allQuestions.length > 0) {
            setFilteredQuestions(allQuestions.slice(0, 10));
        }
    }, [allQuestions]);

    useEffect(() => {
        if (quiz.isCompleted) {
            const resultsToStore = {
                results: quiz.getResults(),
                score: quiz.score,
                total: filteredQuestions.length,
                difficulty: selectedDifficulty,
            };
            sessionStorage.setItem(
                "quizResults",
                JSON.stringify(resultsToStore)
            );
            router.push("/results");
        }
    }, [quiz.isCompleted, quiz, filteredQuestions, selectedDifficulty, router]);

    const handleDifficultySelect = (difficulty: Difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    const handleStart = () => {
        setHasStarted(true);
        quiz.startTimer();
    };

    const handleNext = () => {
        if (!quiz.canProceed()) {
            toast({
                title: "Please select an answer",
                description:
                    "You must select an answer before proceeding to the next question.",
                variant: "destructive",
            });
            return;
        }
        quiz.nextQuestion();
    };

    const handleSubmit = () => {
        if (!quiz.canProceed()) {
            toast({
                title: "Please select an answer",
                description:
                    "You must select an answer before submitting the quiz.",
                variant: "destructive",
            });
            return;
        }
        quiz.submitQuiz();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">
                        Loading quiz questions...
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedDifficulty) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full p-8 text-center space-y-8">
                    <div className="space-y-4">
                        <Trophy className="w-16 h-16 text-primary mx-auto" />
                        <h1 className="text-3xl font-bold text-foreground">
                            Modern Quiz App
                        </h1>
                        <p className="text-muted-foreground text-balance text-lg">
                            Choose your difficulty level and test your knowledge
                            with 10 randomized questions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card
                            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-green-500"
                            onClick={() => handleDifficultySelect("easy")}
                        >
                            <div className="space-y-4 text-center">
                                <Zap className="w-12 h-12 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold text-green-600">
                                    Easy
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Perfect for beginners
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    High Score: {highScores.easy}/10
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-yellow-500"
                            onClick={() => handleDifficultySelect("medium")}
                        >
                            <div className="space-y-4 text-center">
                                <Target className="w-12 h-12 text-yellow-500 mx-auto" />
                                <h3 className="text-xl font-bold text-yellow-600">
                                    Medium
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Balanced challenge
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    High Score: {highScores.medium}/10
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-red-500"
                            onClick={() => handleDifficultySelect("hard")}
                        >
                            <div className="space-y-4 text-center">
                                <Flame className="w-12 h-12 text-red-500 mx-auto" />
                                <h3 className="text-xl font-bold text-red-600">
                                    Hard
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    For quiz masters
                                </p>
                                <div className="text-xs text-muted-foreground">
                                    High Score: {highScores.hard}/10
                                </div>
                            </div>
                        </Card>
                    </div>
                </Card>
            </div>
        );
    }

    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <Trophy className="w-12 h-12 text-primary mx-auto" />
                        <h1 className="text-2xl font-bold text-foreground">
                            Ready to Start?
                        </h1>
                        <p className="text-muted-foreground text-balance">
                            You've selected{" "}
                            <span className="font-semibold capitalize">
                                {selectedDifficulty}
                            </span>{" "}
                            difficulty with {filteredQuestions.length}{" "}
                            questions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Questions:
                                </span>
                                <span className="font-medium">
                                    {filteredQuestions.length}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Difficulty:
                                </span>
                                <span className="font-medium capitalize">
                                    {selectedDifficulty}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Time per question:
                                </span>
                                <span className="font-medium">30 seconds</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    High Score:
                                </span>
                                <span className="font-medium">
                                    {quiz.getHighScore()}/10
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={() => setSelectedDifficulty(null)}
                                variant="outline"
                                className="flex-1"
                            >
                                Change Difficulty
                            </Button>
                            <Button
                                onClick={handleStart}
                                className="flex-1"
                                size="lg"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Start Quiz
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (!quiz.currentQuestion) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Loading question...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1">
                            <h1 className="text-lg font-semibold text-foreground">
                                Question {quiz.currentQuestionIndex + 1} of{" "}
                                {filteredQuestions.length}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Score: {quiz.getCurrentScore()} /{" "}
                                {quiz.currentQuestionIndex + 1} | Difficulty:{" "}
                                <span className="capitalize">
                                    {selectedDifficulty}
                                </span>
                            </p>
                        </div>
                        <Timer
                            timeRemaining={quiz.timeRemaining}
                            isActive={quiz.isTimerActive}
                        />
                    </div>
                    <ProgressBar
                        value={quiz.currentQuestionIndex + 1}
                        total={filteredQuestions.length}
                    />
                </Card>

                <QuestionCard
                    question={quiz.currentQuestion}
                    onSelect={quiz.selectAnswer}
                    selectedIndex={
                        quiz.selectedAnswers[quiz.currentQuestionIndex]
                    }
                    locked={false}
                />

                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Button
                            onClick={quiz.previousQuestion}
                            disabled={quiz.currentQuestionIndex === 0}
                            variant="outline"
                            className="w-full sm:w-auto bg-transparent"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex gap-2 w-full sm:w-auto">
                            {quiz.isLastQuestion ? (
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-primary to-accent flex-1 sm:flex-none"
                                >
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-primary to-accent flex-1 sm:flex-none"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
