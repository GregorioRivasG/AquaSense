import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PerfilDetallePage.css';

interface Perfil {
  id: string;
  nombre: string;
  correo: string;
  password: string;
  fotoUrl: string;
}

const PerfilDetallePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  useEffect(() => {
    const perfiles: Perfil[] = JSON.parse(localStorage.getItem('perfiles') || '[]');
    const encontrado = perfiles.find((p) => p.id === id);
    if (encontrado) {
      setPerfil(encontrado);
    } else {
      alert('Perfil no encontrado');
      navigate('/usuario');
    }
  }, [id, navigate]);

  if (!perfil) return null;

  return (
    <div className="perfil-detalle-container">
      <Navbar />
      
      <div className="perfil-detalle-box">
        {perfil.fotoUrl ? (
          <img src={perfil.fotoUrl} alt="perfil" className="perfil-img" />
        ) : (
          <div className="perfil-icono">👤</div>
        )}
        <div><br /><br /><br /><br /></div>
        <h2>{perfil.nombre}</h2>
        <p><strong>Correo:</strong> {perfil.correo}</p>
        <p><strong>Contraseña:</strong> ******</p>
        <button onClick={() => navigate('/usuario')}>Volver</button>
      </div>
    </div>
  );
};

export default PerfilDetallePage;
