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
  Link,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { sheetApi } from '../api/sheet';

const SheetListPage = () => {
  const navigate = useNavigate();
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('sheet_filename');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch sheets from API
  const fetchSheets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await sheetApi.getSheets();
      
      // Your API returns a direct array of sheets
      if (Array.isArray(response)) {
        setSheets(response);
      } else {
        console.warn('Unexpected API response format:', response);
        setSheets([]);
        setError('Unexpected data format received from server');
      }
    } catch (error) {
      console.error('Failed to fetch sheets:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to load sheets. Please try again.';
      setError(errorMessage);
      setSheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  // Handle sheet deletion
  const handleDeleteSheet = async (sheetId) => {
    if (window.confirm('Are you sure you want to delete this sheet?')) {
      try {
        await sheetApi.deleteSheet(sheetId);
        
        // Remove from local state
        setSheets(prevSheets => 
          Array.isArray(prevSheets) 
            ? prevSheets.filter(sheet => sheet.id !== sheetId)
            : []
        );
        
        setSuccessMessage('Sheet deleted successfully');
      } catch (error) {
        console.error('Failed to delete sheet:', error);
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            'Failed to delete sheet. Please try again.';
        setError(errorMessage);
        fetchSheets(); // Refresh data on error
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

  // Ensure sheets is always an array before filtering
  const filteredSheets = Array.isArray(sheets) 
    ? sheets.filter(sheet => {
        if (!sheet || typeof sheet !== 'object') return false;
        
        const searchableFields = ['sheet_filename', 'description', 'form_link'];
        return searchableFields.some(field => 
          sheet[field] && 
          sheet[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Sort sheets
  const sortedSheets = filteredSheets.sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';
    
    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const paginatedSheets = sortedSheets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Status chip for fill form status
  const getStatusChip = (sheet) => (
    <Chip
      icon={sheet.fill_form_status ? <CheckCircleIcon /> : <CancelIcon />}
      label={sheet.fill_form_status ? 'Active' : 'Inactive'}
      color={sheet.fill_form_status ? 'success' : 'default'}
      size="small"
      variant={sheet.fill_form_status ? 'filled' : 'outlined'}
    />
  );

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
          Sheet Management
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
          placeholder="Search sheets by filename, description, or link..."
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
            onClick={() => navigate('/admin/create-sheet')}
          >
            Add New Sheet
          </Button>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchSheets} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Sheet Table */}
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="sheet table">
            <TableHead>
              <TableRow>
                {[
                  { id: 'sheet_filename', label: 'Filename' },
                  { id: 'description', label: 'Description' },
                  { id: 'form_link', label: 'Form Link' },
                  { id: 'fill_form_status', label: 'Status' },
                  { id: 'created_at', label: 'Created At' },
                  { id: 'updated_at', label: 'Updated At' },
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
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedSheets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    {searchTerm ? 'No sheets match your search' : 'No sheets found'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSheets.map((sheet) => (
                  <TableRow hover key={sheet.id}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {sheet.sheet_filename}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {sheet.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={sheet.form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        <LinkIcon fontSize="small" />
                        Open Form
                      </Link>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(sheet)}
                    </TableCell>
                    <TableCell>
                      {formatDate(sheet.created_at)}
                    </TableCell>
                    <TableCell>
                      {formatDate(sheet.updated_at)}
                    </TableCell>
                    <TableCell align="right" sx={{ minWidth: 180 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            onClick={() => navigate(`/admin/edit-sheet/${sheet.id}`)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => handleDeleteSheet(sheet.id)}
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
          count={filteredSheets.length}
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

export default SheetListPage;