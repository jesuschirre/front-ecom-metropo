import { useState, useEffect } from "react";

const Productos = () => {
  const [vendedorProd, setVendedorProd] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/productos/mis-productos", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setVendedorProd(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Mis Productos</h2>

      <div className="space-y-4">
        {vendedorProd && vendedorProd.length > 0 ? (
          vendedorProd.map((prod) => (
            <div
              key={prod.id}
              className="grid grid-cols-6 gap-2 items-center bg-gray-800 p-3 rounded-lg shadow border border-gray-700"
            >
              <input
                type="text"
                defaultValue={prod.nombre}
                className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-white placeholder-gray-400"
              />
              <input
                type="text"
                defaultValue={prod.descripcion}
                className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-white placeholder-gray-400"
              />
              <input
                type="text"
                defaultValue={prod.precio}
                className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-white placeholder-gray-400"
              />
              <input
                type="text"
                defaultValue={prod.imagen}
                className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-white placeholder-gray-400"
              />
              <input
                type="text"
                defaultValue={prod.categoria_nombre}
                className="bg-gray-900 border border-gray-700 p-2 rounded w-full text-white placeholder-gray-400"
              />
              <div className="flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition">
                  Editar
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Productos;
