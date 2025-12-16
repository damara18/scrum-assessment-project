import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { userApi } from '../api/user';
import { sheetApi } from '../api/sheet';
import { projectApi } from '../api/project';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // State for dropdown data
  const [users, setUsers] = useState([]);
  const [sheets, setSheets] = useState([]);
  
  // Selected values for autocomplete
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    moderator_id: '',
    sheet_id: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    moderator_id: '',
    sheet_id: ''
  });

  // Fetch users and sheets for dropdowns
  const fetchDropdownData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch users for project manager selection
      const usersResponse = await userApi.getModerators();
      const usersData = Array.isArray(usersResponse) ? usersResponse : [];
      
      // Filter users who can be project managers (adjust based on your requirements)
      const availableManagers = usersData.filter(user => 
        user.role?.role_name === 'ADMIN' || user.role?.role_name === 'MODERATOR' || user.role?.role_name === 'MANAGER'
      );
      setUsers(availableManagers);

      // Fetch sheets for sheet selection
      const sheetsResponse = await sheetApi.getSheetsAvailable();
      const sheetsData = Array.isArray(sheetsResponse) ? sheetsResponse : [];
      setSheets(sheetsData);

    } catch (error) {
      console.error('Failed to fetch dropdown data:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load dropdown data. Please try again.';
                          'Failed to load dropdown data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleManagerChange = (event, newValue) => {
    setSelectedManager(newValue);
    setFormData(prev => ({
      ...prev,
      moderator_id: newValue ? newValue.id.toString() : ''
    }));

    // Clear manager error when a selection is made
    if (errors.moderator_id) {
      setErrors(prev => ({
        ...prev,
        moderator_id: ''
      }));
    }
  };

  const handleSheetChange = (event, newValue) => {
    setSelectedSheet(newValue);
    setFormData(prev => ({
      ...prev,
      sheet_id: newValue ? newValue.id.toString() : ''
    }));

    // Clear sheet error when a selection is made
    if (errors.sheet_id) {
      setErrors(prev => ({
        ...prev,
        sheet_id: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Project Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Manager validation
    if (!formData.moderator_id) {
      newErrors.moderator_id = 'Please select a project moderator';
    }

    // Sheet validation (optional - remove if not required)
    if (!formData.sheet_id) {
      newErrors.sheet_id = 'Please select a sheet for this project';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Replace with your actual API endpoint
      await projectApi.createProject(formData);
      
      // Simulate API call
      

      // Success handling
      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        moderator_id: '',
        sheet_id: '',
        status: 'active'
      });
      setSelectedManager(null);
      setSelectedSheet(null);

      // Redirect after success
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1000);

    } catch (error) {
      console.error('Failed to create project:', error);
      setError(error.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        mb: 4
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/projects')}
          sx={{ 
            position: 'absolute',
            left: 0
          }}
        >
          Back to Projects
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold'
          }}
        >
          Create New Project
        </Typography>
      </Box>

      {/* Success Alert */}
      {success && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Alert severity="success" sx={{ maxWidth: 500, width: '100%' }}>
            Project created successfully! Redirecting to projects list...
          </Alert>
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Alert severity="error" sx={{ maxWidth: 500, width: '100%' }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Form Section - Centered with fixed width */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            width: '100%'
          }}
        >
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            {/* Project Name Field */}
            <TextField
              required
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              variant="outlined"
              placeholder="Enter project name"
            />

            {/* Description Field */}
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Project Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              variant="outlined"
              placeholder="Describe the project's purpose and objectives"
            />

            {/* Project Manager Autocomplete Dropdown */}
            <FormControl fullWidth error={!!errors.moderator_id}>
              <Autocomplete
                options={users}
                getOptionLabel={(option) => 
                  `${option.fullname || option.username} (${option.role?.role_name || 'No Role'})`
                }
                value={selectedManager}
                onChange={handleManagerChange}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Moderator"
                    error={!!errors.moderator_id}
                    helperText={errors.moderator_id}
                    placeholder="Search for a project moderator..."
                    required
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {option.fullname || option.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.email} • {option.role?.role_name || 'No Role'}
                      </Typography>
                    </Box>
                  </li>
                )}
                noOptionsText="No moderators found"
                loadingText="Loading moderators..."
              />
            </FormControl>

            {/* Sheet Selection Autocomplete Dropdown */}
            <FormControl fullWidth error={!!errors.sheet_id}>
              <Autocomplete
                options={sheets}
                getOptionLabel={(option) => 
                  `${option.sheet_filename} - ${option.description?.substring(0, 50)}${option.description?.length > 50 ? '...' : ''}`
                }
                value={selectedSheet}
                onChange={handleSheetChange}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Sheet"
                    error={!!errors.sheet_id}
                    helperText={errors.sheet_id || "Select a sheet to associate with this project"}
                    placeholder="Search for a sheet..."
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <DescriptionIcon sx={{ color: 'action.active', mr: 1 }} />
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {option.sheet_filename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.description?.substring(0, 80)}{option.description?.length > 80 ? '...' : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {option.fill_form_status ? 'Active' : 'Inactive'} • 
                        Created: {new Date(option.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </li>
                )}
                noOptionsText="No sheets found"
                loadingText="Loading sheets..."
              />
            </FormControl>

            {/* Submit Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              mt: 2 
            }}>
              <Button
                type="button"
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/admin/projects')}
                disabled={loading}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
                size="large"
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateProjectPage;