import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/AlertasPage.css';

interface Alerta {
  id: string;
  acuario: string;
  alerta: string;
  gravedad: 'Crítico' | 'Advertencia' | 'Información';
  fecha: string;
  admitido: boolean;
  icono: string;
  parametro: 'conductividad' | 'ph' | 'temperatura';
  valor: number;
}

const AlertasPage: React.FC = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    // Obtener alertas guardadas en localStorage
    const guardadas = localStorage.getItem('alertas-tabla');
    const alertasIniciales: Alerta[] = guardadas ? JSON.parse(guardadas) : [];

    // Obtener última medición de la API
    const fetchLatestMeasurement = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/measurements/latest', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Generar alertas automáticas basadas en los valores
          const nuevasAlertas: Alerta[] = [];
          const ahora = new Date().toISOString();

          // Alerta por conductividad alta (1800 ppm)
          if (data.conductivity > 800) {
            const gravedad = data.conductivity > 1500 ? 'Crítico' : 'Advertencia';
            nuevasAlertas.push({
              id: `cond-${Date.now()}`,
              acuario: 'Pecera Principal',
              alerta: `Conductividad extremadamente alta (${data.conductivity} ppm)`,
              gravedad,
              fecha: ahora,
              admitido: false,
              icono: '⚡',
              parametro: 'conductividad',
              valor: data.conductivity
            });
          }

          // Combinar alertas existentes con las nuevas
          const todasAlertas = [...nuevasAlertas, ...alertasIniciales];
          setAlertas(todasAlertas);
          localStorage.setItem('alertas-tabla', JSON.stringify(todasAlertas));
        }
      } catch (error) {
        console.error('Error fetching measurements:', error);
      }
    };

    fetchLatestMeasurement();
  }, []);

  // Función para manejar el reconocimiento de alertas
  const handleAcknowledge = (id: string) => {
    const updatedAlertas = alertas.map(alerta => 
      alerta.id === id ? { ...alerta, admitido: true } : alerta
    );
    setAlertas(updatedAlertas);
    localStorage.setItem('alertas-tabla', JSON.stringify(updatedAlertas));
  };

  return (
    <div className="alertas-container">
      <Navbar />
      <div className="alertas-tabla-contenido">
        <h2 className="titulo-alerta">Alertas de Calidad del Agua</h2>

        <table className="tabla-alertas">
          <thead>
            <tr>
              <th>Acuario</th>
              <th>Alerta</th>
              <th>Gravedad</th>
              <th>Marca de Tiempo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((a) => (
              <tr key={a.id} className={a.admitido ? 'alerta-admitida' : ''}>
                <td>
                  <Link to={`/alerta/${a.id}`} className="alerta-link">
                    {a.acuario}
                  </Link>
                </td>
                <td>
                  <span className="alerta-icono">{a.icono}</span> 
                  {a.alerta}
                  <div className="alerta-detalle">
                    {a.parametro}: {a.valor} {a.parametro === 'conductividad' ? 'ppm' : 
                                      a.parametro === 'temperatura' ? '°C' : ''}
                  </div>
                </td>
                <td className={`nivel-${a.gravedad.toLowerCase()}`}>
                  {a.gravedad}
                </td>
                <td>{new Date(a.fecha).toLocaleString()}</td>
                <td>
                  {!a.admitido && (
                    <button 
                      onClick={() => handleAcknowledge(a.id)}
                      className="boton-admitir"
                    >
                      Admitir
                    </button>
                  )}
                  {a.admitido && '✅ Admitido'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertasPage;