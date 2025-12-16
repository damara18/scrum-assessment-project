import { Box, Container, Typography } from '@mui/material'
import { useSelector } from 'react-redux'

function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome {isAuthenticated ? user?.username : 'Guest'}
        </Typography>
        <Typography variant="body1">
          {isAuthenticated
            ? 'You are now logged in to the application.'
            : 'Please login or register to access all features.'}
        </Typography>
      </Box>
    </Container>
  )
}

export default Home