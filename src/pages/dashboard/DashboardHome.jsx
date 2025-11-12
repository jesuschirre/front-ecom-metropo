import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHome() {
  const { usuario } = useAuth();
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🧠 Esperar a que el usuario esté disponible antes de ejecutar la consulta
    if (!usuario || !usuario.id) return;
    const fetchData = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/users/contra_usu/${usuario.id}`);
        const data = await respuesta.json();

        console.log("Respuesta del backend:", data);

        if (Array.isArray(data.contratos)) {
          setContratos(data.contratos);
        } else {
          console.error("La respuesta no contiene un array válido:", data);
          setContratos([]);
        }
      } catch (error) {
        console.error("Error al obtener los contratos:", error);
        setContratos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usuario]); // Solo se ejecuta cuando 'usuario' cambia y no es null

  const columnas = [
    { name: "Campaña", selector: row => row.nombre_campana, sortable: true },
    { name: "Estado", selector: row => row.estado, sortable: true },
    { name: "Fecha inicio", selector: row => row.fecha_inicio || "N/A" },
    { name: "Fecha fin", selector: row => row.fecha_fin || "N/A" },
    { name: "Cliente", selector: row => row.nombre_cliente, sortable: true },
    {
      name: "PDF",
      cell: row =>
        row.pdf_url ? (
          <a
            href={`${row.pdf_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver PDF
          </a>
        ) : (
          "Sin PDF"
        )
    }
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <DataTable
          title="Contratos del usuario"
          columns={columnas}
          data={contratos}
          progressPending={loading}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
}