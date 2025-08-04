import { createSlice } from '@reduxjs/toolkit';

// Initial state for QMS entries management
const initialState = {
  entries: [],
  currentEntry: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  error: null,
  selectedEntries: [],
};

const qmsSlice = createSlice({
  name: 'qms',
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
      state.error = null;
    },
    addEntry: (state, action) => {
      state.entries.unshift(action.payload);
    },
    updateEntry: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.entries.findIndex(entry => entry.id === id);
      if (index !== -1) {
        state.entries[index] = { ...state.entries[index], ...updates };
      }
      if (state.currentEntry && state.currentEntry.id === id) {
        state.currentEntry = { ...state.currentEntry, ...updates };
      }
    },
    removeEntry: (state, action) => {
      const id = action.payload;
      state.entries = state.entries.filter(entry => entry.id !== id);
      if (state.currentEntry && state.currentEntry.id === id) {
        state.currentEntry = null;
      }
      state.selectedEntries = state.selectedEntries.filter(entryId => entryId !== id);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleSelectedEntry: (state, action) => {
      const id = action.payload;
      const index = state.selectedEntries.indexOf(id);
      if (index === -1) {
        state.selectedEntries.push(id);
      } else {
        state.selectedEntries.splice(index, 1);
      }
    },
    selectAllEntries: (state) => {
      state.selectedEntries = state.entries.map(entry => entry.id);
    },
    clearSelectedEntries: (state) => {
      state.selectedEntries = [];
    },
  },
});

export const {
  setEntries,
  setCurrentEntry,
  addEntry,
  updateEntry,
  removeEntry,
  setFilters,
  clearFilters,
  setPagination,
  setLoading,
  setError,
  clearError,
  toggleSelectedEntry,
  selectAllEntries,
  clearSelectedEntries,
} = qmsSlice.actions;

// Selectors
export const selectEntries = (state) => state.qms.entries;
export const selectCurrentEntry = (state) => state.qms.currentEntry;
export const selectFilters = (state) => state.qms.filters;
export const selectPagination = (state) => state.qms.pagination;
export const selectQmsLoading = (state) => state.qms.loading;
export const selectQmsError = (state) => state.qms.error;
export const selectSelectedEntries = (state) => state.qms.selectedEntries;

// Filtered entries selector
export const selectFilteredEntries = (state) => {
  const { entries, filters } = state.qms;
  
  if (Object.keys(filters).length === 0) {
    return entries;
  }
  
  return entries.filter(entry => {
    // Apply filters
    if (filters.portalName && !entry.portalName?.toLowerCase().includes(filters.portalName.toLowerCase())) {
      return false;
    }
    if (filters.bidNumber && !entry.bidNumber?.toLowerCase().includes(filters.bidNumber.toLowerCase())) {
      return false;
    }
    if (filters.hunterName && !entry.hunterName?.toLowerCase().includes(filters.hunterName.toLowerCase())) {
      return false;
    }
    if (filters.fromDate && new Date(entry.date) < new Date(filters.fromDate)) {
      return false;
    }
    if (filters.toDate && new Date(entry.date) > new Date(filters.toDate)) {
      return false;
    }
    return true;
  });
};

export default qmsSlice.reducer;