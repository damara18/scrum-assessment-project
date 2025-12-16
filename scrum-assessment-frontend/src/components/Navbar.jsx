import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  styled,
  Box
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { logout as apiLogout } from '../api/auth'

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  margin: theme.spacing(0, 1.5),
  '&.active': {
    fontWeight: 'bold',
    borderBottom: '2px solid white',
  },
}))

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      await apiLogout()
      dispatch(logout())
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <Typography
              variant="h6"
              noWrap
              component={NavLink}
              to="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                '&.active': {
                  borderBottom: '2px solid white',
                },
              }}
            >
              SCRAP
            </Typography>
            
            {isAuthenticated && user?.role?.role_name === 'ADMIN' && (
              <StyledNavLink
                to="/admin"
                sx={{
                  ml: 10, // Adds space between app name and admin link
                  fontSize: '1rem',
                  letterSpacing: '0.02857em',
                }}
              >
                Admin
              </StyledNavLink>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 1 }} /> {/* This pushes other items to the right */}
          
          {/* Right-aligned navigation items */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isAuthenticated ? (
              <>
                <StyledNavLink to="/register">
                  Register
                </StyledNavLink>
                <StyledNavLink to="/login">
                  Login
                </StyledNavLink>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar