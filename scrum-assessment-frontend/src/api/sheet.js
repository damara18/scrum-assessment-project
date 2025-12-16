import api from './api';

// Sheet API endpoints
export const sheetApi = {
  // Get all sheets
  getSheets: async (params = {}) => {
    try {
      const response = await api.get('/api/v1/admin/sheets', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
    // Get all sheets
  getSheetsAvailable: async (params = {}) => {
    try {
      const response = await api.get('/api/v1/admin/sheets/available', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single sheet by ID
  getSheet: async (sheetId) => {
    try {
      const response = await api.get(`/api/v1/admin/sheets/${sheetId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new sheet
  createSheet: async (sheetData) => {
    try {
      const response = await api.post('/api/v1/admin/sheets', sheetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update sheet
  updateSheet: async (sheetId, sheetData) => {
    try {
      const response = await api.put(`/api/v1/admin/sheets/${sheetId}`, sheetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete sheet
  deleteSheet: async (sheetId) => {
    try {
      const response = await api.delete(`/api/v1/admin/sheets/${sheetId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default sheetApi;