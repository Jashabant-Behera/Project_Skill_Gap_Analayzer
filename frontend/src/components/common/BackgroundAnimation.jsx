import React from 'react';

const Shape = ({ type, className, color, size = 48, style }) => {
    const commonProps = {
        className: `absolute opacity-[0.15] ${className}`,
        style: { ...style },
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };

    if (type === 'circle') {
        return (
            <svg {...commonProps} className={`${commonProps.className} text-${color}-500`}>
                <circle cx="12" cy="12" r="10" />
            </svg>
        );
    }
    if (type === 'square') {
        return (
            <svg {...commonProps} className={`${commonProps.className} text-${color}-500`}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
        );
    }
    if (type === 'triangle') {
        return (
            <svg {...commonProps} className={`${commonProps.className} text-${color}-500`}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
        );
    }
    if (type === 'hexagon') {
        return (
            <svg {...commonProps} className={`${commonProps.className} text-${color}-500`}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
        );
    }
    return null;
};

export const BackgroundAnimation = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#0a0e27]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0f1535] to-brand-black opacity-100" />

            {/* Mesh Gradients */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/10 blur-[120px] animate-float"
                style={{ animationDuration: '15s' }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/10 blur-[120px] animate-float"
                style={{ animationDuration: '20s', animationDelay: '-5s' }}
            />
            <div
                className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-brand-cyan/5 blur-[150px] animate-pulse-glow"
                style={{ animationDuration: '8s' }}
            />

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0">
                {/* Top Left Cluster */}
                <Shape type="circle" color="brand-cyan" size={64} className="top-[10%] left-[5%] animate-float-slow" />
                <Shape type="triangle" color="brand-blue" size={48} className="top-[20%] left-[15%] animate-float-rotate" style={{ animationDelay: '1s' }} />

                {/* Top Right Cluster */}
                <Shape type="hexagon" color="brand-orange" size={80} className="top-[15%] right-[10%] animate-float-rotate-reverse" style={{ animationDelay: '2s' }} />
                <Shape type="square" color="brand-cyan" size={32} className="top-[25%] right-[20%] animate-float" style={{ animationDelay: '4s' }} />

                {/* Bottom Left Cluster */}
                <Shape type="square" color="brand-orange" size={56} className="bottom-[15%] left-[10%] animate-float-rotate" style={{ animationDelay: '3s' }} />
                <Shape type="hexagon" color="brand-blue" size={40} className="bottom-[25%] left-[20%] animate-float-delayed" />

                {/* Bottom Right Cluster */}
                <Shape type="triangle" color="brand-cyan" size={72} className="bottom-[10%] right-[5%] animate-float-rotate-reverse" style={{ animationDelay: '1.5s' }} />
                <Shape type="circle" color="brand-orange" size={48} className="bottom-[30%] right-[15%] animate-float-slow" style={{ animationDelay: '2.5s' }} />

                {/* Center / Random Scattering */}
                <Shape type="circle" color="brand-blue" size={24} className="top-[45%] left-[8%] animate-float" style={{ animationDelay: '5s' }} />
                <Shape type="square" color="brand-orange" size={24} className="top-[60%] right-[5%] animate-float-delayed" />
            </div>
        </div>
    );
};
