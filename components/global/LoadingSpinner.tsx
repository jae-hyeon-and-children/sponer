import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
      <div className="w-16 h-16 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
