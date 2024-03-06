import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (selectedMajor, username, email, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ selectedMajor, username, email, password })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}








const { dispatch } = useAuthContext();


const userData = {
  selectedMajor,
  username, // Assuming these are state variables captured from input fields
  password, // Same assumption
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


  localStorage.setItem('user', JSON.stringify(data));
  dispatch({type: 'LOGIN', payload: data});
  console.log("Registration successful", data);
  
} catch (error) {
  console.error("Error during registration:", error.message);
}