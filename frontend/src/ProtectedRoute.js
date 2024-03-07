import { Navigate } from 'react-router-dom';

// Assuming you have a way to check authentication status (e.g., from context or local storage)
import { useAuthContext } from './hooks/useAuthContext';  

function ProtectedRoute({ children }) {
  const { user } = useAuthContext(); // Replace this with your actual authentication logic
  
  if (!user) {
    // User not logged in, redirect to login page, but store which part of the site user was on so they can go back to it 
    //immediately upon logging in 
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;