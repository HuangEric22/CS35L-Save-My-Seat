import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

  const login = async (email, password) => {
   
    setIsLoading(true)
    setError(null)
  
    try {
      const response = await fetch('http://localhost:4000/api/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
          // Check Content-Type to be extra safe
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
              const json = await response.json();
  
              // save the user to local storage
              localStorage.setItem('user', JSON.stringify(json));
    
              // update the auth context
              dispatch({type: 'LOGIN', payload: json});
    
              navigate("/");
          } else {
              throw new Error('Received response is not in JSON format');
          }
      } else {
          // If response is not OK. Attempt to parse JSON to get error message
          // or fallback to generic error if body can't be parsed
          const errorResponse = await response.text();
          try {
              const parsedError = JSON.parse(errorResponse);
              setError(parsedError.error);
          } catch(parseError) {
              setError("Login failed for an unknown reason.");
          }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.toString());
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error }
}