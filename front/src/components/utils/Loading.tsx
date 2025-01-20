const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500 shadow-[0_0_15px] shadow-purple-500/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-transparent rounded-full animate-pulse bg-purple-500/20"></div>
        </div>
      </div>
      <div className="mt-4 text-purple-300 text-lg font-medium animate-pulse" role="status" aria-live="polite">
        <span className="sr-only">Loading in progress</span>
      </div>
    </div>
  );
};

export default Loading;