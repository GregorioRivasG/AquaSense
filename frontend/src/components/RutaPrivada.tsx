import React from 'react';
import { Navigate } from 'react-router-dom';

interface RutaPrivadaProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

const RutaPrivada: React.FC<RutaPrivadaProps> = ({ children, allowedRoles }) => {
  const sesionActiva = localStorage.getItem('sesion') === 'activa';
  const userRole = (localStorage.getItem('rol') || '').toLowerCase(); // 👈 normalizar rol

  // Depuración (opcional)
  console.log('Rol detectado:', userRole);
  console.log('Roles permitidos:', allowedRoles);

  if (!sesionActiva) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RutaPrivada;

