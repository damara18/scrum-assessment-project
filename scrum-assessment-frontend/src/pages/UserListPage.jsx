import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { userApi } from '../api/user';

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getUsers();
      
      // Your API returns a direct array of users
      if (Array.isArray(response)) {
        setUsers(response);
      } else {
        console.warn('Unexpected API response format:', response);
        setUsers([]);
        setError('Unexpected data format received from server');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load users. Please try again.';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        
        // Remove from local state
        setUsers(prevUsers => 
          Array.isArray(prevUsers) 
            ? prevUsers.filter(user => user.id !== userId)
            : []
        );
        
        setSuccessMessage('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            'Failed to delete user. Please try again.';
        setError(errorMessage);
        fetchUsers(); // Refresh data on error
      }
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole, e) => {
    e.stopPropagation();
    try {
      // Optimistic UI update - update the role object
      setUsers(prevUsers => 
        Array.isArray(prevUsers) 
          ? prevUsers.map(user => 
              user.id === userId ? { 
                ...user, 
                role: { 
                  id: newRole === 'admin' ? 1 : 2, // Adjust role IDs based on your backend
                  role_name: newRole.toUpperCase(),
                  description: newRole === 'admin' ? 'Administrator' : 'Moderator'
                }
              } : user
            )
          : []
      );

      await userApi.updateUserRole(userId, newRole);
      setSuccessMessage(`User role updated to ${newRole} successfully`);
    } catch (error) {
      console.error('Failed to update role:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to update user role. Please try again.';
      setError(errorMessage);
      fetchUsers(); // Revert by refreshing data
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setError(null);
  };

  // Sorting logic
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Ensure users is always an array before filtering
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => {
        if (!user || typeof user !== 'object') return false;
        
        const searchableFields = ['username', 'email', 'fullname', 'role'];
        return searchableFields.some(field => {
          if (field === 'role') {
            // Search in role_name if role exists
            return user.role && user.role.role_name && 
                   user.role.role_name.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return user[field] && 
                 user[field].toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      })
    : [];

  // Sort users - handle nested role object
  const sortedUsers = filteredUsers.sort((a, b) => {
    let aValue, bValue;

    if (orderBy === 'role') {
      // Sort by role name
      aValue = a.role?.role_name || '';
      bValue = b.role?.role_name || '';
    } else {
      aValue = a[orderBy] || '';
      bValue = b[orderBy] || '';
    }
    
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Helper functions for styling
  const getRoleColor = (role) => {
    if (!role) return 'default';
    
    switch (role.role_name?.toLowerCase()) {
      case 'admin': return 'primary';
      case 'moderator': return 'secondary';
      case 'user': return 'info';
      default: return 'default';
    }
  };

  const getRoleDisplayName = (role) => {
    if (!role) return 'No Role';
    return role.role_name || 'No Role';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        mb: 4 
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ position: 'absolute', left: 0 }}
        >
          Back to Admin
        </Button>
        <Typography
          variant="h3"
          component="h1"
          sx={{ width: '100%', textAlign: 'center' }}
        >
          User Management
        </Typography>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Search and Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users by username, email, fullname, or role..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250, flexGrow: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/create-user')}
          >
            Add New User
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchUsers} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* User Table */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="user table">
            <TableHead>
              <TableRow>
                {[
                  { id: 'username', label: 'Username' },
                  { id: 'email', label: 'Email' },
                  { id: 'fullname', label: 'Full Name' },
                  { id: 'role', label: 'Role' },
                  { id: 'created_at', label: 'Created At' },
                  { id: 'actions', label: 'Actions', align: 'right' },
                ].map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align || 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.id !== 'actions' ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    {searchTerm ? 'No users match your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow 
                    hover 
                    key={user.id}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {user.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.fullname || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getRoleDisplayName(user.role)} 
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 200 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {/* Only show role change buttons if user doesn't already have that role */}
                        {(!user.role || user.role.role_name !== 'ADMIN') && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={(e) => handleRoleChange(user.id, 'admin', e)}
                            sx={{ textTransform: 'none' }}
                          >
                            Make Admin
                          </Button>
                        )}
                        {(!user.role || user.role.role_name !== 'MODERATOR') && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={(e) => handleRoleChange(user.id, 'moderator', e)}
                            sx={{ textTransform: 'none' }}
                          >
                            Make Moderator
                          </Button>
                        )}
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(user.id);
                            }}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Container>
  );
};

export default UserListPage;