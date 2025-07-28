// frontend/src/pages/InformeDetallePage.tsx
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
  peceraId: string;
  peceraNombre: string;
  fileUrl?: string;
}

const InformeDetallePage: React.FC = () => {
  const { id } = useParams();
  const [informe, setInforme] = useState<Informe | null>(null);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('informes') || '[]');
    const encontrado = datos.find((inf: Informe) => inf.id === id);
    setInforme(encontrado);
  }, [id]);

  if (!informe) return <div className="detalle-informe-container"><Navbar /><p style={{ padding: 20 }}>Cargando informe...</p></div>;

  return (
    <div className="detalle-informe-container">
      <Navbar />
      <div className="detalle-box">
        <img src="/pez-alerta.png" alt="" />
        <h2>{informe.titulo}</h2>
        <p>{informe.peceraNombre} • {informe.fechaInicio} - {informe.fechaFin}</p>

        <div className="botones">
          {informe.fileUrl && (
            <a 
              href={informe.fileUrl} 
              download 
              className="btn-descargar"
            >
              Descargar PDF
            </a>
          )}
        </div>

        <h3>Rango de fechas</h3>
        <p><strong>Fecha de inicio:</strong> {informe.fechaInicio}</p>
        <p><strong>Fecha de finalización:</strong> {informe.fechaFin}</p>

        <h3>Resumen del informe</h3>
        <p>{informe.descripcion}</p>

        {informe.fileUrl && (
          <div className="pdf-preview">
            <h3>Vista previa del informe</h3>
            <iframe 
              src={informe.fileUrl} 
              title="Vista previa del PDF"
              width="100%" 
              height="500px"
              style={{ border: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InformeDetallePage;