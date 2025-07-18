import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Navbar.css';
import { logout } from '../utils/logout'; // si usas archivo aparte

const Navbar: React.FC = () => {
  const rol = localStorage.getItem('rol');
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/'); // redirigir a login
        Swal.fire('Sesión cerrada', 'Has cerrado sesión correctamente.', 'success');
      }
    });
  };

  return (
    <nav className="navbar">
      <h1>AquaSense</h1>
      <div className="nav-links">
        <Link to="/dashboard">🏠 Tiempo Real</Link>
        <Link to="/alertas">⚠ Alertas</Link>
        <Link to="/informes">📊 Informes</Link>
        {rol === 'admin' && (
          <>
            <Link to="/usuario">👤 Usuario</Link>
            <Link to="/peceras">🐠 Lista Peceras</Link>
            <Link to="/perfil">Mi Perfil</Link>
          </>
        )}
        <button onClick={handleLogout} className="btn-logout">
          🚪 Salir
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
