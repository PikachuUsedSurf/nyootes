'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <svg
          className="w-full h-full text-blue-600 dark:text-blue-400"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="flex gap-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-8"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingPage: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};