import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry for the inconvenience. Please try refreshing the page.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="text-left mb-6 p-4 bg-red-50 rounded-lg">
                                <summary className="cursor-pointer font-semibold text-red-900">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-800 overflow-auto whitespace-pre-wrap">
                                    {this.state.error?.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
