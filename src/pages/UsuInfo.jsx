import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserCircle, FaStore, FaEnvelope, FaTag, FaInfoCircle, FaPhone } from 'react-icons/fa';
import Header from "../components/Header";
import Swal from "sweetalert2";
import Footer from "../components/Footer"

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
          fetch(`http://localhost:3000/vendedores/vendedor/usuario/${data.id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(info => setVendedorInfo(info))
            .catch(err => console.log("Error al cargar info vendedor:", err));
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Manejar cambios en los inputs del usuario
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // Guardar cambios en el backend (usuario)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/users/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "¡Perfil actualizado!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo actualizar el perfil",
          icon: "error",
          confirmButtonText: "Cerrar"
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error de conexión con el servidor",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
      console.error(err);
    }
  };

  // Guardar cambios en el backend (vendedor)
  const handleSubmitVendedor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:3000/vendedores/vendedor/${vendedorInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(vendedorInfo)
        }
      );

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: "¡Información de vendedor actualizada!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo actualizar la información del vendedor",
          icon: "error",
          confirmButtonText: "Cerrar"
        });
      }
    } catch (err) {
      console.error("Error al actualizar vendedor:", err);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al actualizar la información del vendedor.",
        icon: "error",
        confirmButtonText: "Cerrar"
      });
    }
  };
  

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Editar Perfil de Usuario</h1>
            <p className="text-gray-500 text-lg mb-8">Administra y actualiza tu información personal.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Sección de Foto de Perfil */}
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl shadow-inner">
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-gray-300">
                  <span className="text-gray-500 text-sm">Sin imagen</span>
                </div>
                <button className="text-blue-600 font-semibold text-base hover:underline transition-colors duration-200">
                  Subir o cambiar foto
                </button>
              </div>

              {/* Formulario de Información del Usuario */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombres</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        value={usuario.nombre}
                        onChange={handleChange}
                        placeholder="Tus Nombres"
                        className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Apellidos</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        defaultValue="Chirre Ynocente"
                        className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="correo"
                        type="email"
                        name="correo"
                        value={usuario.correo}
                        onChange={handleChange}
                        placeholder="Correo Electrónico"
                        className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                  </div>
                  
                  {/* Rol y Teléfono */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="rol"
                        type="text"
                        name="rol"
                        value={usuario.rol}
                        disabled
                        className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        defaultValue="+51 928337352"
                        className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Biografía */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía</label>
                    <div className="mt-1">
                      <textarea
                        rows="4"
                        placeholder="Cuéntanos un poco sobre ti..."
                        className="block w-full p-3 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Género y Cumpleaños */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Género</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-1 text-gray-600">
                        <input type="radio" name="genero" defaultChecked className="form-radio text-blue-600" /> Masculino
                      </label>
                      <label className="flex items-center gap-1 text-gray-600">
                        <input type="radio" name="genero" className="form-radio text-blue-600" /> Femenino
                      </label>
                      <label className="flex items-center gap-1 text-gray-600">
                        <input type="radio" name="genero" className="form-radio text-blue-600" /> Otro
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cumpleaños</label>
                    <div className="mt-1">
                      <input
                        type="date"
                        defaultValue="2005-08-01"
                        className="block w-full p-2 border rounded-xl border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Botón de Guardar */}
                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-md"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Sección de Vendedor (solo si es vendedor) */}
          {usuario.rol === "vendedor" && vendedorInfo && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Información de tu Tienda</h2>
              <p className="text-gray-500 text-lg mb-8">Actualiza los detalles de tu tienda y logo.</p>

              <form onSubmit={handleSubmitVendedor} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nombre de la tienda */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Tienda</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStore className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nombre_tienda"
                      type="text"
                      name="nombre_tienda"
                      value={vendedorInfo.nombre_tienda}
                      onChange={(e) => setVendedorInfo({ ...vendedorInfo, nombre_tienda: e.target.value })}
                      placeholder="Nombre de la tienda"
                      className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono de la Tienda</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="telefono"
                      type="text"
                      name="telefono"
                      value={vendedorInfo.telefono}
                      onChange={(e) => setVendedorInfo({ ...vendedorInfo, telefono: e.target.value })}
                      placeholder="Teléfono"
                      className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* URL del logo */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Logo URL</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaInfoCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="logo"
                      type="text"
                      name="logo"
                      value={vendedorInfo.logo}
                      onChange={(e) => setVendedorInfo({ ...vendedorInfo, logo: e.target.value })}
                      placeholder="URL del logo"
                      className="block w-full pl-10 pr-3 py-2 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    />
                  </div>
                </div>
                
                {/* Descripción y Vista previa del logo */}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                  <div className="mt-1">
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={vendedorInfo.descripcion}
                      onChange={(e) => setVendedorInfo({ ...vendedorInfo, descripcion: e.target.value })}
                      placeholder="Descripción de tu tienda"
                      rows="4"
                      className="block w-full p-3 border rounded-xl border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                    ></textarea>
                  </div>
                  {vendedorInfo.logo && (
                    <div className="mt-6 text-center">
                      <h4 className="text-gray-700 font-semibold mb-2">Previsualización del Logo</h4>
                      <img 
                        src={vendedorInfo.logo} 
                        alt="Logo de la tienda" 
                        className="mx-auto w-32 h-32 object-contain rounded-full shadow-lg border-4 border-gray-100" 
                      />
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 w-full sm:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition duration-200 shadow-md"
                  >
                    Guardar Cambios de Vendedor
                  </button>
                  <Link 
                    to="/FormNuevopr" 
                    className="flex-1 w-full sm:w-auto text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition duration-200 shadow-md"
                  >
                    Crear Nuevo Producto
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* Sección para Conviértete en Vendedor (solo si el rol es 'usuario') */}
          {usuario.rol === "usuario" && (
            <div className="rounded-3xl  p-8 lg:p-12 text-center">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Conviértete en Vendedor 🚀
              </h2>
              <p className="text-lg text-gray-600 mb-10">Elige un plan para empezar a vender tus productos.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Plan Básico */}
                <div className="bg-gray-50 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Básico</h3>
                  <p className="text-6xl font-extrabold text-gray-900 mb-4">S/9<span className="text-base font-normal text-gray-500">/mes</span></p>
                  <ul className="space-y-3 text-gray-600 mb-8 text-left">
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Venta de productos ilimitados</li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Promoción en la pagina web </li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> 5 Anuncios al dia en la radio</li>
                  </ul>
                  <button disabled className="w-full bg-indigo-100 text-indigo-700 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 shadow-inner">
                    Elegir plan
                  </button>
                </div>

                {/* Plan Estándar (Destacado) */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center border-4 border-blue-500 transform scale-105">
                  <span className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase shadow-lg">Popular</span>
                  <h3 className="text-3xl font-bold mb-2 text-blue-600">Estándar</h3>
                  <p className="text-7xl font-extrabold text-gray-900 mb-4">S/19<span className="text-lg font-normal text-gray-500">/mes</span></p>
                  <ul className="space-y-3 text-gray-600 mb-8 text-left">
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Venta de productos ilimitados</li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Promoción en la pagina web y impulso en los productos</li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> 10 Anuncios al dia en la radio</li>
                  </ul>
                  <Link to={"/FormNvend"} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition duration-200 shadow-lg">
                    Elegir plan
                  </Link>
                </div>

                {/* Plan Avanzado */}
                <div className="bg-gray-50 rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Avanzado</h3>
                  <p className="text-6xl font-extrabold text-gray-900 mb-4">S/29<span className="text-base font-normal text-gray-500">/mes</span></p>
                  <ul className="space-y-3 text-gray-600 mb-8 text-left">
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Venta de productos ilimitados</li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> Promoción total</li>
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" /> 20 Anuncios al dia en la radio</li>
                  </ul>
                  <button disabled className="w-full bg-indigo-100 text-indigo-700 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 shadow-inner">
                    Elegir plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
       <Footer/>
    </>
  );
}