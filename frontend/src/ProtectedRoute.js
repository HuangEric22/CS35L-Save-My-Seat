import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';  

function ProtectedRoute({ children }) {
  const location = useLocation(); 
  
 
  const user = useAuthContext(); 
  console.log(user)
 
  if (!user) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default ProtectedRoute;