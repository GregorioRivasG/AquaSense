import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/DetalleAlertaPage.css';

interface Alerta {
  id: string;
  titulo: string;
  gravedad: string;
  fecha: string;
  sensor: string;
  tipo: string;
  umbral: string;
  actual: string;
  reconocida: boolean;
  imagen: string;
}

const DetalleAlertaPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<Alerta | null>(null);

  useEffect(() => {
    const data: Alerta[] = JSON.parse(localStorage.getItem('alertas-detalle') || '[]');
    const encontrada = data.find((a) => a.id === id);
    if (encontrada) setAlerta(encontrada);
  }, [id]);

  const actualizar = (campo: Partial<Alerta>) => {
    const data: Alerta[] = JSON.parse(localStorage.getItem('alertas-detalle') || '[]');
    const actualizada = data.map((a) => (a.id === id ? { ...a, ...campo } : a));
    localStorage.setItem('alertas-detalle', JSON.stringify(actualizada));
    setAlerta(actualizada.find((a) => a.id === id) || null);
  };

  const eliminar = () => {
    const data: Alerta[] = JSON.parse(localStorage.getItem('alertas-detalle') || '[]');
    const filtradas = data.filter((a) => a.id !== id);
    localStorage.setItem('alertas-detalle', JSON.stringify(filtradas));
    navigate('/alertas');
  };

  if (!alerta) return <div className="alerta-detalle-container"><Navbar /><p style={{ padding: 20 }}>No se encontró la alerta.</p></div>;

  return (
    <div className="alerta-detalle-container">
      <Navbar />
      <div className="alerta-box">
        <img src={alerta.imagen} alt="alerta pez" />
        <div className="alerta-info">
          <h2>{alerta.titulo}</h2>
          <p className="sub">Alerta de advertencia</p>

          <div className="botones">
            <button onClick={() => actualizar({ reconocida: true })}>Reconocer</button>
            <button className="clara" onClick={eliminar}>Alerta clara</button>
            <button className="editar" onClick={() => {
              const nuevo = prompt('Nuevo valor actual:', alerta.actual);
              if (nuevo) actualizar({ actual: nuevo });
            }}>Editar</button>
          </div>

          <p><strong>Nivel de gravedad:</strong> {alerta.gravedad}</p>
          <p><strong>Marca de tiempo:</strong> {alerta.fecha}</p>
          <p><strong>Tipo de sensor:</strong> {alerta.tipo}</p>
          <p><strong>Valor umbral:</strong> {alerta.umbral}</p>
          <p><strong>Valor actual:</strong> {alerta.actual}</p>

          <label>
            <input type="checkbox" checked={alerta.reconocida} readOnly />
            Alerta reconocida
          </label>
        </div>
      </div>
    </div>
  );
};

export default DetalleAlertaPage;
