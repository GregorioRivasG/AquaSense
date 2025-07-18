// frontend/src/pages/DetallePeceraPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DetallePeceraPage.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Colors
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Colors
);

interface Tank {
  _id: string;
  ubicacion: string;
  conductividad: string;
  ph: string;
  temperatura: string;
  estado: string;
  fecha: string;
  name: string;
}

interface Measurement {
  _id: string;
  tankId: string;
  temperature: number;
  ph: number;
  conductivity: number;
  timestamp: string;
}

const DetallePeceraPage: React.FC = () => {
  const { id } = useParams();
  const [tank, setTank] = useState<Tank | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Obtener datos de la pecera
        const tankResponse = await fetch(`http://localhost:5000/api/tanks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!tankResponse.ok) throw new Error('Error al obtener pecera');
        const tankData = await tankResponse.json();
        setTank(tankData);

        // Obtener mediciones de la pecera
        const measurementsResponse = await fetch(`http://localhost:5000/api/measurements?tankId=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!measurementsResponse.ok) throw new Error('Error al obtener mediciones');
        const measurementsData = await measurementsResponse.json();
        setMeasurements(measurementsData);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Configuración común para los gráficos
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  // Datos para cada gráfico individual
  const temperatureChartData = {
    labels: measurements.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: measurements.map(m => m.temperature),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const phChartData = {
    labels: measurements.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Nivel de pH',
        data: measurements.map(m => m.ph),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  const conductivityChartData = {
    labels: measurements.map(m => new Date(m.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Conductividad (ppm)',
        data: measurements.map(m => m.conductivity),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        borderWidth: 2
      }
    ]
  };

  // Opciones específicas para cada gráfico
  const temperatureChartOptions = {
    ...commonChartOptions,
    scales: {
      ...commonChartOptions.scales,
      y: {
        min: 20,
        max: 30,
        title: {
          display: true,
          text: 'Temperatura (°C)'
        }
      }
    }
  };

  const phChartOptions = {
    ...commonChartOptions,
    scales: {
      ...commonChartOptions.scales,
      y: {
        min: 0,
        max: 14,
        title: {
          display: true,
          text: 'pH'
        }
      }
    }
  };

  const conductivityChartOptions = {
    ...commonChartOptions,
    scales: {
      ...commonChartOptions.scales,
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Conductividad (ppm)'
        }
      }
    }
  };

  if (loading) return <div className="detalle-container"><Navbar /><p style={{ padding: 20 }}>Cargando...</p></div>;
  if (error) return <div className="detalle-container"><Navbar /><p style={{ padding: 20 }}>Error: {error}</p></div>;
  if (!tank) return <div className="detalle-container"><Navbar /><p style={{ padding: 20 }}>Pecera no encontrada</p></div>;

  // Obtener la última medición
  const lastMeasurement = measurements.length > 0 ? measurements[measurements.length - 1] : null;

  return (
    <div className="detalle-container">
      <Navbar />
      <div className="detalle-content">
        <h1>{tank.name || 'Pecera'}</h1>
        <p className="ubicacion">{tank.ubicacion}</p>
        
        <div className="status-container">
          <span className={`status-badge ${tank.estado.toLowerCase()}`}>
            {tank.estado}
          </span>
          <p className="last-update">
            Última actualización: {lastMeasurement ? new Date(lastMeasurement.timestamp).toLocaleString() : 'N/A'}
          </p>
        </div>

        <div className="current-readings">
          <div className="reading-card">
            <h3>Temperatura Actual</h3>
            <p className="reading-value">{lastMeasurement ? `${lastMeasurement.temperature} °C` : 'N/A'}</p>
            <p className="reading-range">Rango ideal: 24-28 °C</p>
          </div>
          
          <div className="reading-card">
            <h3>pH Actual</h3>
            <p className="reading-value">{lastMeasurement ? lastMeasurement.ph : 'N/A'}</p>
            <p className="reading-range">Rango ideal: 6.5-8.5</p>
          </div>
          
          <div className="reading-card">
            <h3>Conductividad Actual</h3>
            <p className="reading-value">{lastMeasurement ? `${lastMeasurement.conductivity} ppm` : 'N/A'}</p>
            <p className="reading-range">Rango ideal: 200-800 ppm</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Variación de Temperatura</h3>
            <div className="chart-container">
              <Line data={temperatureChartData} options={temperatureChartOptions} />
            </div>
          </div>
          
          <div className="chart-wrapper">
            <h3>Variación de pH</h3>
            <div className="chart-container">
              <Line data={phChartData} options={phChartOptions} />
            </div>
          </div>
          
          <div className="chart-wrapper">
            <h3>Variación de Conductividad</h3>
            <div className="chart-container">
              <Line data={conductivityChartData} options={conductivityChartOptions} />
            </div>
          </div>
        </div>

        <div className="measurements-table">
          <h3>Registro de Mediciones</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fecha/Hora</th>
                  <th>Temperatura (°C)</th>
                  <th>pH</th>
                  <th>Conductividad (ppm)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.slice().reverse().map((m) => (
                  <tr key={m._id}>
                    <td>{new Date(m.timestamp).toLocaleString()}</td>
                    <td className={m.temperature < 24 || m.temperature > 28 ? 'out-of-range' : ''}>
                      {m.temperature}
                    </td>
                    <td className={m.ph < 6.5 || m.ph > 8.5 ? 'out-of-range' : ''}>
                      {m.ph}
                    </td>
                    <td className={m.conductivity < 200 || m.conductivity > 800 ? 'out-of-range' : ''}>
                      {m.conductivity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePeceraPage;