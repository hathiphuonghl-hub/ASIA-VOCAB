import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label = "Progress" }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-indigo-700">{label}</span>
                <span className="text-sm font-medium text-indigo-700">{current} / {total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${percentage}%` }}
                    aria-valuenow={current}
                    aria-valuemin={0}
                    aria-valuemax={total}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
