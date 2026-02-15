import React from 'react';

export const BackgroundAnimation = () => {
    return (
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#0a0e27]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0f1535] to-brand-black opacity-100" />

            {/* Mesh Gradient 1 */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/20 blur-[120px] animate-float"
                style={{ animationDuration: '15s' }}
            />

            {/* Mesh Gradient 2 */}
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/10 blur-[120px] animate-float"
                style={{ animationDuration: '20s', animationDelay: '-5s' }}
            />

            {/* Mesh Gradient 3 */}
            <div
                className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-brand-cyan/10 blur-[150px] animate-pulse-glow"
                style={{ animationDuration: '8s' }}
            />
        </div>
    );
};
