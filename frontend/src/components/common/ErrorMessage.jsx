import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="card bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>{message}</p>
            </div>
            {onRetry && (
                <button onClick={onRetry} className="btn-primary mt-4">
                    Try Again
                </button>
            )}
        </div>
    );
};
