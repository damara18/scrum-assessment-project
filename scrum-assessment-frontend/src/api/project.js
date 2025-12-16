import api from './api';

// Project API endpoints
export const projectApi = {
  // Get all projects
  getProjects: async (params = {}) => {
    try {
      const response = await api.get('/api/v1/admin/projects', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProject: async (projectId) => {
    try {
      const response = await api.get(`/api/v1/admin/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single project by ID
  getProjectDetail: async (projectId) => {
    try {
      const response = await api.get(`/api/v1/admin/projects/${projectId}/detail`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/api/v1/admin/projects', projectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const data = {...projectData, 'moderator_id': projectData.moderatorId, 'sheet_id': projectData.sheetId};
      const response = await api.put(`/api/v1/admin/projects/${projectId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/api/v1/admin/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  calculateProject: async (projectId) => {
    try {
      const response = await api.get(`/api/v1/admin/projects/${projectId}/calculate-scores`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default projectApi;