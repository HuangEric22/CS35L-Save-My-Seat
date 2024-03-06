import React, { useState } from 'react';
import Select from 'react-select';
import { useSignup } from './hooks/useSignup';
import sortedMajorsList from './majorsData';
import { Link } from 'react-router-dom'; // Import Link

const Signup = () => {
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
      } else if (email.indexOf("@g.ucla.edu") === -1) {
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
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
      <div className="login-signup-form">
              <h1>Select Your Major</h1>
              <Select
                value={selectedMajor}
                type="text"
                onChange={setSelectedMajor}
                options={sortedMajorsList}
                className="major-select"
                placeholder="Select a major..."
                isClearable={true} // Allows the user to clear their selection
                isSearchable={true} // Allows the user to search through the options
              />
             
            </div>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email (must be a UCLA login)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password (must contain at least one special character)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Repeat Password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          
        
      </form>
     <p>Already have an account? <Link to="/login">Login</Link></p> {/* Add this line */}
    </div>
  );
};

export default Signup;