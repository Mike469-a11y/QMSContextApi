import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import qmsService from '../api/qmsService.js';

// Query keys for consistent cache management
export const QMS_QUERY_KEYS = {
  entries: ['qms', 'entries'],
  entry: (id) => ['qms', 'entry', id],
  filteredEntries: (filters) => ['qms', 'entries', filters],
};

// Hook to get all QMS entries with optional filters
export const useQmsEntries = (filters = {}) => {
  return useQuery({
    queryKey: Object.keys(filters).length > 0 
      ? QMS_QUERY_KEYS.filteredEntries(filters)
      : QMS_QUERY_KEYS.entries,
    queryFn: () => qmsService.getEntries(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a single QMS entry by ID
export const useQmsEntry = (id) => {
  return useQuery({
    queryKey: QMS_QUERY_KEYS.entry(id),
    queryFn: () => qmsService.getEntryById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404-like errors
      if (error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook to create a new QMS entry
export const useCreateQmsEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: qmsService.createEntry,
    onSuccess: (newEntry) => {
      // Invalidate and refetch entries list
      queryClient.invalidateQueries({ queryKey: QMS_QUERY_KEYS.entries });
      
      // Optionally set the new entry in cache
      queryClient.setQueryData(QMS_QUERY_KEYS.entry(newEntry.id), newEntry);
    },
    onError: (error) => {
      console.error('Failed to create QMS entry:', error);
    },
  });
};

// Hook to update an existing QMS entry
export const useUpdateQmsEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => qmsService.updateEntry(id, updates),
    onSuccess: (updatedEntry, { id }) => {
      // Update the specific entry in cache
      queryClient.setQueryData(QMS_QUERY_KEYS.entry(id), updatedEntry);
      
      // Invalidate entries list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QMS_QUERY_KEYS.entries });
    },
    onError: (error) => {
      console.error('Failed to update QMS entry:', error);
    },
  });
};

// Hook to delete a QMS entry
export const useDeleteQmsEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: qmsService.deleteEntry,
    onSuccess: (result, id) => {
      // Remove the entry from cache
      queryClient.removeQueries({ queryKey: QMS_QUERY_KEYS.entry(id) });
      
      // Invalidate entries list
      queryClient.invalidateQueries({ queryKey: QMS_QUERY_KEYS.entries });
    },
    onError: (error) => {
      console.error('Failed to delete QMS entry:', error);
    },
  });
};

// Hook for optimistic updates (useful for immediate UI feedback)
export const useOptimisticQmsUpdate = () => {
  const queryClient = useQueryClient();

  const updateEntryOptimistically = (id, updates) => {
    queryClient.setQueryData(QMS_QUERY_KEYS.entry(id), (oldData) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates, updatedAt: new Date().toISOString() };
    });
  };

  const rollbackOptimisticUpdate = (id, originalData) => {
    queryClient.setQueryData(QMS_QUERY_KEYS.entry(id), originalData);
  };

  return { updateEntryOptimistically, rollbackOptimisticUpdate };
};

// Prefetch hook for better UX
export const usePrefetchQmsEntry = () => {
  const queryClient = useQueryClient();

  const prefetchEntry = (id) => {
    queryClient.prefetchQuery({
      queryKey: QMS_QUERY_KEYS.entry(id),
      queryFn: () => qmsService.getEntryById(id),
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  return { prefetchEntry };
};

// Hook to invalidate all QMS related queries (useful for global refresh)
export const useInvalidateQmsQueries = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['qms'] });
  };

  const invalidateEntries = () => {
    queryClient.invalidateQueries({ queryKey: QMS_QUERY_KEYS.entries });
  };

  const invalidateEntry = (id) => {
    queryClient.invalidateQueries({ queryKey: QMS_QUERY_KEYS.entry(id) });
  };

  return { invalidateAll, invalidateEntries, invalidateEntry };
};