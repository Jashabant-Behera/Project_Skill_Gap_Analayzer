import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinner with glow effect */}
            <div className="relative">
                {/* Outer glow ring */}
                <div className={`absolute inset-0 ${sizeClasses[size]} blur-md`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500 animate-pulse" />
                </div>

                {/* Main spinner */}
                <Loader2
                    className={`${sizeClasses[size]} text-primary-400 animate-spin relative z-10`}
                    strokeWidth={2.5}
                />

                {/* Inner sparkle */}
                <Sparkles
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-2 h-2' :
                            size === 'md' ? 'w-4 h-4' :
                                size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'
                        } text-primary-300 animate-pulse`}
                />
            </div>

            {/* Loading text */}
            {text && (
                <div className="text-center space-y-2">
                    <p className={`font-medium text-gray-300 ${size === 'sm' ? 'text-sm' :
                            size === 'md' ? 'text-base' :
                                size === 'lg' ? 'text-lg' : 'text-xl'
                        }`}>
                        {text}
                    </p>

                    {/* Animated dots */}
                    <div className="flex items-center justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
                                style={{
                                    animationDelay: `${i * 0.2}s`,
                                    animationDuration: '1.4s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {content}
        </div>
    );
};

// Alternative Skeleton Loader
export const SkeletonLoader = ({ className = '' }) => {
    return (
        <div className={`skeleton ${className}`} />
    );
};

// Card Skeleton
export const CardSkeleton = () => {
    return (
        <div className="card space-y-4 animate-pulse">
            <div className="h-6 bg-dark-800 rounded w-3/4" />
            <div className="h-4 bg-dark-800 rounded w-full" />
            <div className="h-4 bg-dark-800 rounded w-5/6" />
            <div className="flex gap-2">
                <div className="h-8 bg-dark-800 rounded w-20" />
                <div className="h-8 bg-dark-800 rounded w-24" />
            </div>
        </div>
    );
};

// Progress Skeleton
export const ProgressSkeleton = () => {
    return (
        <div className="card space-y-4 animate-pulse">
            <div className="flex justify-between">
                <div className="h-6 bg-dark-800 rounded w-40" />
                <div className="h-6 bg-dark-800 rounded w-24" />
            </div>
            <div className="h-4 bg-dark-800 rounded-full w-full" />
            <div className="h-4 bg-dark-800 rounded w-32" />
        </div>
    );
};
