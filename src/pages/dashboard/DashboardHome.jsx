"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cliente/dash");
        const data = await res.json();

        // Espera una respuesta tipo { total_registros: 123 }
        setTotalRegistros(data.total_registros);
      } catch (error) {
        console.error("Error al obtener total de registros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-[Sora] mb-4">
        Bienvenido al panel de control My Collection
      </h1>

      {loading ? (
        <p className="text-gray-500">Cargando datos...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Total de registros:
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {totalRegistros}
          </p>
        </div>
      )}
    </div>
  );
}