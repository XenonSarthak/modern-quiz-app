"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionTileProps {
    label: string;
    index: number;
    onClick: (index: number) => void;
    selected: boolean;
    correct?: boolean;
    locked: boolean;
    showResult?: boolean;
}

export const OptionTile = ({
    label,
    index,
    onClick,
    selected,
    correct,
    locked,
    showResult = false,
}: OptionTileProps) => {
    const handleClick = () => {
        if (!locked) {
            onClick(index);
        }
    };

    const getOptionStyles = () => {
        if (showResult) {
            if (correct) {
                return "bg-green-50 border-green-500 text-green-700 dark:bg-green-950 dark:border-green-400 dark:text-green-300";
            }
            if (selected && !correct) {
                return "bg-red-50 border-red-500 text-red-700 dark:bg-red-950 dark:border-red-400 dark:text-red-300";
            }
        }

        if (selected) {
            return "bg-primary/10 border-primary text-primary ring-2 ring-primary/20";
        }

        return "bg-card border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200";
    };

    const getIcon = () => {
        if (showResult) {
            if (correct) {
                return (
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                );
            }
            if (selected && !correct) {
                return <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
            }
        }
        return null;
    };

    return (
        <button
            onClick={handleClick}
            disabled={locked}
            className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 min-h-[60px] flex items-center justify-between group",
                "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
                locked && "cursor-not-allowed",
                getOptionStyles()
            )}
            aria-pressed={selected}
            role="radio"
        >
            <span className="text-sm font-medium text-balance">{label}</span>
            {getIcon()}
        </button>
    );
};
