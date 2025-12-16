import {
  Box,
  Button,
  Card,
  CardContent,
  Fade,
  Paper,
  Popper,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function FloatingAdminMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setOpen((prev) => !prev)
  }
  
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{
          borderRadius: '50%',
          width: 56,
          height: 56,
          minWidth: 0,
          boxShadow: 3,
        }}
      >
        Admin
      </Button>
      
      <Popper open={open} anchorEl={anchorEl} transition placement="top-end">
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
              <Card sx={{ minWidth: 200 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Admin Actions
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Button
                      component={Link}
                      to="/admin/create-admin"
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Create Admin
                    </Button>
                    <Button
                      component={Link}
                      to="/admin/create-moderator"
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Create Moderator
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}

export default FloatingAdminMenu