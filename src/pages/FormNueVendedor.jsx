import { useEffect, useState, useRef } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DIAS_SEMANA = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
];

// Componente reutilizable para agrupar secciones del formulario
const FieldGroup = ({ title, children }) => (
    <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-200 mb-8">
        <h3 className="text-xl font-bold text-amber-500 border-b-4 border-amber-400 pb-3 mb-6">{title}</h3>
        {children}
    </div>
);

// Main Component
export default function App() {
    const { usuario } = useAuth();
    // --- ESTADOS DEL FORMULARIO ---

    const [planes, setPlanes] = useState([]); 
    const [planSeleccionado, setPlanSeleccionado] = useState(null);

    // ESTADOS DE LA TABLA 'contrato_publicidad'
    const [nombreCampana, setNombreCampana] = useState(''); 
    const [fechaInicio, setFechaInicio] = useState(""); 
    const [tipoContrato, setTipoContrato] = useState('inicial'); 
    const [detallesAnuncio, setDetallesAnuncio] = useState(''); 
    const [anunciosPorDia, setAnunciosPorDia] = useState(0); 
    const [diasEmision, setDiasEmision] = useState([]); 
    const [nrodiasEscogidos, setNrodiasEscogidos] = useState(0)
    const [MontoAcordado, setMonto_acordado]= useState([]);
    const [Precio_base, setPrecio_base] = useState([]);
    
    const [metodoPago, setMetodoPago] = useState(''); 
    const [comprobante, setComprobante] = useState(null); 
    const [audioAnuncio, setAudioAnuncio] = useState(null);
    const audioRef = useRef(null);

    
     const cargarAudio = (e) => {
      const archivo = e.target.files[0];
      setAudioAnuncio(archivo); // guarda el audio en el estado
    };


    // Fecha mínima = 3 días después de hoy
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 3);

    // FETCH: Cargar planes desde la API /api/planes
    useEffect(() => {
        const fetchPlanes = async () => {
            try {
              const response = await fetch('http://localhost:3000/api/planes');
              if (!response.ok) throw new Error('Error al cargar planes');
              const data = await response.json();
              setPlanes(data);
            } catch (error) {
                console.error("Error al cargar los planes:", error);
                // Manejar error de carga (e.g., mostrar mensaje)
            } 
        };
        fetchPlanes();
    }, []);

    // Sincronizar estados de duración y anuncios con el plan seleccionado
    useEffect(() => {
        if (planSeleccionado) {
            setAnunciosPorDia(planSeleccionado.max_anuncios_por_dia);
            setNrodiasEscogidos(planSeleccionado.max_dias_por_semana)
        }
    }, [planSeleccionado]);

    // Calcular monto acordado: SIEMPRE es el precio base sin descuento
    useEffect(() => {
      if (!planSeleccionado) return;

      const precioBase = planSeleccionado.precio;
      setPrecio_base(precioBase);
      setMonto_acordado(precioBase);
    }, [planSeleccionado]);


    const descuento = '0.00'; // Descuento fijo en cero, como lo solicita el usuario
    
    
    // Maneja la selección de días
    const handleDiaEmisionChange = (day) => {
      setDiasEmision((prev) => {
        // Si el día ya está seleccionado, se quita
        if (prev.includes(day)) {
          return prev.filter((d) => d !== day);
        }

        // Si no está seleccionado y aún no se alcanzó el límite, se agrega
        if (prev.length < nrodiasEscogidos) {
          return [...prev, day];
        }

        // Si intenta pasar el limite
        Swal.fire({
          icon: "warning",
          title: "Límite alcanzado",
          text: `Solo puedes seleccionar ${nrodiasEscogidos} días de emisión.`,
          confirmButtonColor: "#0ea5e9",
          confirmButtonText: "Entendido",
        });

        return prev;
      });
    };

    // cuando se cambie de planSeleccionado se
    useEffect(() => {
    if (planSeleccionado) {
        setDiasEmision([]); // Limpia los días seleccionados
    }
    }, [planSeleccionado]);



    const cargarComprobante = async(e) => {
       const file = e.target.files[0]
        if (!file) return
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "ml_default")

        const res =  await fetch("https://api.cloudinary.com/v1_1/db1a6vi9f/image/upload",{
          method:"POST",
          body:data
        })
        
        const uploadedImageURL = await res.json()
        setComprobante(uploadedImageURL.url)
    }

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!planSeleccionado) {
    Swal.fire({ icon: "warning", title: "Plan no seleccionado", text: "Debe seleccionar un plan antes de continuar." });
    return;
  }

  if (diasEmision.length === 0) {
    Swal.fire({ icon: "warning", title: "Días de emisión faltantes", text: "Debe seleccionar al menos un día." });
    return;
  }

  if (!usuario.id) {
    Swal.fire({ icon: "error", title: "Cliente no válido", text: "Debe seleccionar un cliente válido." });
    return;
  }

  if (!comprobante) {
    Swal.fire({ icon: "info", title: "Comprobante requerido", text: "Debe cargar un comprobante antes de continuar." });
    return;
  }

  // FORM DATA
  const formData = new FormData();
  formData.append("cliente_id", usuario.id);
  formData.append("nombre_campana", nombreCampana);
  formData.append("plan_id", planSeleccionado.id);
  formData.append("fecha_inicio", fechaInicio);
  formData.append("monto_acordado", MontoAcordado);
  formData.append("tipo_contrato", tipoContrato);  
  formData.append("detalles_anuncio", detallesAnuncio);
  formData.append("precio_base", Precio_base);
  formData.append("descuento", descuento);
  formData.append("metodo_pago", metodoPago);

  //  Días de emisión como JSON
  formData.append("dias_emision", JSON.stringify(diasEmision));

  // Anuncios por día
  formData.append("anuncios_por_dia", anunciosPorDia);

  // ARCHIVOS
  formData.append("comprobante_pago", comprobante);
  formData.append("audio_anuncio", audioAnuncio);

  try {
    const apiUrl = "http://localhost:3000/api/contratosySoli/soliCon";

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData, 
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Contrato creado",
        text: result.message || "El contrato fue registrado con éxito.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: result.message || "Ocurrió un problema.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: `No se pudo conectar. ${error.message}`,
    });
  } finally {
    // Limpieza del formulario
    setPlanSeleccionado(null);
    setNombreCampana('');
    setFechaInicio('');
    setTipoContrato('inicial');
    setDetallesAnuncio('');
    setAnunciosPorDia(0);
    setDiasEmision([]);
    setNrodiasEscogidos(0);
    setMonto_acordado([]);
    setPrecio_base([]);
    setMetodoPago('');
    setComprobante(null);
    setAudioAnuncio(null);
    audioRef.current.value = "";
  }
};

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            <Header />

            <main className="flex-grow container mx-auto my-12 px-4 max-w-4xl mt-25">
                <h1 className="text-3xl font-extrabold text-amber-500 mb-8 text-center">
                    Registro de Solicitud de Contrato
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <FieldGroup title="1. Seleccione un Plan">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {planes.length > 0 && planes
                                .map((plan) => {
                                    const isSelected = planSeleccionado?.id === plan.id;
                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => setPlanSeleccionado(plan)}
                                            className={`border rounded-xl p-4 shadow-lg cursor-pointer bg-white transition duration-300 ease-in-out transform hover:scale-[1.02]
                                            ${isSelected ? 'border-amber-500 border-4 shadow-2xl  ' : 'hover:border-amber-400'}`}
                                        >
                                            <h2 className="text-xl font-extrabold text-gray-900 mb-1">{plan.nombre}</h2>
                                            <p className="text-2xl text-sky-700 font-black mt-3">S/ {plan.precio}</p>
                                            <ul className="mt-2 text-xs space-y-1 text-gray-700">
                                                {plan.caracteristicas?.map((carac, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.35a.75.75 0 011.052-.143z" clipRule="evenodd" /></svg>
                                                        {carac}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </FieldGroup>

                    {/* 3. DETALLES DEL CONTRATO */}
                    <FieldGroup title="2. Detalles del Contrato y Publicidad">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Nombre Campaña */}
                            <div className="md:col-span-2">
                                <label htmlFor="nombre_campana" className="block text-sm font-medium text-gray-700">Nombre de la Campaña</label>
                                <input
                                    type="text"
                                    id="nombre_campana"
                                    name="nombre_campana"
                                    value={nombreCampana}
                                    onChange={(e) => setNombreCampana(e.target.value)}
                                    placeholder="Ej: Campaña Verano 2025"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                />
                            </div>

                            {/* Tipo Contrato */}
                            <div>
                                <label htmlFor="tipo_contrato" className="block text-sm font-medium text-gray-700">Tipo de Contrato</label>
                                <select
                                    id="tipo_contrato"
                                    value={tipoContrato}
                                    onChange={(e) => setTipoContrato(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    required
                                >
                                    <option value="inicial">Inicial</option>
                                </select>
                            </div>

                            {/* Fecha Inicio */}
                            <div className="gap-3">
                              <label className="flex items-center text-sm font-semibold text-gray-700">
                                Fecha de Inicio
                              </label>

                              <div className="relative">
                                <DatePicker
                                  selected={fechaInicio ? new Date(fechaInicio) : null}
                                  onChange={(date) => {
                                    if (date) {
                                      const formato = date.toISOString().slice(0, 10); // YYYY-MM-DD
                                      setFechaInicio(formato); 
                                    }
                                  }}
                                  minDate={fechaMinima}
                                  dateFormat="yyyy-MM-dd"
                                  placeholderText="Selecciona una fecha"
                                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-700 shadow-sm focus:ring-offset-1 transition-all duration-150 ease-in-out"
                                  popperClassName="rounded-lg shadow-lg border border-gray-200 bg-white"
                                />
                              </div>
                            </div>
                            
                            {/* Detalles Anuncio */}
                            <div className="md:col-span-2">
                                <label htmlFor="detalles_anuncio" className="block text-sm font-medium text-gray-700">Detalles/Guion del Anuncio</label>
                                <textarea
                                    id="detalles_anuncio"
                                    name="detalles_anuncio"
                                    rows="3"
                                    value={detallesAnuncio}
                                    onChange={(e) => setDetallesAnuncio(e.target.value)}
                                    placeholder="Instrucciones para el locutor, guion, música de fondo, etc."
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                ></textarea>
                            </div>
                            {/* Subir Audio */}
                            <div className="md:col-span-2 mt-2">
                              <label htmlFor="audio_anuncio" className="block text-sm font-medium text-gray-700">
                                Adjuntar Audio (Opcional)
                              </label>

                              <input
                                type="file"
                                id="audio_anuncio"
                                name="audio_anuncio"
                                accept="audio/*"   
                                onChange={cargarAudio}
                                ref={audioRef}
                                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
                                          bg-gray-50 focus:outline-none file:bg-amber-600 file:text-white file:py-2 file:px-4 file:border-none
                                          file:rounded-lg file:cursor-pointer hover:file:bg-amber-700"
                              />
                            </div>
                        </div>
                    </FieldGroup>
                    
                    {/* 4. CONFIGURACIÓN DE EMISIÓN */}
                    <FieldGroup title="3. Configuración de Emisión">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                        {/* Días de Emisión */}
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Días de Emisión
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {DIAS_SEMANA.map((day) => (
                              <div
                                key={day.value}
                                className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors border shadow-sm text-sm
                                  ${
                                    diasEmision.includes(day.value)
                                      ? 'bg-sky-600 text-white border-sky-700 font-semibold'
                                      : 'bg-gray-100 text-gray-700 hover:bg-sky-100'
                                  }`}
                                onClick={() => handleDiaEmisionChange(day.value)}
                              >
                                {day.label}
                              </div>
                            ))}
                          </div>

                          {/* Mostrar mensaje si no seleccionó ningún día */}
                          {diasEmision.length === 0 && (
                            <p className="text-xs text-red-600 mt-1">
                              Selecciona al menos un día de emisión.
                            </p>
                          )}

                          {/* Mostrar contador */}
                          <p className="text-xs text-gray-600 mt-2">
                            Días seleccionados: {diasEmision.length}/{nrodiasEscogidos}
                          </p>
                        </div>
                      </div>
                    </FieldGroup>

                    
                    {/* 5. DATOS DE PAGO Y DESCUENTO (monto_acordado, descuento) */}
                    <FieldGroup title="4. Resumen de Pago">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Precio Base */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    Precio Base del Plan 
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={`S/ ${Precio_base}`}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 text-gray-800 font-bold p-2.5"
                                />
                            </div>

                            {/* Descuento Aplicado */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                     Descuento Aplicado
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={`S/ ${descuento}`}
                                    className="mt-1 block w-full rounded-lg border-red-300 shadow-sm bg-red-50 text-red-800 font-bold p-2.5"
                                />
                            </div>
                            
                            {/* Monto Acordado (Total) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xl font-extrabold text-gray-800">
                                     MONTO TOTAL ACORDADO
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    value={`S/ ${MontoAcordado}`}
                                    className="mt-1 block w-full rounded-lg border-green-500 border-4 shadow-2xl bg-green-50 text-green-800 text-2xl font-extrabold p-3 text-center"
                                />
                            </div>

                            {/* Método de Pago */}
                            <div>
                                <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700">Método de Pago</label>
                                <select
                                    id="metodo_pago"
                                    value={metodoPago}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="yape">yape</option>
                                    <option value="plin">plin</option>
                                </select>
                            </div>
                            
                            {/* Comprobante de Pago */}
                            <div>
                                <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700">Comprobante de Pago</label>
                                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-500 transition-colors">
                                    <input
                                        type="file"
                                        id="comprobante"
                                        name="comprobante"
                                        accept="image/*"
                                        onChange={cargarComprobante}
                                        required
                                        className="hidden"
                                    />
                                    <label htmlFor="comprobante" className="cursor-pointer text-center text-sky-600 hover:text-sky-800">
                                        {comprobante ? (
                                            <span className="text-green-600 font-semibold flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Comprobante Cargado
                                            </span>
                                        ) : (
                                            <>
                                                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                <p className="mt-1 text-sm">Click para subir imagen</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </FieldGroup>

                    {/* Botón de Enviar */}
                    <div className="pt-5 border-t">
                        <button
                            type="submit"
                            disabled={!planSeleccionado || !usuario.id || !comprobante || !nombreCampana || !fechaInicio || !detallesAnuncio}
                            className="w-full justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:bg-gray-400 transition-colors transform hover:scale-[1.005] cursor-pointer"
                        >
                            Enviar Solicitud y Registrar Contrato
                        </button>
                    </div>

                </form>
            </main>

            <Footer />
        </div>
    );
}