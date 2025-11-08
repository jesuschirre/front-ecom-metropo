import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { usuario } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [loadingPlanes, setLoadingPlanes] = useState(true);
  
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    // Cargar los planes
    fetch("http://localhost:3000/api/planes")
      .then((res) => res.json())
      .then((data) => setPlanes(data))
      .catch((err) => console.error("Error al cargar planes:", err))
      .finally(() => setLoadingPlanes(false));
  }, []);

  //controlar la navegacion de los planes
  const handleNavigate = () => {
    // Si el usuario no está logueado
    if (!usuario || !usuario.id) {
      Swal.fire({
        title: "Error",
        text: "Por favor, regístrate o inicia sesión para continuar.",
        icon: "error",
        confirmButtonText: "Ir al registro",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/registro"); // Redirige después de aceptar
        }
      });
      return;
    }
    // Si está logueado, lo lleva al formulario
    navigate("/FormNvend");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-50 text-white font-sans mt-18">
        <section
          id="inicio"
          className="relative bg-cover bg-center bg-no-repeat text-white py-32 overflow-hidden"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/33923596/pexels-photo-33923596.jpeg')",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in font-mono">
              ¡Lleva tu marca al aire con Radio Metropoli!
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 font-mono">
              Conecta con miles de oyentes leales y promociona tu negocio con
              espacios publicitarios personalizados y efectivos. ¡Tu audiencia
              te espera!
            </p>
            <button
              onClick={handleNavigate}
              className="font-mono bg-amber-200 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg transform hover:scale-105 cursor-pointer"
            >
              ¡Anuncia Ahora!
            </button>
          </div>
        </section>

        {/* --- POR QUÉ ANUNCIAR --- */}
        <div className="flex flex-col items-center justify-center bg-white p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 text-center mb-8">
            ¿POR QUÉ ANUNCIAR EN METROPOLI IMPULSA TU <br /> MARCA?
          </h2>

          <div className="relative bg-white border border-black shadow-md px-6 py-6 max-w-3xl text-center">
            <p className="text-gray-800 text-lg">
              <strong>
                Ofrecemos soluciones modernas y efectivas para que tu marca
                brille en el éter radial.
              </strong>
              , ofreciendo soluciones personalizadas para impulsar tu negocio
              con innovación y creatividad.
            </p>
          </div>
        </div>

        {/* --- SECCIÓN DE PLANES --- */}
        <main className="container mx-auto px-4 py-16 lg:py-5">
          <div className="rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="text-amber-500 text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Nuestros Servicios de Publicidad
            </h2>
            <p className="text-lg mb-10 text-black">
              Elige un plan para empezar a publicitar tu marca con nosotros.
            </p>

            {loadingPlanes ? (
              <p className="text-white text-lg">Cargando planes...</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
                {planes.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-black relative shadow-2xl p-10 flex flex-col items-center scale-[1.05] transition duration-300 transform hover:-translate-y-2"
                  >
                    <h3
                      className={`font-bold mb-2 ${
                        plan.destacado
                          ? "text-3xl text-white"
                          : "text-2xl text-white"
                      }`}
                    >
                      {plan.nombre}
                    </h3>

                    <p
                      className={`font-extrabold text-white mb-4 ${
                        plan.destacado ? "text-7xl" : "text-6xl"
                      }`}
                    >
                      S/{Number(plan.precio).toFixed(0)}
                      <span className="text-base font-normal text-white">
                        {plan.periodo}
                      </span>
                    </p>

                    <ul className="space-y-3 text-white mb-8 text-left w-full">
                      {plan.caracteristicas.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />{" "}
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto w-full">
                      {plan.deshabilitado ? (
                        <button
                          disabled
                          className="w-full bg-indigo-100 text-indigo-700 py-4 rounded-xl font-bold cursor-not-allowed opacity-50 shadow-inner"
                        >
                          Elegir plan
                        </button>
                      ) : (
                        <button
                          onClick={handleNavigate}
                          className="cursor-pointer font-mono block w-full bg-amber-200 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold transition duration-200 shadow-lg text-center"
                        >
                          Elegir plan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}