import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/auth';
import Loader from './Loader';


const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState({ loading: true, isAuthenticated: false });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthStatus({ loading: false, isAuthenticated: true });
      } else {
        setAuthStatus({ loading: false, isAuthenticated: false });
      }
    });

    return () => unsubscribe();
  }, []);

  if (authStatus.loading) {
    // replace with a loading spinner or similar
    return  <Loader />;
  }

  return authStatus.isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
