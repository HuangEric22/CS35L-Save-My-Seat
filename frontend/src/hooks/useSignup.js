import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

  const signup = async (name, selectedMajor, username, email, password) => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  name, username, email, password, major:selectedMajor })
      });
     console.log(response)
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const json = await response.json();
  
          localStorage.setItem('user', JSON.stringify(json));
          dispatch({ type: 'LOGIN', payload: json });
          
          setIsLoading(false);
          navigate("/");
        } else {
          throw new Error('Received response is not in JSON format');
        }
      } else {
        console.log("WE got here")
        const json = await response.json(); // Assuming error responses are also in JSON format.
        setError(json.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.toString());
      setIsLoading(false);
    }
  }

  return { signup, isLoading, error }
}


