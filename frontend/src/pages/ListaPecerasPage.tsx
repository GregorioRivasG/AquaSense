import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { 
  FiMapPin, 
  FiZap, 
  FiDroplet, 
  FiThermometer, 
  FiEdit2, 
  FiTrash2,
  FiSave,
  FiXCircle,
  FiPlusCircle
} from 'react-icons/fi';
import '../styles/ListaPecerasPage.css';

interface Pecera {
  _id: string;
  ubicacion: string;
  conductividad: string;
  ph: string;
  temperatura: string;
  fecha: string;
}

const ListaPecerasPage: React.FC = () => {
  const [peceras, setPeceras] = useState<Pecera[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editarId, setEditarId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    ubicacion: '',
    conductividad: '',
    ph: '',
    temperatura: '',
    fecha: '', // solo para mantenerla en edición, no se muestra en formulario
  });

  useEffect(() => {
    fetchPeceras();
  }, []);

  const fetchPeceras = () => {
    fetch('http://localhost:5000/api/tanks')
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener peceras');
        return res.json();
      })
      .then(data => setPeceras(data))
      .catch(err => {
        Swal.fire({
          position: 'top',
          title: 'Error',
          text: err.message || 'Error al obtener peceras',
          icon: 'error',
        });
      });
  };

  const eliminarPecera = async (id: string) => {
    const result = await Swal.fire({
      position: 'top',
      title: '¿Seguro que quieres eliminar esta pecera?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/tanks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al eliminar pecera');
      }

      await Swal.fire({
        position: 'top',
        title: 'Eliminado',
        text: 'Pecera eliminada correctamente',
        icon: 'success',
      });
      fetchPeceras();
    } catch (error: any) {
      Swal.fire({
        position: 'top',
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const abrirFormularioEdicion = (pecera: Pecera) => {
    setEditarId(pecera._id);
    setFormData({
      ubicacion: pecera.ubicacion,
      conductividad: pecera.conductividad,
      ph: pecera.ph,
      temperatura: pecera.temperatura,
      fecha: pecera.fecha,  // mantenemos fecha pero NO la mostramos para editar
    });
    setMostrarForm(true);
  };

  const limpiarFormulario = () => {
    setEditarId(null);
    setFormData({ ubicacion: '', conductividad: '', ph: '', temperatura: '', fecha: '' });
    setMostrarForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ubicacion.trim() || !formData.conductividad.trim() || !formData.ph.trim() || !formData.temperatura.trim()) {
      await Swal.fire({
        position: 'top',
        title: 'Atención',
        text: 'Por favor completa todos los campos requeridos.',
        icon: 'warning',
      });
      return;
    }

    // Si estamos editando, mantenemos la fecha que ya tiene la pecera
    // Si es nueva, asignamos la fecha actual automáticamente aquí
    const dataToSend = {
      ubicacion: formData.ubicacion,
      conductividad: formData.conductividad,
      ph: formData.ph,
      temperatura: formData.temperatura,
      fecha: editarId ? formData.fecha : obtenerFechaActual(),
    };

    try {
      const url = editarId ? `http://localhost:5000/api/tanks/${editarId}` : 'http://localhost:5000/api/tanks';
      const method = editarId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al guardar pecera');

      await Swal.fire({
        position: 'top',
        title: 'Éxito',
        text: editarId ? 'Pecera actualizada correctamente' : 'Pecera agregada correctamente',
        icon: 'success',
      });
      limpiarFormulario();
      fetchPeceras();
    } catch (error: any) {
      Swal.fire({
        position: 'top',
        title: 'Error',
        text: error.message || 'Error al guardar pecera',
        icon: 'error',
      });
    }
  };

  return (
    <div className="lista-peceras-container">
      <Navbar />

      <div className="titulo-con-boton">
        <h2>Lista de Peceras</h2>
        <button className="btn-agregar-top" onClick={() => { limpiarFormulario(); setMostrarForm(true); }} title="Agregar pecera">
          <FiPlusCircle size={20} style={{ marginRight: '6px' }} />
          Agregar Pecera
        </button>
      </div>

      {peceras.length === 0 ? (
        <p>No hay peceras registradas.</p>
      ) : (
        <table className="tabla-peceras">
          <thead>
            <tr>
              <th>#</th>
              <th>Ubicación</th>
              <th>Conductividad</th>
              <th>pH</th>
              <th>Temperatura (°C)</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {peceras.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td>{p.ubicacion}</td>
                <td>{p.conductividad}</td>
                <td>{p.ph}</td>
                <td>{p.temperatura}</td>
                <td>{new Date(p.fecha).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => abrirFormularioEdicion(p)}
                    title="Editar pecera"
                    aria-label="Editar pecera"
                  >
                    <FiEdit2 size={18} />
                  </button>{' '}
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarPecera(p._id)}
                    title="Eliminar pecera"
                    aria-label="Eliminar pecera"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarForm && (
        <div className="modal-fondo">
          <div className="form-popup">
            <h3>{editarId ? 'Editar Pecera' : 'Nueva Pecera'}</h3>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FiMapPin size={20} />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={formData.ubicacion}
                onChange={handleChange}
                autoFocus
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FiZap size={20} />
              <input
                type="text"
                name="conductividad"
                placeholder="Conductividad"
                value={formData.conductividad}
                onChange={handleChange}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FiDroplet size={20} />
              <input
                type="text"
                name="ph"
                placeholder="Nivel de pH"
                value={formData.ph}
                onChange={handleChange}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FiThermometer size={20} />
              <input
                type="text"
                name="temperatura"
                placeholder="Temperatura (°C)"
                value={formData.temperatura}
                onChange={handleChange}
              />
            </label>

            <div className={`botones-formulario ${editarId ? 'centrar-botones' : ''}`}>
              <button onClick={handleSubmit} title={editarId ? 'Guardar cambios' : 'Agregar pecera'}>
                {editarId ? (
                  <>
                    <FiSave size={16} style={{ marginRight: '6px' }} /> Guardar cambios
                  </>
                ) : (
                  <>
                    <FiPlusCircle size={16} style={{ marginRight: '6px' }} /> Agregar
                  </>
                )}
              </button>
              <button onClick={limpiarFormulario} title="Cancelar" style={{ marginLeft: '12px' }}>
                <FiXCircle size={16} style={{ marginRight: '6px' }} /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaPecerasPage;
