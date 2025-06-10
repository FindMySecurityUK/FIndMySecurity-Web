// components/ComingSoon.tsx
import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        🚀 Website Coming Soon
      </h1>
      <p className="text-lg text-gray-600">
        We're working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
