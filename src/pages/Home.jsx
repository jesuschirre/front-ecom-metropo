import Header from "../components/Header";
import Carrucel from "../components/Carrucel";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const URL = "http://localhost:3000/productos"; // Nueva ruta del backend

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();

        // Procesamos precio a número
        const processedData = data.map(prod => ({
          ...prod,
          precio: parseFloat(prod.precio) || 0
        }));

        setProductos(processedData);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No pudimos cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-black text-white">
      <Header />
      <Carrucel />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg leading-tight">
            Bienvenido a Nuestra Tienda
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Descubre nuestros productos disponibles.
          </p>
        </div>

        {loading && (
          <div className="text-center text-xl text-blue-400">Cargando productos...</div>
        )}

        {error && (
          <div className="text-center text-xl text-red-500 bg-red-900/20 p-4 rounded-md mx-auto max-w-lg">
            {error}
          </div>
        )}

        {!loading && !error && productos.length === 0 && (
          <div className="text-center text-xl text-gray-400">No hay productos disponibles.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-blue-500 group"
            >
              <div className="relative overflow-hidden h-60">
                <img
                  src={prod.imagen || 'https://via.placeholder.com/600x400?text=Sin+Imagen'}
                  alt={prod.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-lg font-bold text-white">${prod.precio.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-white mb-2 truncate">{prod.nombre}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{prod.descripcion || 'Sin descripción.'}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Stock: <span className="font-mono text-gray-400">{prod.stock || 'N/A'}</span>
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}