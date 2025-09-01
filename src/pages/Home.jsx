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
  const [usuario, setUsuario] = useState([]);


  const URL = "http://localhost:3000/productos"; // ruta de backend
  
  // --- NUEVOS ESTADOS PARA MANEJAR LOS PLANES DINÁMICAMENTE ---
  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    // Cargar el perfil del usuario para los planes 
    fetch("http://localhost:3000/users/perfil", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.id) { // Verificación para asegurar que los datos son válidos
        setUsuario(data);
      }
    })
    .catch(err => console.error("Error al cargar perfil:", err));
    
    //trayendo productos del backend
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

    // Cargar los planes de precios del backend
    fetch("http://localhost:3000/api/planes")
      .then(res => res.json())
      .then(data => {
        setPlanes(data);
      })
      .catch(err => {
        console.error("Error al cargar planes:", err);
      })
      .finally(() => {
        setLoadingPlanes(false); // Quitar el estado de carga al finalizar, tanto si hay éxito como si hay error
      });


    fetchProductos();
  }, []);
  

  return (
    <>
    
      <Header />
    <div className="min-h-screen bg-gray-950 text-white font-sans mt-20">
      
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {productos.map((prod) => (
            <Link
              key={prod.id}
              to={`/product/${prod.id}`}
              className="shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:bg-gray-700/80 group"
            >
              <div className="relative overflow-hidden h-100">
                <img
                  src={prod.imagen || 'https://via.placeholder.com/600x400?text=Sin+Imagen'}
                  alt={prod.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <span className="text-2xl font-bold text-white tracking-wide">${prod.precio.toFixed(2)}</span>
                </div>
              </div>
                <div className="p-4 grid grid-cols-2 items-center gap-2">
                {/* Nombre y descripción (columna izquierda) */}
                  <div>
                  <h3 className="text-lg font-bold text-white truncate">{prod.nombre}</h3>
                  <h3 className="text-lg text-white truncate">{prod.descripcion}</h3>
                        </div>

                        {/* Precio (columna derecha) */}
                        <p className="text-2xl font-bold text-white text-right">
                          S/ {Number(prod.precio).toFixed(2)}
                        </p>
                  </div>
            </Link>
          ))}
        </div>

        {/* --- SECCIÓN 'CONVIÉRTETE EN VENDEDOR' (AHORA DINÁMICA) --- */}
        {usuario.rol === "usuario" && (
          <div className="rounded-3xl p-8 lg:p-12 text-center">
              <h2 className="from-pink-400 to-purple-500 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r mb-4 tracking-tight">
                Conviértete en Vendedor
              </h2>
              <p className="text-lg  mb-10">Elige un plan para empezar a vender tus productos.</p>
              
              {loadingPlanes ? (
                <p className="text-gray-500 text-lg">Cargando planes...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                  {/* AQUÍ COMIENZA EL RENDERIZADO DINÁMICO DE LOS PLANES */}
                  {planes.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`
                        relative shadow-2xl p-10 flex flex-col items-center border-2 scale-[1.05] transition duration-300 transform hover:-translate-y-2`}
                    >
                      {plan.destacado ? (
                        <span className="absolute top-0 right-0 -mt-4 mr-4 bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">Popular</span>
                      ) : null}
                      <h3 className={`font-bold mb-2 ${plan.destacado ? 'text-3xl text-indigo-200' : 'text-2xl text-white'}`}>{plan.nombre}</h3>
                      <p className={`font-extrabold text-white mb-4 ${plan.destacado ? 'text-7xl' : 'text-6xl'}`}>
                        S/{Number(plan.precio).toFixed(0)}
                        <span className="text-base font-normal text-gray-500">{plan.periodo}</span>
                      </p>
                      <ul className="space-y-3 text-indigo-200 mb-8 text-left w-full">
                        {plan.caracteristicas.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-auto w-full">
                        {plan.deshabilitado ? (
                          <button disabled className="w-full bg-indigo-100 text-indigo-700 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 shadow-inner">
                            Elegir plan
                          </button>
                        ) : (
                          <Link 
                            to={plan.url_contratacion} 
                            state={{ plan: plan }} // <-- AÑADIMOS ESTO PARA PASAR EL OBJETO DEL PLAN
                            className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold transition duration-200 shadow-lg text-center">
                            Elegir plan
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

      </main>
      <Footer />
    </div>
    </>
  );
}