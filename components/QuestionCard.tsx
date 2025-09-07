"use client";

import { OptionTile } from "./OptionTile";
import type { Question } from "@/hooks/useQuiz";

interface QuestionCardProps {
    question: Question;
    onSelect: (index: number) => void;
    selectedIndex: number | null;
    locked: boolean;
    showResult?: boolean;
}

export const QuestionCard = ({
    question,
    onSelect,
    selectedIndex,
    locked,
    showResult = false,
}: QuestionCardProps) => {
    return (
        <div className="bg-card rounded-xl shadow-lg border border-border p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        {question.category}
                    </span>
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full capitalize">
                        {question.difficulty}
                    </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground text-balance leading-relaxed">
                    {question.question}
                </h2>
            </div>

            <div
                className="space-y-3"
                role="radiogroup"
                aria-label="Answer options"
            >
                {question.options.map((option, index) => (
                    <OptionTile
                        key={index}
                        label={option}
                        index={index}
                        onClick={onSelect}
                        selected={selectedIndex === index}
                        correct={
                            showResult
                                ? index === question.correctIndex
                                : undefined
                        }
                        locked={locked}
                        showResult={showResult}
                    />
                ))}
            </div>
        </div>
    );
};
