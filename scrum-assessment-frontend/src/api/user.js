import api from "./api.js";

export const getCurrentUser = async () => {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  
  try {
    const response = await api.get('/api/v1/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    localStorage.removeItem('access_token')
    return null
  }
}

// User API endpoints
export const userApi = {
  // Get all users
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/api/v1/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getModerators: async () => {
    try {
      const response = await api.get('/api/v1/admin/moderators');
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // Get single user by ID
  getUser: async (userId) => {
    try {
      const response = await api.get(`/api/v1/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      console.log('Creating user with data:', userData);
      const response = await api.post('/api/v1/admin/users/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/v1/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.patch(`/api/v1/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/v1/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;