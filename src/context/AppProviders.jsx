import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/index.js';
import { UserProvider } from './UserContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Combined Context Provider
export const AppProviders = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            {children}
            {/* Only show devtools in development */}
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export { queryClient };
export default AppProviders;