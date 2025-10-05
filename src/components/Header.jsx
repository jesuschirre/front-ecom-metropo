import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaStoreAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { DrawerCellPhone } from "./DrawerCellphone";

export default function Header() {
  const { usuario, logout } = useAuth();

  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 🟢 Nuevo hook

  const toggleCarrito = () => setMostrarCarrito(!mostrarCarrito);
  const openDrawer = () => setIsDrawerOpen(true);           // 🟢 Abre sidebar
  const closeDrawer = () => setIsDrawerOpen(false);         // 🟢 Cierra sidebar

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

  const productosEnCarrito = [ /* ... */ ];

  const totalPagar = productosEnCarrito.reduce(
    (total, prod) => total + prod.precio * prod.cantidad,
    0
  );

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    if (searchTerm === "") {
      setResultados([]);
      return;
    }

    const filteredResults = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setResultados(filteredResults);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between text-white px-4 py-4 lg:px-20 bg-black shadow-md">
        <div className="container mx-auto ">
          <div className="flex items-center justify-between">
            {/* Sección izquierda */}
            <div className="flex items-center gap-6 ">
              <a href="/" className="flex items-center space-x-3">
                <img
                  className="h-10 md:h-12 w-auto"
                  src="/img/logo1.png"
                  alt="Logo tienda"
                />
              </a>

              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 w-64">
                  <IoSearch className="text-white text-xl" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={query}
                    onChange={handleSearch}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                </div>

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

              <div>
                <Link to="/tienda">
                  <FaStoreAlt size="2em" />
                </Link>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="relative flex items-center gap-6">
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
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <div className="hidden md:flex gap-2 pl-2">
                      <button className="bg-amber-400 px-3 py-2 rounded hover:bg-amber-500 font-mono">
                        <a href="/login">Iniciar sesión</a>
                      </button>
                      <button className="bg-green-600 px-3 py-2 rounded hover:bg-green-700 font-mono">
                        <a href="/registro">Registrarse</a>
                      </button>
                    </div>

                    {/* Icono hamburguesa para móvil */}
                    <div className="md:hidden cursor-pointer" onClick={openDrawer}>
                      <GiHamburgerMenu className="text-3xl" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔽 Drawer celular (Sidebar derecho móvil) */}
      <DrawerCellPhone isOpen={isDrawerOpen} onClose={closeDrawer} user={usuario}/>
    </>
  );
}
