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
  Snackbar,
  Link
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { projectApi } from '../api/project';

const ProjectListPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch projects from API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getProjects();
      
      // Your API returns a direct array of projects
      if (Array.isArray(response)) {
        setProjects(response);
      } else {
        console.warn('Unexpected API response format:', response);
        setProjects([]);
        setError('Unexpected data format received from server');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load projects. Please try again.';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.deleteProject(projectId);
        
        // Remove from local state
        setProjects(prevProjects => 
          Array.isArray(prevProjects) 
            ? prevProjects.filter(project => project.id !== projectId)
            : []
        );
        
        setSuccessMessage('Project deleted successfully');
      } catch (error) {
        console.error('Failed to delete project:', error);
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            'Failed to delete project. Please try again.';
        setError(errorMessage);
        fetchProjects(); // Refresh data on error
      }
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

  // Ensure projects is always an array before filtering
  const filteredProjects = Array.isArray(projects) 
    ? projects.filter(project => {
        if (!project || typeof project !== 'object') return false;
        
        const searchableFields = ['name', 'description'];
        return searchableFields.some(field => 
          project[field] && 
          project[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        // Search in moderator name
        (project.moderator && (
          project.moderator.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.moderator.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        // Search in sheet filename
        (project.sheet && project.sheet.sheet_filename?.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    : [];

  // Sort projects - handle nested objects
  const sortedProjects = filteredProjects.sort((a, b) => {
    let aValue, bValue;

    if (orderBy === 'moderator') {
      // Sort by moderator username
      aValue = a.moderator?.username || '';
      bValue = b.moderator?.username || '';
    } else if (orderBy === 'sheet') {
      // Sort by sheet filename
      aValue = a.sheet?.sheet_filename || '';
      bValue = b.sheet?.sheet_filename || '';
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
  const paginatedProjects = sortedProjects.slice(
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          Project Management
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
          placeholder="Search projects by name, description, moderator, or sheet..."
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
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/create-project')}
          >
            Add New Project
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchProjects} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Project Table */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="project table">
            <TableHead>
              <TableRow>
                {[
                  { id: 'name', label: 'Project Name' },
                  { id: 'description', label: 'Description' },
                  { id: 'moderator', label: 'Moderator' },
                  { id: 'sheet', label: 'Sheet' },
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
              ) : paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    {searchTerm ? 'No projects match your search' : 'No projects found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project) => (
                  <TableRow 
                    hover 
                    key={project.id}
                    onClick={() => navigate(`/admin/projects/${project.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {project.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {project.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {project.moderator ? (
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {project.moderator.fullname || project.moderator.username}
                          </Typography>
                          <Chip
                            label={getRoleDisplayName(project.moderator.role)}
                            color={getRoleColor(project.moderator.role)}
                            size="small"
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No moderator assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.sheet ? (
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {project.sheet.sheet_filename}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <LinkIcon fontSize="small" color="action" />
                            <Link
                              href={project.sheet.form_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                fontSize: '0.75rem',
                                textDecoration: 'none',
                                '&:hover': {
                                  textDecoration: 'underline'
                                }
                              }}
                            >
                              Open Form
                            </Link>
                          </Box>
                          <Chip
                            label={project.sheet.fill_form_status ? 'Active' : 'Inactive'}
                            color={project.sheet.fill_form_status ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No sheet assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(project.created_at)}
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/edit-project/${project.id}`);
                            }}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
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
          count={filteredProjects.length}
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

export default ProjectListPage;