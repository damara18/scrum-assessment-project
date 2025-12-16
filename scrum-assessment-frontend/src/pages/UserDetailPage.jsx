import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { userApi } from '../api/user';

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details from API
  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userApi.getUser(userId);
      
      if (userData) {
        setUser(userData);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load user details. Please try again.';
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

  // Status chip color (you might want to add status field to your user model)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Role chip color
  const getRoleColor = (role) => {
    if (!role) return 'default';
    
    switch (role.role_name?.toLowerCase()) {
      case 'admin': return 'primary';
      case 'moderator': return 'secondary';
      case 'user': return 'info';
      default: return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
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

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          User not found
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
        justifyContent: 'space-between',
        mb: 4
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
          </Button>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {user.fullname || user.username}
          </Typography>
          {user.role && (
            <Chip
              label={user.role.role_name}
              color={getRoleColor(user.role)}
              size="small"
            />
          )}
          {/* Add status chip if you have status field */}
          {/* <Chip
            label={user.status || 'Active'}
            color={getStatusColor(user.status)}
            size="small"
          /> */}
        </Box>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          onClick={() => navigate(`/admin/edit-user/${user.id}`)}
        >
          Edit User
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - User Information */}
        <Grid item xs={12} md={8}>
          {/* User Profile Card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {user.fullname || 'N/A'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    @{user.username}
                  </Typography>
                  {user.role && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {user.role.description}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      Email Address
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      Member Since
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(user.created_at)}
                  </Typography>
                </Grid>

                {user.updated_at && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Last Updated
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user.updated_at)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Role Information Card */}
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Role Information
                </Typography>
              </Box>

              {user.role ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Role Name
                      </Typography>
                      <Chip
                        label={user.role.role_name}
                        color={getRoleColor(user.role)}
                        size="medium"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Role Description
                      </Typography>
                      <Typography variant="body1">
                        {user.role.description}
                      </Typography>
                    </Box>
                  </Grid>
                  {user.role.id && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Role ID
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {user.role.id}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No role assigned to this user
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Sidebar Information */}
        <Grid item xs={12} md={4}>
          {/* Account Details Card */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Account Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  User ID
                </Typography>
                <Typography variant="body1" fontFamily="monospace">
                  {user.id}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Username
                </Typography>
                <Typography variant="body1">
                  {user.username}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Role
                </Typography>
                {user.role ? (
                  <Chip
                    label={user.role.role_name}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No role assigned
                  </Typography>
                )}
              </Box>

              {/* Add status field if available */}
              {/* <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={user.status || 'Active'}
                  color={getStatusColor(user.status)}
                  size="small"
                />
              </Box> */}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Account Created
                </Typography>
                <Typography variant="body2">
                  {formatDate(user.created_at)}
                </Typography>
              </Box>

              {user.updated_at && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(user.updated_at)}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                  fullWidth
                >
                  Edit User
                </Button>
                
                {(!user.role || user.role.role_name !== 'ADMIN') && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={async () => {
                      try {
                        await userApi.updateUserRole(user.id, 'admin');
                        fetchUser(); // Refresh user data
                      } catch (error) {
                        console.error('Failed to update role:', error);
                      }
                    }}
                    fullWidth
                  >
                    Make Admin
                  </Button>
                )}
                
                {(!user.role || user.role.role_name !== 'MODERATOR') && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={async () => {
                      try {
                        await userApi.updateUserRole(user.id, 'moderator');
                        fetchUser(); // Refresh user data
                      } catch (error) {
                        console.error('Failed to update role:', error);
                      }
                    }}
                    fullWidth
                  >
                    Make Moderator
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserDetailPage;