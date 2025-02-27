// Loader.tsx
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Cercle extérieur animé */}
        <svg
          className="w-24 h-24 animate-spin text-green-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>

        {/* Icône d'arbre au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-100"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C9.79 2 8 3.79 8 6c0 1.09.39 2.09 1.02 2.87L12 22l2.98-13.13C15.61 8.09 16 7.09 16 6c0-2.21-1.79-4-4-4z" />
          </svg>
        </div>
      </div>

      {/* Message de chargement */}
      <p className="mt-6 text-green-100 text-xl font-bold">
                Reboisement en cours...
      </p>
    </div>
  );
};

export default Loader;
