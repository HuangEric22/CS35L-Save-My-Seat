import React, { useState } from 'react';
import { useLogin } from './hooks/useLogin';
import { Link } from 'react-router-dom'; // Import Link


import { ColorModeContext } from './theme'; 
import { TextField, Button, Card, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin(); // Assuming error state holds the error message

  const handleLogin = async (event) => {
    event.preventDefault();
    await login(email, password);
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            sx={{ mb: 2 }}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            sx={{ mb: 2 }}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            sx={{ mr: 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          
          <Typography variant="body1" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </Typography>
        </form>
      </Card>
    </Container>
  );
};

export default Login;