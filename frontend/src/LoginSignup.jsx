import React from "react";

import { useSignup } from "./hooks/useSignup";
import { useLogin } from "./hooks/useLogin";
import "./LoginSignup.css";
import sortedMajorsList from "./majorsData";
import react from "react";
import Select from "react-select";
import { useAuthContext } from './hooks/useAuthContext';
const LoginSignup = () => {
  const [action, setAction] = react.useState("Login");
  const [username, setUsername] = react.useState("");
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [passwordRepeat, setPasswordRepeat] = react.useState("");
  const [selectedMajor, setSelectedMajor] = react.useState("");
  //const [searchTerm, setSearchTerm] = react.useState("");

  //const filteredMajors = sortedMajorsList.filter((option) =>
  //option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  //);
  function containsSpecialChars(str) {
    // Define a regular expression pattern for special characters
    const specialCharsPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

    return specialCharsPattern.test(str);
  }

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    // Preliminary check: Ensure neither field is empty
    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    await useLogin(username, password);
  };

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

  return (
    <>
      <div>
        <h1 className="pageTitle">Save Your Seat!</h1>
      </div>
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        {action === "Registration Complete!" && (
          <div className="registration-complete-container">
            <button type="button" onClick={() => setAction("Login")}>
              Back to Login
            </button>
          </div>
        )}
        {action === "Forgot Password" && (
          <div className="forgot-password-container">
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              onClick={() => console.log("Reset password for:", email)}
            >
              Send Code
            </button>
            {/*} <button type="button" onClick={() => setAction("Login")}>
              Back to Login
            </button>*/}
          </div>
        )}

        {action === "Signup" && (
          <form onSubmit={handleSignup}>
            {/*<div>
              <select value={selectedMajor} onChange={handleMajor}>
                <option value="">Select a Major</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
              {selectedMajor && <div>You selected: {selectedMajor}</div>}
        </div>*/}
            {/*}  <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search for majors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedMajor}
                onChange={(e) => {
                  setSelectedMajor(e.target.value);
                  console.log(e.target.value);
                }}
                size={sortedMajorsList.length > 5 ? 5 : sortedMajorsList.length} // To show a scroll for long lists
              >
                {filteredMajors.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedMajor && <div>You selected: {selectedMajor}</div>}
                </div>*/}

                //Here is the drop down menu code, list of majors is in majorsData.js
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
        )}

        {/* Add logic for "Login" if you want a separate form or view for it */}

        {action === "Login" && (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        )}

        <div className="submit-container">
          {action !== "Login" && action !== "Registration Complete!" && (
            <button className="submit" onClick={() => setAction("Login")}>
              Login
            </button>
          )}

          {action !== "Signup" && action !== "Registration Complete!" && (
            <button
              className={action === "Signup" ? "submit gray" : "submit"}
              onClick={() => setAction("Signup")}
            >
              Sign Up
            </button>
          )}

          {action !== "Forgot Password" &&
            action !== "Registration Complete!" && (
              <button
                className={
                  action === "Forgot Password" ? "submit gray" : "submit"
                }
                onClick={() => setAction("Forgot Password")}
              >
                Forgot Password
              </button>
            )}
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
