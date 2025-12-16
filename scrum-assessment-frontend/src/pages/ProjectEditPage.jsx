import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const ProjectEditPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    moderatorId: '',
    sheetId: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    moderatorId: '',
    sheetId: ''
  });

  // Fetch project details and dropdown data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch project details
      const projectData = await projectApi.getProject(projectId);
      
      if (projectData) {
        setFormData({
          name: projectData.name || '',
          description: projectData.description || '',
          moderatorId: projectData.moderator?.id?.toString() || '',
          sheetId: projectData.sheet?.id?.toString() || '',
          status: projectData.status || 'active'
        });

        // Set selected manager and sheet objects for autocomplete
        if (projectData.moderator) {
          setSelectedManager(projectData.moderator);
        }
        if (projectData.sheet) {
          setSelectedSheet(projectData.sheet);
        }
      } else {
        setError('Project not found');
      }

      // Fetch users for project manager selection
      const usersResponse = await userApi.getModerators();
      const usersData = Array.isArray(usersResponse) ? usersResponse : [];
      
      // Filter users who can be project managers
      const availableManagers = usersData.filter(user => 
        user.role?.role_name === 'ADMIN' || user.role?.role_name === 'MODERATOR' || user.role?.role_name === 'MANAGER'
      );
      setUsers(availableManagers);

      // Fetch sheets for sheet selection
      const sheetsResponse = await sheetApi.getSheetsAvailable();
      const sheetsData = Array.isArray(sheetsResponse) ? sheetsResponse : [];
      setSheets(sheetsData);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load project data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

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
      moderatorId: newValue ? newValue.id.toString() : ''
    }));

    // Clear manager error when a selection is made
    if (errors.moderatorId) {
      setErrors(prev => ({
        ...prev,
        moderatorId: ''
      }));
    }
  };

  const handleSheetChange = (event, newValue) => {
    setSelectedSheet(newValue);
    setFormData(prev => ({
      ...prev,
      sheetId: newValue ? newValue.id.toString() : ''
    }));

    // Clear sheet error when a selection is made
    if (errors.sheetId) {
      setErrors(prev => ({
        ...prev,
        sheetId: ''
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
    if (!formData.moderatorId) {
      newErrors.moderatorId = 'Please select a project manager';
    }

    // Sheet validation
    if (!formData.sheetId) {
      newErrors.sheetId = 'Please select a sheet for this project';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      await projectApi.updateProject(projectId, formData);

      // Success handling
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/admin/projects/${projectId}`);
      }, 500);

    } catch (error) {
      console.error('Failed to update project:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to update project. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(`/admin/projects/${projectId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Typography>Loading project data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && !formData.name) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/projects')}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/admin/projects/${projectId}`)}
          >
            Back to Project
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Edit Project
          </Typography>
          {formData.name && (
            <Typography variant="h6" color="text.secondary">
              {formData.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Project updated successfully! Redirecting...
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Form Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2
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
          noValidate
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
            disabled={saving}
            variant="outlined"
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
            disabled={saving}
            variant="outlined"
          />

          {/* Project Manager Autocomplete Dropdown */}
          <FormControl fullWidth error={!!errors.moderatorId}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => 
                `${option.fullname || option.username} (${option.role?.role_name || 'No Role'})`
              }
              value={selectedManager}
              onChange={handleManagerChange}
              disabled={saving}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project Manager"
                  error={!!errors.moderatorId}
                  helperText={errors.moderatorId}
                  placeholder="Search for a project manager..."
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
              noOptionsText="No managers found"
              loadingText="Loading managers..."
            />
          </FormControl>

          {/* Sheet Selection Autocomplete Dropdown */}
          <FormControl fullWidth error={!!errors.sheetId}>
            <Autocomplete
              options={sheets}
              getOptionLabel={(option) => 
                `${option.sheet_filename} - ${option.description?.substring(0, 50)}${option.description?.length > 50 ? '...' : ''}`
              }
              value={selectedSheet}
              onChange={handleSheetChange}
              disabled={saving}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Project Sheet"
                  error={!!errors.sheetId}
                  helperText={errors.sheetId || "Select a sheet to associate with this project"}
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
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider'
          }}>
            <Button
              type="button"
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={saving}
              size="large"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={saving}
              size="large"
              sx={{ minWidth: 140 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectEditPage;