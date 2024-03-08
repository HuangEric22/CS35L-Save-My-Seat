import React, { useState } from 'react';


import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
//import Select from 'react-select';
import { useSignup } from './hooks/useSignup';
import sortedMajorsList from './majorsData';
import { Link } from 'react-router-dom'; // Import Link

//import { ColorModeContext } from './theme'; 
import { Container, TextField, Button, Card, Typography, CssBaseline } from '@mui/material';
import CustomReactSelect from './customReactSelect'; 
import { useTheme } from '@mui/material/styles';

const ThemedSelect = ({ value, onChange, options, label }) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="major-select-label">{label}</InputLabel>
      <Select
        labelId="major-select-label"
        id="major-select"
        value={value}
        label={label}
        onChange={onChange}
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.grey[500],
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiSvgIcon-root': { // Arrow icon color
            color: theme.palette.text.primary,
          }
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
const Signup = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const {signup, error, isLoading} = useSignup();

  

  const handleSignup = async (event) => {
    event.preventDefault();
   
    
    await signup(selectedMajor, username, email, password);
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
          {/*<TextField
          required
          fullWidth
          name="repeat-password"
          label="Repeat Password"
          type="repeat-password"
          id="repeat-password"
          autoComplete="repeat-password"
          margin="normal"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
  />*/}
       {/*} <CustomReactSelect
  options={sortedMajorsList.map(major => ({ value: major, label: major }))}
  placeholder="Select your major"
  onChange={option => setSelectedMajor(option ? option.value : '')}
  // Ensure the value prop correctly matches an object in the options array or is null
  value={sortedMajorsList.find(option => option.value === selectedMajor) || null}
/>*/}


<ThemedSelect
  label="Select your major"
  value={selectedMajor}
  onChange={(e) => {setSelectedMajor(e.target.value); console.log(e.target.value)}}
  
  options={sortedMajorsList}
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
          {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
          <Typography variant="body2">
            Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Log in</Link>
          </Typography>
        </form>
      </Card>
    </Container>
  );
};




export default Signup;