import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

const LoadingOverlay = ({ isLoading, children, text = 'Loading...' }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <LoadingSpinner text={text} />
      </div>
    </div>
  );
};

const LoadingPage = ({ text = 'Loading page...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

const LoadingButton = ({ isLoading, children, ...props }) => {
  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className={`flex items-center justify-center ${props.className || ''}`}
    >
      {isLoading && <LoadingSpinner size="small" className="mr-2" />}
      {children}
    </button>
  );
};

export { LoadingSpinner, LoadingOverlay, LoadingPage, LoadingButton };
export default LoadingSpinner;