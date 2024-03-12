import React, { useState } from 'react';
import { Box, IconButton} from '@mui/material';
import { useLogin } from './hooks/useLogin';
import { Link } from 'react-router-dom'; // Import Link
import { useContext } from "react";
import { ColorModeContext, tokens } from "./theme";
import { GiPolarBear, GiTrojanHorse } from "react-icons/gi";

import { TextField, Button, Card, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin(); // Assuming error state holds the error message

  const handleLogin = async (event) => {
    event.preventDefault();
    await login(email, password);
  };
  const isDarkMode = theme.palette.mode === 'dark'; 
  const logoUrl = isDarkMode
    ? `${process.env.PUBLIC_URL}/assets/bear2.png`
    : `${process.env.PUBLIC_URL}/assets/trojan2.png`;

  return (
    <Container maxWidth="sm">
    <Card 
  sx={{ 
    p: 4, 
    mt: 5, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    borderRadius: '16px',
    // Example of changing the background color to match the theme
    backgroundColor: theme.palette.background.paper, // or any color from your theme
    // For complementary color or lighter/darker shades, you might use
    // backgroundColor: theme.palette.grey[200], // adapt the 200 to get the desired shade
  }}
>
        <img src={logoUrl} alt="Logo" style={{ maxWidth: '150px', marginBottom: theme.spacing(4) }} />
      <Typography variant="h3" color={theme.palette.primary.main} sx={{ mb: 4, textAlign: 'center' }}>
          Save My Seat
        </Typography> 
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
      <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === 'dark' ? (
                    <GiPolarBear />
                ) : (
                    <GiTrojanHorse />
                )}
               
            </IconButton>
    </Container>
  );
};

export default Login;