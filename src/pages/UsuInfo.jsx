import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function UsuInfo() {
  const [usuario, setUsuario] = useState({ id: "", nombre: "", correo: "", rol: "" });
  const [vendedorInfo, setVendedorInfo] = useState(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/users/perfil", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsuario(data);
        if (data.rol === "vendedor") {
          fetch(`http://localhost:3000/vendedores/vendedor/${data.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(info => setVendedorInfo(info))
            .catch(err => console.log("Error al cargar info vendedor:", err));
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // Guardar cambios en el backend
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/users/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(usuario)
    })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Mi Perfil
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Edita tu información personal
          </p>
        </div>

        {/* Formulario de perfil de usuario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="sr-only">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="correo" className="sr-only">Correo</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={usuario.correo}
              onChange={handleChange}
              placeholder="Correo"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="rol" className="sr-only">Rol</label>
            <input
              id="rol"
              type="text"
              name="rol"
              value={usuario.rol}
              disabled
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-600 rounded-md bg-gray-50 cursor-not-allowed sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Guardar cambios
          </button>
        </form>

        {/* Botón para solicitar ser vendedor */}
        {usuario.rol === "usuario" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
              Conviértete en Vendedor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan Básico */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-200 hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-2">Básico</h3>
                <p className="text-5xl font-extrabold text-gray-900 mb-4">$9<span className="text-base font-normal">/mes</span></p>
                <ul className="space-y-2 text-gray-600 mb-6 text-center">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Acceso limitado</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Soporte básico</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> 5 productos</li>
                </ul>
                <button disabled className="w-full bg-indigo-200 text-indigo-700 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50">
                  Elegir plan
                </button>
              </div>

              {/* Plan Estándar (Destacado) */}
              <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center border-4 border-blue-500 transform scale-105">
                <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase absolute top-0 mt-4">Popular</span>
                <h3 className="text-2xl font-bold mb-2 text-blue-600">Estándar</h3>
                <p className="text-6xl font-extrabold text-gray-900 mb-4">$19<span className="text-lg font-normal">/mes</span></p>
                <ul className="space-y-2 text-gray-600 mb-6 text-center">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Acceso completo</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Soporte prioritario</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> 20 productos</li>
                </ul>
                <Link to={"/FormNvend"} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-150 ease-in-out">
                  Elegir plan
                </Link>
              </div>

              {/* Plan Avanzado */}
              <div className="bg-gray-50 rounded-xl shadow-lg p-6 flex flex-col items-center border border-gray-200 hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-bold mb-2">Avanzado</h3>
                <p className="text-5xl font-extrabold text-gray-900 mb-4">$29<span className="text-base font-normal">/mes</span></p>
                <ul className="space-y-2 text-gray-600 mb-6 text-center">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Acceso ilimitado</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Soporte VIP 24/7</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Productos ilimitados</li>
                </ul>
                <button disabled className="w-full bg-indigo-200 text-indigo-700 py-3 rounded-lg font-semibold cursor-not-allowed opacity-50">
                  Elegir plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulario para vendedores */}
        {usuario.rol === "vendedor" && vendedorInfo && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Información de Vendedor</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:3000/vendedores/vendedor/${usuario.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                  body: JSON.stringify(vendedorInfo)
                });
                const data = await res.json();
                alert(data.message);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="nombre_tienda" className="sr-only">Nombre de la tienda</label>
                <input
                  id="nombre_tienda"
                  type="text"
                  name="nombre_tienda"
                  value={vendedorInfo.nombre_tienda}
                  onChange={(e) => setVendedorInfo({ ...vendedorInfo, nombre_tienda: e.target.value })}
                  placeholder="Nombre de la tienda"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="sr-only">Teléfono</label>
                <input
                  id="telefono"
                  type="text"
                  name="telefono"
                  value={vendedorInfo.telefono}
                  onChange={(e) => setVendedorInfo({ ...vendedorInfo, telefono: e.target.value })}
                  placeholder="Teléfono"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="sr-only">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={vendedorInfo.descripcion}
                  onChange={(e) => setVendedorInfo({ ...vendedorInfo, descripcion: e.target.value })}
                  placeholder="Descripción"
                  rows="3"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="logo" className="sr-only">URL del logo</label>
                <input
                  id="logo"
                  type="text"
                  name="logo"
                  value={vendedorInfo.logo}
                  onChange={(e) => setVendedorInfo({ ...vendedorInfo, logo: e.target.value })}
                  placeholder="URL del logo"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                />
              </div>
              {/* Vista previa del logo */}
              {vendedorInfo.logo && (
                <div className="mt-4">
                  <img src={vendedorInfo.logo} alt="Logo de la tienda" className="mx-auto w-24 h-24 object-cover rounded-full shadow-md border-2 border-gray-200" />
                </div>
              )}
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
              >
                Guardar cambios de vendedor
              </button>
            </form>
            <Link 
              to="/FormNuevopr" 
              className="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Crear nuevo producto
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}