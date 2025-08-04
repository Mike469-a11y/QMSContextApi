import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, analyticsService } from '../api/userService.js';

// Query keys for user-related operations
export const USER_QUERY_KEYS = {
  currentUser: ['user', 'current'],
  allUsers: ['user', 'list'],
  user: (id) => ['user', id],
};

// Query keys for analytics
export const ANALYTICS_QUERY_KEYS = {
  dashboardStats: ['analytics', 'dashboard'],
  performanceMetrics: (dateRange) => ['analytics', 'performance', dateRange],
};

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.currentUser,
    queryFn: userService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once for user queries
  });
};

// Hook to get all users (admin only)
export const useAllUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.allUsers,
    queryFn: userService.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedUser) => {
      // Update current user in cache
      queryClient.setQueryData(USER_QUERY_KEYS.currentUser, updatedUser);
      
      // Invalidate all users list if it exists
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.allUsers });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
};

// Hook to create new user (admin only)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.allUsers });
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
};

// Hook to delete user (admin only)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.allUsers });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
};

// Hook to get dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.dashboardStats,
    queryFn: analyticsService.getDashboardStats,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get performance metrics
export const usePerformanceMetrics = (dateRange = {}) => {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.performanceMetrics(dateRange),
    queryFn: () => analyticsService.getPerformanceMetrics(dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to invalidate user-related queries
export const useInvalidateUserQueries = () => {
  const queryClient = useQueryClient();

  const invalidateCurrentUser = () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.currentUser });
  };

  const invalidateAllUsers = () => {
    queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.allUsers });
  };

  const invalidateAnalytics = () => {
    queryClient.invalidateQueries({ queryKey: ['analytics'] });
  };

  return { invalidateCurrentUser, invalidateAllUsers, invalidateAnalytics };
};