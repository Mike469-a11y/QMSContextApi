import React from 'react';

const ErrorMessage = ({ 
  error, 
  title = 'Something went wrong', 
  onRetry = null, 
  className = '' 
}) => {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.statusText) return error.response.statusText;
    return 'An unexpected error occurred';
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{getErrorMessage(error)}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ErrorPage = ({ 
  error, 
  title = 'Oops! Something went wrong', 
  onRetry = null,
  onGoHome = null 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-blue-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try again
              </button>
            )}
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="bg-gray-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// React Query specific error component
const QueryErrorMessage = ({ query, onRetry, title = 'Failed to load data' }) => {
  if (!query.isError) return null;
  
  return (
    <ErrorMessage
      error={query.error}
      title={title}
      onRetry={onRetry || query.refetch}
    />
  );
};

// React Query error boundary
const QueryErrorBoundary = ({ 
  query, 
  fallback = null, 
  title = 'Failed to load data',
  showRetry = true 
}) => {
  if (query.isError) {
    return (
      <div className="p-4">
        <QueryErrorMessage 
          query={query} 
          title={title}
          onRetry={showRetry ? query.refetch : null}
        />
      </div>
    );
  }
  
  return fallback;
};

// Network status error component
const NetworkError = ({ onRetry, className = '' }) => {
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Connection Problem</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Unable to connect to the server. Please check your internet connection.</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 404 Error component
const NotFoundError = ({ onGoHome, message = 'The page you are looking for does not exist.' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="bg-blue-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

const ErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage 
          error={this.state.error}
          title="Application Error"
          onRetry={() => this.setState({ hasError: false, error: null })}
          onGoHome={() => window.location.href = '/'}
        />
      );
    }

    return this.props.children;
  }
};

export { 
  ErrorMessage, 
  ErrorPage, 
  ErrorBoundary,
  QueryErrorMessage,
  QueryErrorBoundary,
  NetworkError,
  NotFoundError
};
export default ErrorMessage;