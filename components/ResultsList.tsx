import type { QuizResult } from "@/hooks/useQuiz";
import { Check, X } from "lucide-react";

interface ResultsListProps {
    results: QuizResult[];
}

export const ResultsList = ({ results }: ResultsListProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Question Breakdown
            </h3>
            {results.map((result, index) => (
                <div
                    key={result.question.id}
                    className="bg-card rounded-lg border border-border p-4 space-y-3"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Question {index + 1}
                                </span>
                                {result.isCorrect ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                    <X className="w-4 h-4 text-red-600" />
                                )}
                            </div>
                            <p className="text-sm text-foreground font-medium mb-2 text-balance">
                                {result.question.question}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                                Your answer:
                            </span>
                            <span
                                className={
                                    result.isCorrect
                                        ? "text-green-600 font-medium"
                                        : "text-red-600 font-medium"
                                }
                            >
                                {result.selectedAnswer !== null
                                    ? result.question.options[
                                          result.selectedAnswer
                                      ]
                                    : "No answer selected"}
                            </span>
                        </div>
                        {!result.isCorrect && (
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Correct answer:
                                </span>
                                <span className="text-green-600 font-medium">
                                    {
                                        result.question.options[
                                            result.question.correctIndex
                                        ]
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
