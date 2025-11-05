"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        // 👇 Llama a tu endpoint que devuelve ambos conteos
        const res = await fetch("http://localhost:3000/api/cliente/dash");
        const data = await res.json();
        console.log(data)
        // Espera algo así: { total_registros: 5, total_clientes: 10 }
        setTotalRegistros(data.total_usuarios || 0);
        setTotalClientes(data.total_clientes || 0);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-[Sora] mb-4 text-white">
        Bienvenido al panel de control My Collection
      </h1>

      {loading ? (
        <p className="text-gray-400">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tarjeta: Total de Usuarios */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Total de Usuarios
            </h2>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {totalRegistros}
            </p>
          </div>

          {/* Tarjeta: Total de Clientes */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Total de Clientes
            </h2>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {totalClientes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}