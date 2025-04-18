import { Box, Typography, Container } from '@mui/material';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ mb: 4 }}
        >
          Welcome to SpinArchive
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default LoginPage;