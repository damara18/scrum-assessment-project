import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputAdornment,
  IconButton
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {useState} from 'react';

function CreateAdminPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Typically you would dispatch an action to your backend here
  };
  
  return (
    <Container maxWidth="md" sx={{py: 4}}>
      {/* Header with centered title */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        mb: 4
      }}>
        <Button
          startIcon={<ArrowBackIcon/>}
          onClick={() => navigate('/admin')}
          sx={{position: 'absolute', left: 0}}
        >
          Back to Admin
        </Button>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            width: '100%',
            textAlign: 'center',
            fontSize: {xs: '1.8rem', sm: '2.4rem'} // Responsive font size
          }}
        >
          Create New Admin
        </Typography>
      </Box>
      
      {/* Form Section */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 1,
          backgroundColor: 'background.paper'
        }}
      >
        <Grid container spacing={3}>
          {/* Username Field */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  autoComplete: 'new-username'
                }}
              />
            </FormControl>
          </Grid>
          
          {/* Email Field */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  autoComplete: 'new-email'
                }}
              />
            </FormControl>
          </Grid>
          
          {/* Full Name Field */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  autoComplete: 'new-name'
                }}
              />
            </FormControl>
          </Grid>
          
          {/* Password Field */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  autoComplete: 'new-password',
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </Grid>
          
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Create Admin Account
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default CreateAdminPage;