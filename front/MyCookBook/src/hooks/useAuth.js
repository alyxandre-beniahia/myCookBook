import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Enhanced logout function that includes navigation
  const logoutWithRedirect = () => {
    auth.logout();
    navigate('/login');
  };

  return {
    ...auth,
    logout: logoutWithRedirect,
  };
};
