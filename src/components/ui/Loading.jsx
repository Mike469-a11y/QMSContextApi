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

// React Query specific loading component
const QueryLoadingSpinner = ({ query, fallback = null, size = 'medium' }) => {
  if (query.isLoading) {
    return <LoadingSpinner size={size} text="Loading..." />;
  }
  
  if (query.isFetching && !query.isLoading) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <LoadingSpinner size="small" className="mr-2" />
        Refreshing...
      </div>
    );
  }
  
  return fallback;
};

// Loading state wrapper for React Query
const QueryStateWrapper = ({ 
  query, 
  loadingComponent = <LoadingPage />, 
  children 
}) => {
  if (query.isLoading) {
    return loadingComponent;
  }
  
  return children;
};

// Skeleton loading component
const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className={`bg-gray-200 rounded h-4 mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Table skeleton loader
const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="bg-gray-300 h-6 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 mb-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="bg-gray-200 h-4 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export { 
  LoadingSpinner, 
  LoadingOverlay, 
  LoadingPage, 
  LoadingButton,
  QueryLoadingSpinner,
  QueryStateWrapper,
  SkeletonLoader,
  TableSkeleton
};
export default LoadingSpinner;