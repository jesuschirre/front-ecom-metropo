import Header from "../components/Header";
import Carrucel from "../components/Carrucel";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

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
        setError("No pudimos cargar los productos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <Header />
      <Carrucel />
      <main className="container mx-auto px-4 py-16 lg:py-24">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-2xl leading-tight tracking-tight">
            Descubre Productos Increíbles
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Explora nuestra colección de productos cuidadosamente seleccionados y encuentra lo que necesitas.
          </p>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center text-xl text-cyan-400 animate-pulse">Cargando productos...</div>
        )}
        {error && (
          <div className="text-center text-xl text-red-400 bg-red-900/30 p-6 rounded-lg max-w-lg mx-auto shadow-lg">
            {error}
          </div>
        )}
        {!loading && !error && productos.length === 0 && (
          <div className="text-center text-xl text-gray-500">No hay productos disponibles en este momento.</div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:bg-gray-700/80 group"
            >
              <div className="relative overflow-hidden h-60">
                <img
                  src={prod.imagen || 'https://via.placeholder.com/600x400?text=Sin+Imagen'}
                  alt={prod.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <span className="text-2xl font-bold text-white tracking-wide">${prod.precio.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{prod.nombre}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{prod.descripcion || 'Sin descripción disponible.'}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Stock: <span className="font-mono text-gray-400">{prod.stock || 'N/A'}</span>
                  </span>
                  <button className="bg-cyan-500 text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-cyan-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seller Plans Section */}
        <div className="mt-24 rounded-3xl p-8 lg:p-16 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 mb-4 tracking-tight">
              Conviértete en Vendedor
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Elige un plan que se ajuste a tus necesidades y comienza a vender tus productos en nuestra plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Plan Básico */}
            <div className="bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-700 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <h3 className="text-3xl font-bold text-gray-200 mb-2">Básico</h3>
              <p className="text-6xl font-extrabold text-white mb-6">S/9<span className="text-base font-normal text-gray-400">/mes</span></p>
              <ul className="space-y-4 text-gray-400 mb-8 text-left w-full max-w-sm">
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Venta de productos ilimitados</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Promoción en la página web</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> 5 Anuncios al día en la radio</li>
              </ul>
              <button disabled className="w-full bg-gray-700 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed opacity-70">
                Elegir plan
              </button>
            </div>

            {/* Plan Estándar (Destacado) */}
            <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center border-4 border-indigo-500 transform scale-[1.05]">
              <span className="absolute top-0 right-0 -mt-4 mr-4 bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">Popular</span>
              <h3 className="text-3xl font-bold mb-2 text-indigo-200">Estándar</h3>
              <p className="text-7xl font-extrabold text-white mb-6">S/19<span className="text-lg font-normal text-indigo-300">/mes</span></p>
              <ul className="space-y-4 text-indigo-200 mb-8 text-left w-full max-w-sm">
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Venta de productos ilimitados</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Promoción en la página web e impulso en productos</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> 10 Anuncios al día en la radio</li>
              </ul>
              <Link to={"/FormNvend"} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold transition duration-300 shadow-lg text-center">
                Elegir plan
              </Link>
            </div>

            {/* Plan Avanzado */}
            <div className="bg-gray-800 rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-700 hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <h3 className="text-3xl font-bold text-gray-200 mb-2">Avanzado</h3>
              <p className="text-6xl font-extrabold text-white mb-6">S/29<span className="text-base font-normal text-gray-400">/mes</span></p>
              <ul className="space-y-4 text-gray-400 mb-8 text-left w-full max-w-sm">
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Venta de productos ilimitados</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> Promoción total</li>
                <li className="flex items-center"><FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" /> 20 Anuncios al día en la radio</li>
              </ul>
              <button disabled className="w-full bg-gray-700 text-gray-400 py-4 rounded-xl font-bold cursor-not-allowed opacity-70">
                Elegir plan
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}