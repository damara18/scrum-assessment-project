import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {styled} from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Styled card component with floating effect
const FloatingCard = styled(Card)(({theme}) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const adminCards = [
  { title: 'User Management', path: '/admin/users' },
  { title: 'Project Management', path: '/admin/projects' },
  { title: 'Sheet Management', path: '/admin/sheets' },
];

function AdminPage() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/")
  };
  
  return (
    <Container maxWidth="lg" sx={{py: 4}}>
      <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
        {/* Back Button */}
        <IconButton
          onClick={handleBack}
          sx={{
            mr: 2,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          <ArrowBackIcon fontSize="medium"/>
        </IconButton>
        
        <Typography variant="h3" component="h1">
          Admin Dashboard
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FloatingCard onClick={() => navigate(card.path)}>
              <CardContent sx={{flexGrow: 1}}>
                <Typography gutterBottom variant="h5" component="div">
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click to manage {card.title.toLowerCase()}
                </Typography>
              </CardContent>
            </FloatingCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AdminPage;