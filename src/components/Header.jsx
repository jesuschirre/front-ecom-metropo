import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
export default function Header() {
  const { usuario, logout } = useAuth();
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between text-white p-4 lg:px-20 bg-black shadow-md">
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
            </div>

            {/* Sección derecha */}
            <div className="relative flex items-center gap-6">
              <div className="flex items-center gap-4">
                {usuario ? (
                  <>
                    <Link 
                      to="/dashboard/Perfil"
                      className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg text-white hover:bg-gray-800 transition"
                    >
                      <FaUserCircle className="text-3xl text-blue-400" />
                      <span>Hola, <b>{usuario.nombre}</b></span>
                    </Link>
                    <button
                      onClick={logout}
                      className="bg-red-500 px-3 py-2 rounded hover:bg-red-600 text-black font-mono cursor-pointer "
                    >
                      <b>Cerrar sesión</b> 
                    </button>
                  </>
                ) : (
                  <>
                    <div className="hidden md:flex gap-2 pl-2">
                      <Link className="bg-amber-200 text-black px-3 py-2 rounded hover:bg-yellow-400 font-mono cursor-pointer" to="/login">
                        Iniciar sesión
                      </Link>
                      <Link className="bg-green-500 text-black px-3 py-2 rounded hover:bg-green-600 font-mono cursor-pointer" to="/registro">
                        Registrarse
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
