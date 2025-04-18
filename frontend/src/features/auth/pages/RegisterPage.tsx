import { Box, Typography, Container } from '@mui/material';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
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
          Join SpinArchive
        </Typography>
        <RegisterForm />
      </Box>
    </Container>
  );
};

export default RegisterPage;