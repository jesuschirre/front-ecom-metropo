import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function FormNueVendedor() {
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Recibimos el plan seleccionado desde la página anterior
  const planSeleccionado = location.state?.plan;

  const [form, setForm] = useState({
    metodo_pago: "yape",
    monto: "", // Se llenará automáticamente
    referencia_pago: "",
    comprobante_pago: null,
  });

  // 2. Nuevos estados para una UX profesional (loading y mensajes)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // 3. Efecto para rellenar el monto y manejar si el usuario llega aquí por error
  useEffect(() => {
    if (planSeleccionado && planSeleccionado.precio) {
      // Rellenamos el monto automáticamente con el precio del plan
      setForm(prevForm => ({ ...prevForm, monto: planSeleccionado.precio }));
    } else {
      // Si no hay plan seleccionado, es un error. Redirigimos al perfil.
      console.warn("Acceso a FormNueVendedor sin un plan. Redirigiendo...");
      navigate('/UsuInfo');
    }
  }, [planSeleccionado, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "comprobante_pago") {
      setForm({ ...form, comprobante_pago: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 4. Lógica de envío completamente renovada
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!usuario || !usuario.id) {
      setMessage({ text: "Error de autenticación. Por favor, inicia sesión de nuevo.", type: 'error' });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("usuario_id", usuario.id);
    formData.append("metodo_pago", form.metodo_pago);
    formData.append("monto", form.monto);
    formData.append("referencia_pago", form.referencia_pago);
    formData.append("comprobante_pago", form.comprobante_pago);
    formData.append("plan_nombre", planSeleccionado.nombre); // Enviamos el nombre del plan para el email

    try {
      const res = await fetch("http://localhost:3000/solicitudes/solicitar-vendedor", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar la solicitud.");

      // ÉXITO: Mostramos el mensaje y preparamos la redirección
      setMessage({ text: data.message, type: 'success' });
      
      // La pantalla ya no se queda "en blanco" o con datos. Se limpia y redirige.
      setTimeout(() => {
        navigate('/Userinfo'); // Redirigir al perfil después de 3 segundos
      }, 3500);

    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Mientras se procesa la redirección inicial, mostramos un loader
  if (!planSeleccionado) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Cargando...</p></div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center py-8 bg-black">
        <div className="max-w-lg w-full bg-gray-900 shadow-2xl rounded-xl p-8 transform transition-all">
          <h2 className="text-3xl font-extrabold text-center text-white ">
            Pago del Plan "{planSeleccionado.nombre}"
          </h2>

          <div className="border-l-4 border-blue-500 p-5 my-6 rounded-lg bg-gray-800">
            <p className="text-sm text-gray-300">
              📲 Paga con <strong>Yape</strong> o <strong>Plin</strong> al número:{" "}
              <span className="font-semibold text-blue-400">987 654 321</span> o escanea el QR y sube tu comprobante.
            </p>
            <img src="/qr-yape.png" alt="QR Code" className="w-48 mx-auto mt-4 border-2 border-gray-700 rounded-lg" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 5. Componente de mensajes que reemplaza al alert() */}
            {message.text && (
              <div className={`p-4 text-sm rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Método de pago</label>
              <select name="metodo_pago" value={form.metodo_pago} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading}>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
              </select>
            </div>

            {/* 6. El campo Monto ahora es un input deshabilitado */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Monto a Pagar</label>
              <input type="text" name="monto" value={`S/ ${Number(form.monto).toFixed(2)}`} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white cursor-not-allowed" readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Referencia de pago</label>
              <input type="text" name="referencia_pago" value={form.referencia_pago} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={loading} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Subir comprobante</label>
              <input type="file" name="comprobante_pago" accept="image/*" onChange={handleChange} className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" required disabled={loading} />
            </div>

            {/* 7. El botón ahora muestra el estado de carga */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-wait" disabled={loading}>
              {loading ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
}