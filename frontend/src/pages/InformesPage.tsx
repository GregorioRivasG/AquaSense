import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/InformesPage.css';

interface Informe {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
}

const InformesPage: React.FC = () => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<'fecha' | 'titulo'>('fecha');
  const [pagina, setPagina] = useState(1);
  const informesPorPagina = 5;

  useEffect(() => {
    const guardados = localStorage.getItem('informes');
    if (guardados) setInformes(JSON.parse(guardados));
  }, []);

  const informesFiltrados = informes
    .filter((inf) =>
      `${inf.titulo} ${inf.descripcion} ${inf.fechaInicio} ${inf.fechaFin}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      if (orden === 'titulo') {
        return a.titulo.localeCompare(b.titulo);
      } else {
        return new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime();
      }
    });

  const totalPaginas = Math.ceil(informesFiltrados.length / informesPorPagina);
  const inicio = (pagina - 1) * informesPorPagina;
  const paginados = informesFiltrados.slice(inicio, inicio + informesPorPagina);

  const cambiarPagina = (nueva: number) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
  };

  return (
    <div className="informes-container">
      <Navbar />
      <div className="informes-header">
        <h2>Informes históricos</h2>
        <div className="barra-superior">
          <input
            type="text"
            placeholder="🔍 Buscar"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
          <select value={orden} onChange={(e) => setOrden(e.target.value as 'fecha' | 'titulo')}>
            <option value="fecha">📅 Fecha reciente</option>
            <option value="titulo">🔤 Título A-Z</option>
          </select>
        </div>
      </div>

      <div className="lista-informes">
        {paginados.map((inf) => (
          <Link to={`/informe/${inf.id}`} key={inf.id} className="item-informe">
            <img src="/pez-alerta.png" alt="icono" />
            <div>
              <strong>{inf.titulo}</strong>
              <p>{inf.fechaInicio} - {inf.fechaFin}</p>
              <span>{inf.descripcion}</span>
            </div>
            <span className="flecha">›</span>
          </Link>
        ))}
        {paginados.length === 0 && <p style={{ padding: '20px' }}>No se encontraron informes.</p>}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button onClick={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>← Anterior</button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button onClick={() => cambiarPagina(pagina + 1)} disabled={pagina === totalPaginas}>Siguiente →</button>
        </div>
      )}
    </div>
  );
};

export default InformesPage;
