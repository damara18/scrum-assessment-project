import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { sheetApi } from '../api/sheet';

const CreateSheetPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    sheet_filename: '',
    description: '',
    form_link: '',
    fill_form_status: false
  });

  const [errors, setErrors] = useState({
    sheet_filename: '',
    description: '',
    form_link: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Sheet Filename validation
    if (!formData.sheet_filename.trim()) {
      newErrors.sheet_filename = 'Sheet filename is required';
    } else if (formData.sheet_filename.length < 2) {
      newErrors.sheet_filename = 'Sheet filename must be at least 2 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Form Link validation
    if (!formData.form_link.trim()) {
      newErrors.form_link = 'Form link is required';
    } else if (!isValidUrl(formData.form_link)) {
      newErrors.form_link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sheetApi.createSheet(formData);

      // Success handling
      setSuccess(true);
      setFormData({
        sheet_filename: '',
        description: '',
        form_link: '',
        fill_form_status: false
      });

      // Redirect after success
      setTimeout(() => {
        navigate('/admin/sheets');
      }, 1000);

    } catch (error) {
      console.error('Failed to create sheet:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to create sheet. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/admin/sheets');
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
          onClick={() => navigate('/admin/sheets')}
          sx={{ 
            position: 'absolute',
            left: 0
          }}
        >
          Back to Sheets
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold'
          }}
        >
          Create New Sheet
        </Typography>
      </Box>

      {/* Success Alert */}
      {success && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Alert severity="success" sx={{ maxWidth: 500, width: '100%' }}>
            Sheet created successfully! Redirecting to sheets list...
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
            noValidate
          >
            {/* Sheet Filename Field */}
            <TextField
              required
              fullWidth
              label="Sheet Filename"
              name="sheet_filename"
              value={formData.sheet_filename}
              onChange={handleInputChange}
              error={!!errors.sheet_filename}
              helperText={errors.sheet_filename || "e.g., monthly_report_2024 or data_export"}
              disabled={loading}
              variant="outlined"
              placeholder="Enter sheet filename"
            />

            {/* Description Field */}
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Sheet Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              variant="outlined"
              placeholder="Describe what this sheet is used for and what data it contains"
            />

            {/* Form Link Field */}
            <TextField
              required
              fullWidth
              label="Form Link"
              name="form_link"
              value={formData.form_link}
              onChange={handleInputChange}
              error={!!errors.form_link}
              helperText={errors.form_link || "Enter the full URL to the form"}
              disabled={loading}
              variant="outlined"
              placeholder="https://forms.google.com/your-form-link"
              InputProps={{
                startAdornment: <LinkIcon sx={{ color: 'action.active', mr: 1 }} />
              }}
            />

            {/* Fill Form Status Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="fill_form_status"
                  checked={formData.fill_form_status}
                  onChange={handleInputChange}
                  disabled={loading}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Fill Form Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enable this if the form is currently accepting responses
                  </Typography>
                </Box>
              }
              sx={{ 
                mt: 1,
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  flex: 1
                }
              }}
            />

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
                onClick={handleCancel}
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
                {loading ? 'Creating...' : 'Create Sheet'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateSheetPage;