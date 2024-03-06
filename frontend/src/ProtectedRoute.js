import { Navigate } from 'react-router-dom';

// Assuming you have a way to check authentication status (e.g., from context or local storage)
import { useAuthContext } from './hooks/useAuthContext';  

function ProtectedRoute({ children }) {
  const { user } = useAuthContext(); // Replace this with your actual authentication logic
  
  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" />;
  }
  
  return children;
}