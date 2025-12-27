
import React, { useState, useEffect } from 'react';
import UserDesktopLayout from './UserDesktopLayout';
import UserMobileLayout from './UserMobileLayout';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../context/AuthContext';

const ResponsiveLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  
  return isMobile ? (
    <UserMobileLayout>{children}</UserMobileLayout>
  ) : (
    <UserDesktopLayout>{children}</UserDesktopLayout>
  );
};

export default ResponsiveLayout;
