import React, { useState } from 'react';
import Select from 'react-select';
import { useSignup } from './hooks/useSignup';
import sortedMajorsList from './majorsData';
import { Link } from 'react-router-dom'; // Import Link

import { ColorModeContext } from './theme'; 
import { Container, TextField, Button, Card, Typography, CssBaseline } from '@mui/material';
import CustomReactSelect from './customReactSelect'; 
import { useTheme } from '@mui/material/styles';

const Signup = () => {
    const theme = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');

  function containsSpecialChars(str) {
    // Define a regular expression pattern for special characters
    const specialCharsPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

    return specialCharsPattern.test(str);
  }

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !passwordRepeat || !selectedMajor) {
        alert("Please fill in all fields.");
        return;
      } else if (password !== passwordRepeat) {
        alert("Passwords don't match.");
        return;
      } else if (email.lastIndexOf("@g.ucla.edu") === -1) {
        alert("Email must be a @g.ucla.edu account.");
        return;
      } else if (!containsSpecialChars(password)) {
        alert("Password must contain at least one special character.");
        return;
      } else if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
    
    await useSignup(selectedMajor, username, email, password);
    };
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Card sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form onSubmit={handleSignup} style={{ marginTop: theme.spacing(3) }}>
          <TextField
            autoComplete="username"
            name="username"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address (must be a UCLA login)"
            name="email"
            autoComplete="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CustomReactSelect
            options={sortedMajorsList}
            placeholder="Select your major"
            onChange={setSelectedMajor}
            value={selectedMajor}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Log in</Link>
          </Typography>
        </form>
      </Card>
    </Container>
  );
};

export default Signup;