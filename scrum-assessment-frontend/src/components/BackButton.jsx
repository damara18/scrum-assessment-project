import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function BackButton({ to, label = 'Back' }) {
  const navigate = useNavigate();
  
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(to || -1)}  // Goes to specified route or back in history
      sx={{ mr: 2 }}
    >
      {label}
    </Button>
  );
}

export default BackButton;