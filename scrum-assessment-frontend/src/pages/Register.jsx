import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
  Collapse,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { registerStart, registerSuccess, registerFailure } from '../store/authSlice'

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [registrationStatus, setRegistrationStatus] = useState({
    success: false,
    message: '',
    show: false
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  
  const validate = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    dispatch(registerStart())
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      dispatch(registerSuccess())
      setRegistrationStatus({
        success: true,
        message: 'Registration successful! You can now login.',
        show: true
      })
      // Clear form on success
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Registration failed. Please try again.'
      dispatch(registerFailure(errorMsg))
      setRegistrationStatus({
        success: false,
        message: errorMsg,
        show: true
      })
    }
  }
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        
        {/* Registration Status Alert */}
        <Collapse in={registrationStatus.show} sx={{ width: '100%', mt: 2 }}>
          <Alert
            severity={registrationStatus.success ? "success" : "error"}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setRegistrationStatus(prev => ({ ...prev, show: false }))
                  if (registrationStatus.success) {
                    navigate('/login')
                  }
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {registrationStatus.message}
            {registrationStatus.success && (
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ p: 0, textTransform: 'none' }}
                >
                  Go to Login Page
                </Button>
              </Box>
            )}
          </Alert>
        </Collapse>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {errors.form && !registrationStatus.show && (
            <Typography color="error" variant="body2">
              {errors.form}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage