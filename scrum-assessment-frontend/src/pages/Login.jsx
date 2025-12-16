import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target
    setFormData({
      ...formData,
      [name]: name === 'remember' ? checked : value,
    })
  }
  
  const validate = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    dispatch(loginStart())
    try {
      const userData = await login({
        username: formData.username,
        password: formData.password,
      })
      dispatch(loginSuccess(userData))
      navigate('/admin')
    } catch (error) {
      dispatch(
        loginFailure(
          error.response?.data?.detail || 'Login failed. Please try again.'
        )
      )
      setErrors({
        form: error.response?.data?.detail || 'Login failed. Please try again.',
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {errors.form && (
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                color="primary"
                checked={formData.remember}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login