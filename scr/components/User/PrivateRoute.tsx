import React from 'react';
import { Navigate } from 'react-router-dom'; // Importa tu Zustand store
import { useUserStore } from '../../store/user/User.store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />; // Redirige al login si no está autenticado
  }

  return <>{children}</>; // Si está autenticado, renderiza el contenido
};

export default PrivateRoute;
