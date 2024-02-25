import React from "react";
//import Select from "react-select";

//import user_icon from "../Assets/person.png";
//import lock_icon from "../Assets/password.png";
//import email_icon from "../Assets/email.png";
import "./LoginSignup.css";
import sortedMajorsList from "../../majorsData";
import react from "react";

const LoginSignup = () => {
  const [action, setAction] = react.useState("Login");
  const [username, setUsername] = react.useState("");
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [passwordRepeat, setPasswordRepeat] = react.useState("");
  const [selectedMajor, setSelectedMajor] = react.useState("");
  const [searchTerm, setSearchTerm] = react.useState("");

  const filteredMajors = sortedMajorsList.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLogin = async (event) => {
    event.preventDefault(); 

    
    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    const loginData = {
      username, 
      password, 
    };

    try {
      const response = await fetch("/login", {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred during login.");
      }

      console.log("Login successful", data);
      
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !passwordRepeat || !selectedMajor) {
      alert("Please fill in all fields.");
    } else if (password !== passwordRepeat) {
      alert("Passwords don't match.");
      return;
    }
    setAction("Registration Complete!"); //this shouldn't be here when we actually finish the website, but I have it here for now to make sure that the right page comes up after a sign up
   
    const userData = {
      selectedMajor,
      username, 
      password, 
      email,
     
    };

    try {
      const response = await fetch("/", {
        // Adjusting as per your setup
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "An error occurred during registration.",
        );
      }

      console.log("Registration successful", data);
      // setAction("Registration Complete");
     
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
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
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search for majors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                size={sortedMajorsList.length > 5 ? 5 : sortedMajorsList.length} 
              >
                {filteredMajors.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedMajor && <div>You selected: {selectedMajor}</div>}
            </div>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <input
              type="password"
              placeholder="Repeat Password"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
            <button type="submit">Sign Up</button>
          </form>
        )}

      

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
