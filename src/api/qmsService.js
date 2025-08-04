import api from './client.js';

// QMS Entry related API calls
export const qmsService = {
  // Get all QMS entries
  getEntries: async (filters = {}) => {
    // For now, this will work with localStorage data
    // but can be easily replaced with actual API calls
    const assignmentData = localStorage.getItem("qmsEntries");
    const sourcingData = localStorage.getItem("sourcingEntries");
    
    let entries = [];
    
    if (assignmentData) {
      const assignmentEntries = JSON.parse(assignmentData).map(entry => ({
        ...entry,
        source: 'Assignment'
      }));
      entries = [...entries, ...assignmentEntries];
    }
    
    if (sourcingData) {
      const sourcingEntries = JSON.parse(sourcingData).map(entry => ({
        ...entry,
        source: 'Sourcing'
      }));
      entries = [...entries, ...sourcingEntries];
    }
    
    // Apply filters if provided
    if (filters.portalName) {
      entries = entries.filter(entry => 
        entry.portalName?.toLowerCase().includes(filters.portalName.toLowerCase())
      );
    }
    
    if (filters.bidNumber) {
      entries = entries.filter(entry => 
        entry.bidNumber?.toLowerCase().includes(filters.bidNumber.toLowerCase())
      );
    }
    
    if (filters.hunterName) {
      entries = entries.filter(entry => 
        entry.hunterName?.toLowerCase().includes(filters.hunterName.toLowerCase())
      );
    }
    
    if (filters.fromDate) {
      entries = entries.filter(entry => new Date(entry.date) >= new Date(filters.fromDate));
    }
    
    if (filters.toDate) {
      entries = entries.filter(entry => new Date(entry.date) <= new Date(filters.toDate));
    }
    
    // Simulate network delay for realistic loading states
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return entries;
  },

  // Get single QMS entry by ID
  getEntryById: async (id) => {
    // Check Assignment data first
    const assignmentData = localStorage.getItem("qmsEntries");
    if (assignmentData) {
      const assignmentEntries = JSON.parse(assignmentData);
      const found = assignmentEntries.find(item => item.id === id);
      if (found) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        return { ...found, source: 'Assignment' };
      }
    }

    // Check Sourcing data
    const sourcingData = localStorage.getItem("sourcingEntries");
    if (sourcingData) {
      const sourcingEntries = JSON.parse(sourcingData);
      const found = sourcingEntries.find(item => item.id === id);
      if (found) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        return { ...found, source: 'Sourcing' };
      }
    }

    throw new Error(`No entry found for QMS ID: ${id}`);
  },

  // Create new QMS entry
  createEntry: async (entryData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newEntry = {
      ...entryData,
      id: Date.now().toString(),
      timeStamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // For now, save to localStorage (in real app, this would be an API call)
    const existingData = localStorage.getItem("qmsEntries");
    const entries = existingData ? JSON.parse(existingData) : [];
    entries.push(newEntry);
    localStorage.setItem("qmsEntries", JSON.stringify(entries));

    return newEntry;
  },

  // Update existing QMS entry
  updateEntry: async (id, updates) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));

    // Update in Assignment data
    const assignmentData = localStorage.getItem("qmsEntries");
    if (assignmentData) {
      const entries = JSON.parse(assignmentData);
      const index = entries.findIndex(item => item.id === id);
      if (index !== -1) {
        entries[index] = { 
          ...entries[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        localStorage.setItem("qmsEntries", JSON.stringify(entries));
        return entries[index];
      }
    }

    // Update in Sourcing data
    const sourcingData = localStorage.getItem("sourcingEntries");
    if (sourcingData) {
      const entries = JSON.parse(sourcingData);
      const index = entries.findIndex(item => item.id === id);
      if (index !== -1) {
        entries[index] = { 
          ...entries[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        localStorage.setItem("sourcingEntries", JSON.stringify(entries));
        return entries[index];
      }
    }

    throw new Error(`Entry with ID ${id} not found`);
  },

  // Delete QMS entry
  deleteEntry: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    // Try to delete from Assignment data
    const assignmentData = localStorage.getItem("qmsEntries");
    if (assignmentData) {
      const entries = JSON.parse(assignmentData);
      const filtered = entries.filter(item => item.id !== id);
      if (filtered.length < entries.length) {
        localStorage.setItem("qmsEntries", JSON.stringify(filtered));
        return { success: true, source: 'Assignment' };
      }
    }

    // Try to delete from Sourcing data
    const sourcingData = localStorage.getItem("sourcingEntries");
    if (sourcingData) {
      const entries = JSON.parse(sourcingData);
      const filtered = entries.filter(item => item.id !== id);
      if (filtered.length < entries.length) {
        localStorage.setItem("sourcingEntries", JSON.stringify(filtered));
        return { success: true, source: 'Sourcing' };
      }
    }

    throw new Error(`Entry with ID ${id} not found`);
  }
};

export default qmsService;