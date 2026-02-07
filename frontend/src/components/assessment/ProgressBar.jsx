import React from 'react';

export const ProgressBar = ({ current, total, score }) => {
    const percentage = (current / total) * 100;

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">Assessment Progress</h3>
                    <p className="text-sm text-gray-600">
                        Question {current} of {total}
                    </p>
                </div>
                {score !== null && score !== undefined && (
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Current Score</p>
                        <p className="text-2xl font-bold text-primary-600">
                            {Math.round(score)}%
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="mt-2 text-sm text-gray-600 text-right">
                {Math.round(percentage)}% Complete
            </div>
        </div>
    );
};
