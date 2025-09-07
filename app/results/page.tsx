"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResultsList } from "@/components/ResultsList";
import type { QuizResult } from "@/hooks/useQuiz";
import { Trophy, RotateCcw } from "lucide-react";

export default function ResultsPage() {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [highScore, setHighScore] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const storedResults = sessionStorage.getItem("quizResults");
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResults(parsedResults.results);
            setScore(parsedResults.score);
            setTotal(parsedResults.total);
            setDifficulty(parsedResults.difficulty);

            const storedHighScore = localStorage.getItem(
                `quiz-high-score-${parsedResults.difficulty}`
            );
            if (storedHighScore) {
                setHighScore(Number.parseInt(storedHighScore, 10));
            }
        } else {
            router.replace("/");
        }
    }, [router]);

    const handleRestart = () => {
        sessionStorage.removeItem("quizResults");
        router.push("/");
    };

    if (results.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading results...</p>
                </div>
            </div>
        );
    }

    const percentage = Math.round((score / total) * 100);
    const isNewHighScore = score > highScore;

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6 md:p-8 text-center space-y-6">
                    <Trophy className="w-16 h-16 text-primary mx-auto" />
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            Quiz Complete!
                        </h1>
                        {isNewHighScore && (
                            <p className="text-lg text-green-600 font-semibold">
                                🎉 New High Score!
                            </p>
                        )}
                        <p className="text-lg md:text-xl text-muted-foreground">
                            You scored{" "}
                            <span className="font-bold text-primary">
                                {score}
                            </span>{" "}
                            out of <span className="font-bold">{total}</span>
                        </p>
                        <p className="text-lg text-accent font-medium">
                            {percentage}% Correct
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Difficulty:{" "}
                            <span className="capitalize font-medium">
                                {difficulty}
                            </span>{" "}
                            | High Score: {Math.max(score, highScore)}/{total}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={handleRestart}
                            variant="outline"
                            size="lg"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </Card>

                <Card className="p-4 md:p-6">
                    <ResultsList results={results} />
                </Card>
            </div>
        </div>
    );
}
