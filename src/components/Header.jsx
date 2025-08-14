import { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaStoreAlt } from "react-icons/fa";

export default function Header() {
  const { usuario, logout } = useAuth();
    
  const [open, setOpen] = useState(false);
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
    <header className="py-5 bg-gray-900 shadow-xl relative z-50 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Sección izquierda: Logo + Menú + Buscador */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <img
                className="h-10 md:h-12 w-auto"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Wikimedia-logo.png"
                alt="Logo tienda"
              />
              <span className="text-3xl font-extrabold text-white tracking-wider">
                LEDERES
              </span>
            </a>

            {/* Menú hamburguesa */}
            <div className="relative flex justify-center">
              <button
                onClick={() => setOpen(!open)}
                className="text-3xl text-white"
                aria-label="Abrir/Cerrar menú de categorías"
              >
                {open ? <MdClose /> : <FiMenu />}
              </button>

              {open && (
                <div className="absolute left-0 mt-10 w-48 bg-white rounded-md shadow-lg z-50 text-black">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <a href="/categoria/joyeria">Joyería</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <a href="/categoria/accesorios">Accesorios</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <a href="/categoria/ofertas">Ofertas</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      <a href="/categoria/novedades">Novedades</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>

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
                        className="p-2 text-white hover:bg-gray-600 cursor-pointer"
                      >
                        {producto.nombre} - ${producto.precio}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Usuario */}
              <div className="flex items-center gap-4">
                {usuario ? (
                  <>
                    <Link to="/Userinfo"><span>Hola, <b>{usuario.nombre}</b></span></Link>
                    <button 
                      onClick={logout} 
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <a 
                    href="/login" 
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Iniciar sesión
                  </a>
                )}
              </div>
              
              <div>
                <Link to = "/tienda"> <FaStoreAlt size="2em"/> </Link>
              </div>

          </div>

          {/* Sección derecha: Carrito */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleCarrito}
              className="relative p-2 rounded-full hover:scale-105 transition-transform"
              aria-label="Abrir carrito"
            >
              <img
                src="/img/carrito.png"
                alt="Carrito"
                className="w-8 h-8 md:w-10 md:h-10 filter brightness-125"
              />
              {productosEnCarrito.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-gray-900">
                  {productosEnCarrito.length}
                </span>
              )}
            </button>

            {/* Carrito desplegable */}
            {mostrarCarrito && (
              <div className="absolute right-0 mt-4 w-80 md:w-96 bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-6 z-40">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
                  Tu Carrito
                </h3>

                {productosEnCarrito.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    Tu carrito está vacío.
                  </p>
                ) : (
                  <>
                    <div className="max-h-80 overflow-y-auto pr-2">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-300 uppercase text-xs border-b border-gray-700">
                            <th></th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cant.</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {productosEnCarrito.map((prod) => (
                            <tr key={prod.id} className="border-b border-gray-700">
                              <td className="py-3">
                                <img
                                  src={prod.imagen}
                                  alt={prod.nombre}
                                  className="w-12 h-12 object-cover rounded-md border border-gray-700"
                                />
                              </td>
                              <td className="px-2 py-3 text-gray-200 font-medium">
                                {prod.nombre}
                              </td>
                              <td className="py-3 text-white font-semibold">
                                ${prod.precio.toFixed(2)}
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <button className="bg-gray-700 text-gray-200 px-2 py-1 rounded hover:bg-gray-600 text-xs">
                                    -
                                  </button>
                                  <span className="text-gray-200">{prod.cantidad}</span>
                                  <button className="bg-gray-700 text-gray-200 px-2 py-1 rounded hover:bg-gray-600 text-xs">
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 text-center">
                                <button className="text-red-500 hover:text-red-400 font-bold text-lg">
                                  &times;
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-right mt-6 text-gray-200 text-lg font-semibold">
                      Total:{" "}
                      <span className="text-green-500 ml-2">
                        ${totalPagar.toFixed(2)}
                      </span>
                    </p>
                  </>
                )}

                <div className="mt-6 flex flex-col space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold">
                    Finalizar Compra
                  </button>
                  <button
                    className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 font-semibold"
                    onClick={() => console.log("Vaciar carrito")}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menú mobile adicional */}
        {open && (
          <div className="md:hidden mt-4 bg-white text-black rounded-md shadow p-4">
            <ul className="space-y-4">
              <li>
                <a href="/">Inicio</a>
              </li>
              <li>
                <a href="/productos">Productos</a>
              </li>
              <li>
                <a href="/contacto">Contacto</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}