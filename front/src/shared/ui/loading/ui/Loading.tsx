export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/80">
            <div className="relative">
                <div
                    className="w-24 h-24 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="w-14 h-14 bg-purple-500/30 rounded-full animate-ping shadow-inner shadow-purple-400/30"></div>
                </div>
            </div>

            <div
                className="mt-6 text-purple-300 text-xl font-semibold animate-pulse"
                role="status"
                aria-live="polite"
            >
                <span className="sr-only">Loading in progress</span>
                Loading...
            </div>
        </div>
    );
};
