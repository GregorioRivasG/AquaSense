import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EditarUsuarioForm from '../components/EditarUsuarioForm';
import '../styles/PerfilPage.css';

const PerfilPage: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Verificar que tenemos userId y token
        if (!userId || !token) {
          throw new Error('No se encontró información de sesión');
        }

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Si el token es inválido o expiró
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login');
            return;
          }
          throw new Error('Error al cargar datos del usuario');
        }
        
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSave = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!userId || !token) {
        throw new Error('No se encontró información de sesión');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }
      
      const updatedUser = await response.json();
      setUsuario(updatedUser);
      setIsEditing(false);
      
      // Mostrar mensaje de éxito
      alert('Perfil actualizado correctamente');
      
      // Si se cambió la contraseña, cerrar sesión
      if (formData.password) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="perfil-container">
      <Navbar />
      
      <div className="perfil-content">
        {isEditing ? (
          <>
            <EditarUsuarioForm
              usuario={usuario}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
            {error && <div className="error-message">{error}</div>}
          </>
        ) : (
          <>
          <br />
            <div><br /><br /></div>
            <div className="perfil-header">
              <h1>Mi Perfil</h1>
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                Editar Perfil
              </button>
            </div>
           
            <div className="perfil-info">
              {usuario?.fotoUrl && (
                <div className="perfil-foto">
                  <img src={usuario.fotoUrl} alt="Foto de perfil" />
                </div>
              )}
              
              <div className="perfil-datos">
                <p><strong>Nombre:</strong> {usuario?.nombre}</p>
                <p><strong>Correo:</strong> {usuario?.correo}</p>
                <p><strong>Rol:</strong> {usuario?.role}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PerfilPage;