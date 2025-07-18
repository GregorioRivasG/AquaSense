import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/InformeDetallePage.css';
import * as html2pdf from 'html2pdf.js';


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
  const [modoEdicion, setModoEdicion] = useState(false);
  const [editado, setEditado] = useState<Partial<Informe>>({});
  const navigate = useNavigate();
  const contenidoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('informes') || '[]');
    const encontrado = datos.find((inf: Informe) => inf.id === id);
    setInforme(encontrado);
    setEditado(encontrado);
  }, [id]);

  const guardarCambios = () => {
    if (!editado) return;
    const actualizados = JSON.parse(localStorage.getItem('informes') || '[]');
    const nuevos = actualizados.map((inf: Informe) =>
      inf.id === id ? { ...inf, ...editado } : inf
    );
    localStorage.setItem('informes', JSON.stringify(nuevos));
    setInforme({ ...(informe as Informe), ...(editado as Informe) });
    setModoEdicion(false);
  };

  const compartirInforme = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: informe?.titulo,
        text: 'Consulta el informe semanal de calidad del agua.',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles 📋');
    }
  };

  const descargarPDF = () => {
    if (contenidoRef.current) {
      html2pdf().from(contenidoRef.current).save(`${informe?.titulo}.pdf`);
    }
  };

  if (!informe) return <div>Cargando informe...</div>;

  return (
    <div className="detalle-informe-container">
      <Navbar />
      <div className="detalle-box" ref={contenidoRef}>
        <img src="/pez-alerta.png" alt="pez" />
        <h2>{informe.titulo}</h2>
        <p>{informe.fechaInicio} - {informe.fechaFin}</p>

        <div className="botones">
          <button onClick={() => setModoEdicion(true)}>Editar informe</button>
          <button onClick={compartirInforme}>Compartir informe</button>
          <button onClick={descargarPDF}>Descargar</button>
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

      {modoEdicion && (
        <div className="modal-fondo">
          <div className="form-popup">
            <h3>Editar Informe</h3>
            <input value={editado?.titulo || ''} onChange={e => setEditado({ ...editado, titulo: e.target.value })} />
            <input value={editado?.fechaInicio || ''} type="date" onChange={e => setEditado({ ...editado, fechaInicio: e.target.value })} />
            <input value={editado?.fechaFin || ''} type="date" onChange={e => setEditado({ ...editado, fechaFin: e.target.value })} />
            <textarea value={editado?.descripcion || ''} onChange={e => setEditado({ ...editado, descripcion: e.target.value })} />
            <input value={editado?.oxigeno || ''} onChange={e => setEditado({ ...editado, oxigeno: e.target.value })} />
            <input value={editado?.ph || ''} onChange={e => setEditado({ ...editado, ph: e.target.value })} />
            <input value={editado?.temperatura || ''} onChange={e => setEditado({ ...editado, temperatura: e.target.value })} />
            <button onClick={guardarCambios}>Guardar</button>
            <button onClick={() => setModoEdicion(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformeDetallePage;
