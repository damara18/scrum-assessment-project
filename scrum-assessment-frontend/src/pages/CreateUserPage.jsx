import React, { useState } from 'react';
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
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import userApi from '../api/user';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    role: '',
    status: ''
  });

  const handleChange = (e) => {
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

    // Full name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await userApi.createUser(formData);

      // Success handling
      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        fullname: '',
        password: '',
        role: 'user',
        status: 'active'
      });

      // Redirect after success
      setTimeout(() => {
        navigate('/admin/users');
      }, 1000);

    } catch (error) {
      console.error('Failed to create user:', error);
      setError(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
          onClick={() => navigate('/admin/users')}
          sx={{ 
            position: 'absolute',
            left: 0
          }}
        >
          Back to Users
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 'bold'
          }}
        >
          Create New User
        </Typography>
      </Box>

      {/* Success Alert */}
      {success && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Alert severity="success" sx={{ maxWidth: 500, width: '100%' }}>
            User created successfully! Redirecting to user list...
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
            {/* Username Field */}
            <TextField
              required
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading}
              variant="outlined"
              InputProps={{
                autoComplete: 'new-username'
              }}
            />

            {/* Email Field */}
            <TextField
              required
              fullWidth
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              variant="outlined"
              InputProps={{
                autoComplete: 'new-email'
              }}
            />

            {/* Full Name Field */}
            <TextField
              required
              fullWidth
              label="Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              error={!!errors.fullname}
              helperText={errors.fullname}
              disabled={loading}
              variant="outlined"
              InputProps={{
                autoComplete: 'new-name'
              }}
            />

            {/* Password Field */}
            <TextField
              required
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              variant="outlined"
              InputProps={{
                autoComplete: 'new-password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={loading}
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
                onChange={handleChange}
                disabled={loading}
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
                type="button"
                variant="outlined"
                onClick={() => navigate('/admin/users')}
                disabled={loading}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="large"
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateUserPage;