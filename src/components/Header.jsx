import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaStoreAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { usuario, logout } = useAuth();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [query, setQuery] = useState(""); // Texto de búsqueda
  const [resultados, setResultados] = useState([]); // Resultados de búsqueda

  const toggleCarrito = () => setMostrarCarrito(!mostrarCarrito);

  const productos = [
    { id: 1, nombre: "Anillo de Elfo", precio: 120.0 },
    { id: 2, nombre: "Colgante Arwen", precio: 75.5 },
    { id: 3, nombre: "Espada de Gondor", precio: 250.0 },
    { id: 4, nombre: "Capa Elfica", precio: 150.0 },
    { id: 5, nombre: "Arco de Legolas", precio: 180.0 },
    { id: 6, nombre: "Libro de Elfos", precio: 45.0 },
    { id: 7, nombre: "Botas de Hobbit", precio: 80.0 },
    { id: 8, nombre: "Cerveza Enana", precio: 10.0 },
    { id: 9, nombre: "Anillo Único", precio: 300.0 },
    { id: 10, nombre: "Espada de Faramir", precio: 220.0 },
  ];

  const productosEnCarrito = [
    {
      id: 1,
      nombre: "Anillo de Elfo",
      precio: 120.0,
      cantidad: 1,
      imagen: "https://example.com/prod1.jpg",
    },
    {
      id: 2,
      nombre: "Colgante Arwen",
      precio: 75.5,
      cantidad: 2,
      imagen: "https://example.com/prod2.jpg",
    },
    {
      id: 3,
      nombre: "Espada de Gondor",
      precio: 250.0,
      cantidad: 1,
      imagen: "https://www.example.com/images/espada-gondor.jpg",
    },
    {
      id: 4,
      nombre: "Capa Elfica",
      precio: 150.0,
      cantidad: 1,
      imagen: "https://www.example.com/images/capa-elfica.jpg",
    },
    {
      id: 5,
      nombre: "Arco de Legolas",
      precio: 180.0,
      cantidad: 1,
      imagen: "https://www.example.com/images/arco-legolas.jpg",
    },
    {
      id: 6,
      nombre: "Libro de Elfos",
      precio: 45.0,
      cantidad: 3,
      imagen: "https://www.example.com/images/libro-elfos.jpg",
    },
    {
      id: 7,
      nombre: "Botas de Hobbit",
      precio: 80.0,
      cantidad: 2,
      imagen: "https://www.example.com/images/botas-hobbit.jpg",
    },
    {
      id: 8,
      nombre: "Cerveza Enana",
      precio: 10.0,
      cantidad: 6,
      imagen: "https://www.example.com/images/cerveza-enana.jpg",
    },
    {
      id: 9,
      nombre: "Anillo Único",
      precio: 300.0,
      cantidad: 1,
      imagen: "https://www.example.com/images/anillo-unico.jpg",
    },
    {
      id: 10,
      nombre: "Espada de Faramir",
      precio: 220.0,
      cantidad: 1,
      imagen: "https://www.example.com/images/espada-faramir.jpg",
    },
  ];

  const totalPagar = productosEnCarrito.reduce(
    (total, prod) => total + prod.precio * prod.cantidad,
    0
  );

  // Filtrar los productos según el texto de búsqueda
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm === "") {
      setResultados([]); // Si no hay texto, no mostrar resultados
      return;
    }

    // Filtrar los productos por nombre
    const filteredResults = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResultados(filteredResults);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between text-white px-4 py-4 lg:px-20 bg-black shadow-md">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between">
          {/* Sección izquierda: Logo + Menú + Buscador */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <img
                className="h-10 md:h-12 w-auto"
                src="/img/logo1.png"
                alt="Logo tienda"
              />
            </a>

            {/* Buscador */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 w-64">
                <IoSearch className="text-white text-xl" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  aria-label="Buscar productos"
                  value={query}
                  onChange={handleSearch}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                />
              </div>

              {/* Mostrar resultados */}
              {resultados.length > 0 && (
                <div className="absolute bg-gray-800 rounded-md max-h-40 overflow-y-auto mt-2 w-full z-50">
                  <ul>
                    {resultados.map((producto) => (
                      <li
                        key={producto.id}
                        onClick={() => {
                          setQuery("");
                          setResultados([]);
                        }}
                        className="p-2 text-white hover:bg-gray-600 cursor-pointer"
                      >
                        {producto.nombre} - ${producto.precio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Ir a Tienda */}
            <div>
              <Link to="/tienda">
                <FaStoreAlt size="2em" />
              </Link>
            </div>
          </div>

          {/* Sección derecha: Usuario + Carrito */}
          <div className="relative flex items-center gap-6">
            {/* Usuario */}
            <div className="flex items-center gap-4">
              {usuario ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg text-white hover:bg-gray-800 transition"
                  >
                    <FaUserCircle className="text-3xl text-blue-400" />
                    <span>Hola, <b>{usuario.nombre}</b></span>
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Iniciar sesión
                  </a>
                  <a
                    href="/registro"
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Registrarse
                  </a >
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}