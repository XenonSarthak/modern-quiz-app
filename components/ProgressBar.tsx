interface ProgressBarProps {
    value: number;
    total: number;
    className?: string;
}

export const ProgressBar = ({
    value,
    total,
    className = "",
}: ProgressBarProps) => {
    const percentage = (value / total) * 100;

    return (
        <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
            <div
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};
