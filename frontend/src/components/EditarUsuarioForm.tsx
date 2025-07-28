// frontend/src/components/EditarUsuarioForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
  fotoUrl?: string;
}

interface EditarUsuarioFormProps {
  usuario: Usuario;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EditarUsuarioForm: React.FC<EditarUsuarioFormProps> = ({ 
  usuario, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    correo: usuario.correo,
    fotoUrl: usuario.fotoUrl || '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan si se cambian
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsLoading(true);
      
      // Preparar datos para enviar (no enviar confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;
      if (!dataToSend.password) {
        delete dataToSend.password; // No enviar contraseña si está vacía
      }

      await onSave(dataToSend);
    } catch (err) {
      setError(err.message || 'Error al actualizar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="editar-usuario-form">
      <div><br /><br /><br /><br /></div>
      <h2>Editar Perfil</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL de la foto (opcional):</label>
          <input
            type="url"
            name="fotoUrl"
            value={formData.fotoUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nueva contraseña (dejar vacío para no cambiar):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />
        </div>

        {formData.password && (
          <div className="form-group">
            <label>Confirmar nueva contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar contraseña"
            />
          </div>
        )}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="save-button"
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuarioForm;