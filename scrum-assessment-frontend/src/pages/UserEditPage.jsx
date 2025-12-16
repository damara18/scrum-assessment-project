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
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { userApi } from '../api/user';

const UserEditPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '', // Empty by default for edits
    role: 'user' // Default role
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    fullname: '',
    password: ''
  });

  // Fetch user details from API
  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await userApi.getUser(userId);
      
      if (userData) {
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          fullname: userData.fullname || '',
          password: '', // Don't pre-fill password for security
          role: userData.role?.role_name?.toLowerCase() || 'user'
        });
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load user data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

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

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Full name validation (optional in your API, but we'll keep it required in form)
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    // Password validation (only if provided)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This is crucial to prevent default form submission
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare data for update (exclude password if empty)
      const updateData = {
        username: formData.username,
        email: formData.email,
        fullname: formData.fullname,
        role: formData.role
      };

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userApi.updateUser(userId, updateData);

      // Success handling
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate(`/admin/users/${userId}`);
      }, 500);

    } catch (error) {
      console.error('Failed to update user:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to update user. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent any default behavior
    navigate(`/admin/users/${userId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Typography>Loading user data...</Typography>
        </Box>
      </Container>
    );
  }

  if (error && !formData.username) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/users')}>
          Back to Users
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
        justifyContent: 'center',
        position: 'relative',
        mb: 4
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/admin/users/${userId}`)}
          sx={{ 
            position: 'absolute',
            left: 0
          }}
        >
          Back to User
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold'
          }}
        >
          Edit User
        </Typography>
      </Box>

      {/* Success Alert */}
      {success && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Alert severity="success" sx={{ maxWidth: 500, width: '100%' }}>
            User updated successfully! Redirecting...
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
            noValidate // This prevents browser validation which might cause issues
          >
            {/* Username Field */}
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={saving}
              variant="outlined"
            />

            {/* Email Field */}
            <TextField
              required
              fullWidth
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={saving}
              variant="outlined"
            />

            {/* Full Name Field */}
            <TextField
              required
              fullWidth
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              error={!!errors.fullname}
              helperText={errors.fullname}
              disabled={saving}
              variant="outlined"
            />

            {/* Password Field (Optional for edits) */}
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password || "Leave blank to keep current password"}
              disabled={saving}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={saving}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* Role Field */}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleInputChange}
                disabled={saving}
                variant="outlined"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            {/* Submit Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              mt: 2 
            }}>
              <Button
                type="button" // Explicitly set to button to prevent form submission
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                disabled={saving}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit" // This should be submit to trigger form submission
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
      </Box>
    </Container>
  );
};

export default UserEditPage;