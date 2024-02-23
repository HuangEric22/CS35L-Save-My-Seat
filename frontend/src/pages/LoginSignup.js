import React from "react";

//import user_icon from "../Assets/person.png";
//import lock_icon from "../Assets/password.png";
//import email_icon from "../Assets/email.png";
import "../src/index.css";
import react from "react";

const LoginSignup = () => {
  const [action, setAction] = react.useState("Login");
  const [username, setUsername] = react.useState("");
  const [email, setEmail] = react.useState("");
  const [password, setPassword] = react.useState("");
  const [passwordRepeat, setPasswordRepeat] = react.useState("");

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    // Preliminary check: Ensure neither field is empty
    if (!username || !password) {
      alert("Username and password are required.");
      return;
    }

    const loginData = {
      username, // Assuming these are state variables captured from input fields
      password, // Same assumption
    };

    try {
      const response = await fetch("/login", {
        // Adjust '/api/login' as your actual login route
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
      // Handle login success (e.g., redirect to dashboard, store JWT, etc.)
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !passwordRepeat) {
      alert("Please fill in all fields.");
    } else if (password !== passwordRepeat) {
      alert("Passwords don't match.");
      return;
    }
    setAction("Registration Complete!");
    // Continue with signup process (validation, API call, etc.)
    const userData = {
      username, // Assuming these are state variables captured from input fields
      password, // Same assumption
      email,
      // Add more fields as needed
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
      // Further actions upon successful registration
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
