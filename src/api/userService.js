import api from './client.js';

// User management related API calls
export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    // For now, return from context/localStorage
    // In real app, this would be: return api.get('/user/me');
    const savedUser = localStorage.getItem('qms_user');
    if (savedUser) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
      return JSON.parse(savedUser);
    }
    throw new Error('No user found');
  },

  // Update user profile
  updateProfile: async (updates) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const savedUser = localStorage.getItem('qms_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('qms_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('User not found');
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data for demonstration
    return [
      {
        id: 1,
        username: 'MFakheem',
        email: 'mfakheem@company.com',
        role: 'admin',
        createdAt: '2024-01-15T10:00:00Z',
        lastLogin: '2025-07-28T21:33:04Z'
      },
      {
        id: 2,
        username: 'jdoe',
        email: 'john.doe@company.com',
        role: 'user',
        createdAt: '2024-02-20T14:30:00Z',
        lastLogin: '2025-07-27T16:45:22Z'
      },
      {
        id: 3,
        username: 'asmith',
        email: 'alice.smith@company.com',
        role: 'manager',
        createdAt: '2024-03-10T09:15:00Z',
        lastLogin: '2025-07-28T08:20:15Z'
      }
    ];
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newUser;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return { success: true, deletedUserId: userId };
  }
};

// Analytics and reporting API calls
export const analyticsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const qmsEntries = JSON.parse(localStorage.getItem("qmsEntries") || "[]");
    const sourcingEntries = JSON.parse(localStorage.getItem("sourcingEntries") || "[]");
    
    return {
      totalEntries: qmsEntries.length + sourcingEntries.length,
      activeEntries: qmsEntries.filter(e => e.status !== 'completed').length,
      completedEntries: qmsEntries.filter(e => e.status === 'completed').length,
      overdueEntries: qmsEntries.filter(e => {
        if (!e.dueDate) return false;
        return new Date(e.dueDate) < new Date();
      }).length,
      recentActivity: [
        ...qmsEntries.slice(-5).map(e => ({ ...e, type: 'QMS', source: 'Assignment' })),
        ...sourcingEntries.slice(-5).map(e => ({ ...e, type: 'Sourcing', source: 'Sourcing' }))
      ].sort((a, b) => new Date(b.timeStamp || b.createdAt) - new Date(a.timeStamp || a.createdAt))
    };
  },

  // Get performance metrics
  getPerformanceMetrics: async (dateRange = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock performance data
    return {
      averageProcessingTime: '2.5 days',
      completionRate: '85%',
      userPerformance: [
        { user: 'MFakheem', completed: 12, pending: 3, efficiency: '90%' },
        { user: 'jdoe', completed: 8, pending: 5, efficiency: '75%' },
        { user: 'asmith', completed: 15, pending: 2, efficiency: '95%' }
      ],
      monthlyTrends: [
        { month: 'Jan', completed: 45, created: 52 },
        { month: 'Feb', completed: 38, created: 41 },
        { month: 'Mar', completed: 52, created: 58 },
        { month: 'Apr', completed: 61, created: 64 },
        { month: 'May', completed: 48, created: 53 },
        { month: 'Jun', completed: 55, created: 59 },
        { month: 'Jul', completed: 42, created: 47 }
      ]
    };
  }
};

export { userService as default };
export { analyticsService };