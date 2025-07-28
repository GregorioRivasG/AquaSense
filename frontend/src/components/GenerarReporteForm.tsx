// frontend/src/components/GenerarReporteForm.tsx
import React, { useState } from 'react';
import { FiCalendar, FiDownload } from 'react-icons/fi';
import '../styles/GenerarReporteForm.css';

interface GenerarReporteFormProps {
  onGenerate: (fechaInicio: string, fechaFin: string) => void;
  onCancel: () => void;
}

const GenerarReporteForm: React.FC<GenerarReporteFormProps> = ({ onGenerate, onCancel }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fechaInicio && fechaFin) {
      onGenerate(fechaInicio, fechaFin);
    }
  };

  return (
    <div className="generar-reporte-form">
      <h3>Generar Reporte PDF</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FiCalendar /> Fecha Inicio
          </label>
          <input 
            type="date" 
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <FiCalendar /> Fecha Fin
          </label>
          <input 
            type="date" 
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-generar">
            <FiDownload /> Generar PDF
          </button>
          <button type="button" className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenerarReporteForm;