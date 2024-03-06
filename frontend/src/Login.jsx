import React, { useState } from 'react';
import { useLogin } from './hooks/useLogin';
import { Link } from 'react-router-dom'; // Import Link
import { useAuthContext } from './hooks/useAuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    
    // Preliminary check: Ensure neither field is empty
    if (!email || !password) {
        alert("Email and password are required.");
        return;
      }
  
      await useLogin(email, password);
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
     <p>Dont have an account? <Link to="/signup">Sign Up</Link></p>  {/* Add this line */}
    </div>
  );
};

export default Login;