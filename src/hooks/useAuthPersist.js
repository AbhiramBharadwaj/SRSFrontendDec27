
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const useAuthPersist = () => {
  const { token, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    
    console.log('Auth restored:', { user: user?.fullName, role: user?.role });
  }, [isAuthenticated, user]);

  return null;
};

export default useAuthPersist;