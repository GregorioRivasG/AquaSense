// frontend/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DashboardPage.css';
import { FiMapPin, FiZap, FiThermometer, FiAlertCircle, FiCheckCircle, FiCalendar, FiCpu } from 'react-icons/fi';
import { GiChemicalDrop } from 'react-icons/gi';

interface Tank {
  _id: string;
  name?: string;
  description?: string;
  ubicacion?: string;
  conductividad?: string;
  ph?: string;
  temperatura?: string;
  estado?: string;
  fecha?: Date;
  createdAt?: Date;
}

const DashboardPage: React.FC = () => {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tanks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Error al obtener peceras');
        
        const data = await response.json();
        setTanks(data);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTanks();
  }, []);

  if (loading) return <div className="dashboard-container"><Navbar /><p style={{ padding: 20 }}>Cargando...</p></div>;
  if (error) return <div className="dashboard-container"><Navbar /><p style={{ padding: 20 }}>Error: {error}</p></div>;

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Monitoreo de Peceras</h2>
        <table>
          <thead>
            <tr>
              <th><FiCpu /> Nombre</th>
              <th><FiMapPin /> Ubicación</th>
              <th><FiZap /> Conductividad</th>
              <th><GiChemicalDrop /> pH</th>
              <th><FiThermometer /> Temperatura</th>
              <th>Estado</th>
              <th><FiCalendar /> Creado</th>
            </tr>
          </thead>
          <tbody>
            {tanks.map((tank) => (
              <tr key={tank._id}>
                <td><Link to={`/pecera/${tank._id}`}>{tank.name || 'Nueva Pecera'}</Link></td>
                <td><FiMapPin style={{ marginRight: '6px' }} />{tank.ubicacion || 'N/A'}</td>
                <td><FiZap style={{ marginRight: '6px' }} />{tank.conductividad || 'N/A'}</td>
                <td><GiChemicalDrop style={{ marginRight: '6px', color: '#0077cc' }} />{tank.ph || 'N/A'}</td>
                <td><FiThermometer style={{ marginRight: '6px' }} />{tank.temperatura || 'N/A'} °C</td>
                <td className={tank.estado === 'Alerta' ? 'estado-alerta' : 'estado-normal'}>
                  {tank.estado === 'Alerta' ? 
                    <FiAlertCircle style={{ color: 'red', marginRight: '4px' }} /> : 
                    <FiCheckCircle style={{ color: 'green', marginRight: '4px' }} />}
                  {tank.estado || 'Normal'}
                </td>
                <td><FiCalendar style={{ marginRight: '6px' }} />
                  {tank.createdAt ? new Date(tank.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;