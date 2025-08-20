import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaUserCircle, FaStore, FaEnvelope, FaTag, FaInfoCircle, FaPhone } from 'react-icons/fa';
import Swal from "sweetalert2";


export default function Perfil() {
  const [usuario, setUsuario] = useState({ id: "", nombre: "", correo: "", rol: "" });
  const [vendedorInfo, setVendedorInfo] = useState(null);
  
  // --- NUEVOS ESTADOS PARA MANEJAR LOS PLANES DINÁMICAMENTE ---
  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);

  // --- USEEFFECT ACTUALIZADO PARA CARGAR DATOS DE USUARIO Y PLANES ---
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Cargar el perfil del usuario
    fetch("http://localhost:3000/users/perfil", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.id) { // Verificación para asegurar que los datos son válidos
        setUsuario(data);
        if (data.rol === "vendedor") {
          fetch(`http://localhost:3000/vendedores/vendedor/usuario/${data.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
          .then(res => res.json())
          .then(info => setVendedorInfo(info))
          .catch(err => console.error("Error al cargar info vendedor:", err));
        }
      }
    })
    .catch(err => console.error("Error al cargar perfil:", err));

    // 2. Cargar los planes de precios desde la nueva API
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
      
  }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

  // --- FUNCIONES HANDLER (SIN CAMBIOS) ---
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/users/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(usuario)
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ title: "¡Perfil actualizado!", text: data.message, icon: "success", timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ title: "Error", text: data.message || "No se pudo actualizar el perfil", icon: "error", confirmButtonText: "Cerrar" });
      }
    } catch (err) {
      Swal.fire({ title: "Error", text: "Error de conexión con el servidor", icon: "error", confirmButtonText: "Cerrar" });
      console.error(err);
    }
  };

  const handleSubmitVendedor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/vendedores/vendedor/${vendedorInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(vendedorInfo)
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ title: "¡Información de vendedor actualizada!", text: data.message, icon: "success", timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire({ title: "Error", text: data.message || "No se pudo actualizar la info", icon: "error", confirmButtonText: "Cerrar" });
      }
    } catch (err) {
      console.error("Error al actualizar vendedor:", err);
      Swal.fire({ title: "Error", text: "Hubo un error al actualizar la información del vendedor.", icon: "error", confirmButtonText: "Cerrar" });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br py-7 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="bg-[#232323] text-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Editar Perfil de Usuario</h1>
            <p className="text-lg mb-8">Administra y actualiza tu información personal.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl shadow-inner">
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-gray-300">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
                <button className="text-blue-600 font-semibold text-base hover:underline transition-colors duration-200">
                  Subir o cambiar foto
                </button>
              </div>

              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nombres</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUserCircle className="h-5 w-5 text-gray-400" /></div>
                      <input id="nombre" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Tus Nombres" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Apellidos</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUserCircle className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" defaultValue="Chirre Ynocente" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibol mb-1">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="h-5 w-5 text-gray-400" /></div>
                      <input id="correo" type="email" name="correo" value={usuario.correo} onChange={handleChange} placeholder="Correo Electrónico" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Rol</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaTag className="h-5 w-5" /></div>
                      <input id="rol" type="text" name="rol" value={usuario.rol} disabled className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 bg-gray-100 cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Teléfono</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" defaultValue="+51 928337352" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">Biografía</label>
                    <div className="mt-1"><textarea rows="4" placeholder="Cuéntanos un poco sobre ti..." className="block w-full p-3 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"></textarea></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Género</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1"><input type="radio" name="genero" defaultChecked className="form-radio text-blue-600" /> Masculino</label>
                      <label className="flex items-center gap-1"><input type="radio" name="genero" className="form-radio text-blue-600" /> Femenino</label>
                      <label className="flex items-center gap-1"><input type="radio" name="genero" className="form-radio text-blue-600" /> Otro</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Cumpleaños</label>
                    <div className="mt-1"><input type="date" defaultValue="2005-08-01" className="block w-full p-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" /></div>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-md">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {usuario.rol === "vendedor" && vendedorInfo && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Información de tu Tienda</h2>
              <p className="text-gray-500 text-lg mb-8">Actualiza los detalles de tu tienda y logo.</p>
              <form onSubmit={handleSubmitVendedor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Tienda</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaStore className="h-5 w-5 text-gray-400" /></div>
                    <input id="nombre_tienda" type="text" name="nombre_tienda" value={vendedorInfo.nombre_tienda} onChange={(e) => setVendedorInfo({ ...vendedorInfo, nombre_tienda: e.target.value })} placeholder="Nombre de la tienda" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de la Tienda</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="h-5 w-5 text-gray-400" /></div>
                    <input id="telefono" type="text" name="telefono" value={vendedorInfo.telefono} onChange={(e) => setVendedorInfo({ ...vendedorInfo, telefono: e.target.value })} placeholder="Teléfono" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaInfoCircle className="h-5 w-5 text-gray-400" /></div>
                    <input id="logo" type="text" name="logo" value={vendedorInfo.logo} onChange={(e) => setVendedorInfo({ ...vendedorInfo, logo: e.target.value })} placeholder="URL del logo" className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200" />
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                  <div className="mt-1"><textarea id="descripcion" name="descripcion" value={vendedorInfo.descripcion} onChange={(e) => setVendedorInfo({ ...vendedorInfo, descripcion: e.target.value })} placeholder="Descripción de tu tienda" rows="4" className="block w-full p-3 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"></textarea></div>
                  {vendedorInfo.logo && (
                    <div className="mt-6 text-center">
                      <h4 className="text-gray-700 font-semibold mb-2">Previsualización del Logo</h4>
                      <img src={vendedorInfo.logo} alt="Logo de la tienda" className="mx-auto w-32 h-32 object-contain rounded-full shadow-lg border-4 border-gray-100" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4 mt-6">
                  <button type="submit" className="flex-1 w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition duration-200 shadow-md">Guardar Cambios de Vendedor</button>
                  <Link to="/FormNuevopr" className="flex-1 w-full sm:w-auto text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-md">Crear Nuevo Producto</Link>
                </div>
              </form>
            </div>
          )}

          {/* --- SECCIÓN 'CONVIÉRTETE EN VENDEDOR' (AHORA DINÁMICA) --- */}
          {usuario.rol === "usuario" && (
            <div className="rounded-3xl p-8 lg:p-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Conviértete en Vendedor 🚀
              </h2>
              <p className="text-lg text-gray-600 mb-10">Elige un plan para empezar a vender tus productos.</p>
              
              {loadingPlanes ? (
                <p className="text-gray-500 text-lg">Cargando planes...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* AQUÍ COMIENZA EL RENDERIZADO DINÁMICO DE LOS PLANES */}
                  {planes.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`
                        bg-gray-50 rounded-2xl shadow-xl p-8 flex flex-col items-center border hover:shadow-2xl transition duration-300 transform hover:-translate-y-1
                        ${plan.destacado ? 'relative bg-white border-4 border-blue-500 scale-105' : 'border-gray-200'}
                      `}
                    >
                      {plan.destacado ? (
                        <span className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase shadow-lg">Popular</span>
                      ) : null}
                      <h3 className={`font-bold mb-2 ${plan.destacado ? 'text-3xl text-blue-600' : 'text-2xl text-gray-800'}`}>{plan.nombre}</h3>
                      <p className={`font-extrabold text-gray-900 mb-4 ${plan.destacado ? 'text-7xl' : 'text-6xl'}`}>
                        S/{Number(plan.precio).toFixed(0)}
                        <span className="text-base font-normal text-gray-500">{plan.periodo}</span>
                      </p>
                      <ul className="space-y-3 text-gray-600 mb-8 text-left w-full">
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
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition duration-200 shadow-lg text-center">
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
        </div>
      </div>
    </>
  );
}