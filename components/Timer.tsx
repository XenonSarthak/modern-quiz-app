import { Clock } from "lucide-react";

interface TimerProps {
    timeRemaining: number;
    isActive: boolean;
    className?: string;
}

export const Timer = ({
    timeRemaining,
    isActive,
    className = "",
}: TimerProps) => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const isLowTime = timeRemaining <= 10;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Clock
                className={`w-4 h-4 ${isLowTime ? "text-destructive" : "text-muted-foreground"}`}
            />
            <span
                className={`font-mono text-sm font-medium ${isLowTime ? "text-destructive animate-pulse" : "text-foreground"}`}
            >
                {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    );
};
