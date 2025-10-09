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

          <div className="font-[Sora] max-w-7xl mx-auto bg-[#232323] rounded-2xl mb-10 lg:p-7">
                <h1 className="font-bold text-xl mb-6 font-sans">Edita Tu Avatar</h1>
                <hr className="my-4 border-t border-gray-700" />
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-gray-300">
                    <span className="text-gray-500 text-sm select-none font-mono">Sin imagen</span>
                  </div>
                  <div className="p-6  ">
                    <h1 className="text-xl font-bold text-white mb-4 font-sans">Agrega un nuevo avatar</h1>
                    <button
                      className="cursor-pointer font-mono flex items-center bg-amber-500 font-semibold px-4 py-2 rounded-md hover:bg-amber-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      type="button"
                    >
                      Subir o cambiar foto
                    </button>
                    <p className="mt-3 text-white text-base font-mono italic">No hay archivos</p>
                  </div>                  
                </div>  
          </div>
          <div className="max-w-7xl mx-auto space-y-12">
           <div className="bg-[#232323] text-white rounded-3xl shadow-2xl p-8 lg:p-10 font-sans">
            <h1 className="font-bold text-xl mb-6  ">Edita Tu Perfil</h1>
            <hr className="my-4 border-t border-gray-700" />

            <div className="grid grid-cols-1 gap-10 mt-5">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold mb-1">Nombres</label>
                    <div className="mt-3 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUserCircle className="h-5 w-5 text-gray-400" /></div>
                      <input id="nombre" type="text" name="nombre" value={usuario.nombre} onChange={handleChange} placeholder="Tus Nombres" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-1">Apellidos</label>
                    <div className="mt-3 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUserCircle className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" defaultValue="Chirre Ynocente" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-lg font-semibol mb-1 ">Email</label>
                    <div className="mt-3 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="h-5 w-5 text-gray-400" /></div>
                      <input id="correo" type="email" name="correo" value={usuario.correo} onChange={handleChange} placeholder="Correo Electrónico" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-1">Rol</label>
                    <div className="mt-3 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaTag className="h-5 w-5" /></div>
                      <input id="rol" type="text" name="rol" value={usuario.rol} disabled className="block w-full pl-10 pr-3 py-2  rounded-xl border-gray-300 bg-[#161616] cursor-not-allowed font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold mb-1">Teléfono</label>
                    <div className="mt-3 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="h-5 w-5 text-gray-400" /></div>
                      <input type="text" defaultValue="+51 928337352" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-lg font-semibold mb-1">Biografía</label>
                    <div className="mt-3"><textarea rows="4" placeholder="Cuéntanos un poco sobre ti..." className="block w-full pl-6 pr-3 py-3 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono"></textarea></div>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button type="submit" className="text-lg font-mono w-full bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition duration-200 shadow-md cursor-pointer">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {usuario.rol === "vendedor" && vendedorInfo && (
            <div className="bg-[#232323] rounded-3xl shadow-2xl p-8 lg:p-10 text-white font-sans">
              <h2 className="font-bold text-xl mb-6">Información De Tu Tienda</h2>
              <hr className="my-4 border-t border-gray-700" />

              <form onSubmit={handleSubmitVendedor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-1">Nombre de la Tienda</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaStore className="h-5 w-5 text-gray-400" /></div>
                    <input id="nombre_tienda" type="text" name="nombre_tienda" value={vendedorInfo.nombre_tienda} onChange={(e) => setVendedorInfo({ ...vendedorInfo, nombre_tienda: e.target.value })} placeholder="Nombre de la tienda" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-1">Teléfono de la Tienda</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaPhone className="h-5 w-5 text-gray-400" /></div>
                    <input id="telefono" type="text" name="telefono" value={vendedorInfo.telefono} onChange={(e) => setVendedorInfo({ ...vendedorInfo, telefono: e.target.value })} placeholder="Teléfono" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono
" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-lg font-semibold mb-1">Logo URL</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaInfoCircle className="h-5 w-5 text-gray-400" /></div>
                    <input id="logo" type="text" name="logo" value={vendedorInfo.logo} onChange={(e) => setVendedorInfo({ ...vendedorInfo, logo: e.target.value })} placeholder="URL del logo" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-lg font-semibold mb-1">banner URL</label>
                  <div className="mt-3 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaInfoCircle className="h-5 w-5 text-gray-400" /></div>
                    <input id="banner" type="text" name="banner" value={vendedorInfo.banner} onChange={(e) => setVendedorInfo({ ...vendedorInfo, banner: e.target.value })} placeholder="URL del logo" className="block w-full pl-10 pr-3 py-2 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono" />
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-lg font-semibold mb-1">Descripción</label>
                  <div className="mt-3"><textarea id="descripcion" name="descripcion" value={vendedorInfo.descripcion} onChange={(e) => setVendedorInfo({ ...vendedorInfo, descripcion: e.target.value })} placeholder="Descripción de tu tienda" rows="4" className="block w-full pl-6 pr-3 py-3 bg-[#161616] text-[#8A8AA0] rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200 font-mono"></textarea></div>
                  {vendedorInfo.logo && (
                    <div className="mt-6 text-center">
                      <h4 className="text-white font-semibold mb-2">Previsualización del Logo</h4>
                      <img src={vendedorInfo.logo} alt="Logo de la tienda" className="mx-auto w-32 h-32 object-contain rounded-full shadow-lg border-4 border-gray-100" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  {vendedorInfo.banner && (
                    <div className="mt-6 text-center">
                      <h4 className="text-white font-semibold mb-2">Previsualización del banner</h4>
                      <img src={vendedorInfo.banner} alt="Logo de la tienda" className="mx-auto w-32 h-32 object-contain rounded-full shadow-lg border-4 border-gray-100" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4 mt-6">
                  <button type="submit" className="font-mono text-lg flex-1 w-full sm:w-auto bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition duration-200 shadow-md cursor-pointer">Guardar Cambios de Vendedor</button>
                </div>
              </form>
            </div>
          )}

          {/* --- SECCIÓN 'CONVIÉRTETE EN VENDEDOR' (AHORA DINÁMICA) --- */}
          {usuario.rol === "usuario" && (
            <div className="rounded-3xl p-8 lg:p-12 text-center">
              <h2 className="text-white text-4xl md:text-5xl font-extrabold  bg-clip-text bg-gradient-to-r mb-4 tracking-tight">
                Conviértete en Vendedor
              </h2>
              <p className="text-lg  mb-10">Elige un plan para empezar a vender tus productos.</p>
              
              {loadingPlanes ? (
                <p className="text-gray-500 text-lg">Cargando planes...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  {/* AQUÍ COMIENZA EL RENDERIZADO DINÁMICO DE LOS PLANES */}
                  {planes.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`
                        relative shadow-2xl p-10 flex flex-col items-center border-2 scale-[1.05] transition duration-300 transform hover:-translate-y-2`}
                    >
                      {plan.destacado ? (
                        <span className="absolute top-0 right-0 -mt-4 mr-4 bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg">Popular</span>
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
                            className="block w-full bg-amber-500 hover:bg-amber-400 text-white py-4 rounded-xl font-bold transition duration-200 shadow-lg text-center">
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