import React, { useState, useContext } from 'react';
import { 
  Box, Typography, Container, Paper,
  TextField, Button, Alert
} from '@mui/material';
import { AuthContext } from '../../auth/context/AuthContext';
import { userApi } from '../../../services/userApi';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Failed to retrieve user information');
      return;
    }
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await userApi.updateUsername(user.id, username);
      setSuccess('Username updated successfully!');
      
      // Update global user state
      if (setUser && response) {
        setUser({
          ...user,
          username: response.username
        });
      }
    } catch (err: any) {
      setError(err?.error || 'Failed to update username, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Profile
        </Typography>

        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
              disabled={isSubmitting}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || username === user?.username || !username.trim()}
            >
              {isSubmitting ? 'Updating...' : 'Update Username'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;