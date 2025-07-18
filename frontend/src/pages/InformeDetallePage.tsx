import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/InformeDetallePage.css';

interface Informe {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  ph: string;
  temperatura: string;
  oxigeno: string;
}

const InformeDetallePage: React.FC = () => {
  const { id } = useParams();
  const [informe, setInforme] = useState<Informe | null>(null);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('informes') || '[]');
    const encontrado = datos.find((inf: Informe) => inf.id === id);
    setInforme(encontrado);
  }, [id]);

  if (!informe) return <div>Cargando informe...</div>;

  return (
    <div className="detalle-informe-container">
      <Navbar />
      <div className="detalle-box">
        <img src="/pez-alerta.png" alt="pez" />
        <h2>{informe.titulo}</h2>
        <p>{informe.fechaInicio} - {informe.fechaFin}</p>

        <div className="botones">
          <button>Editar informe</button>
          <button>Compartir informe</button>
          <button>Descargar</button>
        </div>

        <h3>Rango de fechas</h3>
        <p><strong>Fecha de inicio:</strong> {informe.fechaInicio}</p>
        <p><strong>Fecha de finalización:</strong> {informe.fechaFin}</p>

        <h3>Métricas de la calidad del agua</h3>
        <p><strong>Oxígeno disuelto:</strong> {informe.oxigeno}</p>
        <p><strong>Nivel de pH:</strong> {informe.ph}</p>
        <p><strong>Temperatura:</strong> {informe.temperatura}</p>

        <h3>Resumen del informe</h3>
        <p>{informe.descripcion}</p>
      </div>
    </div>
  );
};

export default InformeDetallePage;
