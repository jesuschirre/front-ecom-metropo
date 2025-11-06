import { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

// SVG Icons
const HiUser = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a.5.5 0 01.5.5v1.25a.5.5 0 01-1 0V8.5a.5.5 0 01.5-.5zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /><path d="M10 2a8 8 0 018 8v.5c0 .28-.22.5-.5.5h-.75V11a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1.5h-5V11a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-.5H3.5a.5.5 0 01-.5-.5V10a8 8 0 018-8zm-1 7a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const HiSearch = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.433 4.54l3.72 3.72a1 1 0 11-1.414 1.414l-3.72-3.72A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const HiOfficeBuilding = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 00-1 1H5a1 1 0 00-1 1V4zm4 4h4v3H8V8zm-2 5a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75zM8 15a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5A.75.75 0 008 15zm4-2a.75.75 0 00-.75.75v.5a.75.75 0 001.5 0v-.5a.75.75 0 00-.75-.75z" clipRule="evenodd" /></svg>;
const HiMail = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>;
const HiCalendar = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const HiTag = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-3.89-6.95a.75.75 0 011.06 0L10 12.06l2.83-2.84a.75.75 0 111.06 1.06L11.06 13.12a.75.75 0 01-1.06 0L6.11 10.11a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;
const FiDollarSign = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 000 7h1a3.5 3.5 0 010 7H6"></path></svg>;
const FiPercent = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>;


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
        <h3 className="text-xl font-bold text-sky-800 border-b-4 border-sky-300 pb-3 mb-6">{title}</h3>
        {children}
    </div>
);

// Main Component
export default function App() {
    const { usuario } = useAuth();
    
    // --- MOCK API CALLS ---
    const buscarClientePorDocumento = async (documento) => {
        // Simulating API delay and response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (documento === '12345678') { // Mock DNI success
            return {
                clienteId: 5001,
                nombreCompleto: 'Juan Pérez García',
                direccion: 'Calle Falsa 123',
                correo: 'juan.perez@test.com'
            };
        }
        if (documento === '20123456789') { // Mock RUC success
            return {
                clienteId: 5002,
                nombreCompleto: 'Innovaciones S.A.C.',
                direccion: 'Av. Principal 456',
                correo: 'contacto@innovaciones.com'
            };
        }
        throw new Error('Documento no encontrado o cliente no registrado.');
    };
    
    // --- ESTADOS DEL FORMULARIO ---
    const [cliente, setCliente] = useState({
        nombre: '',
        dni: '',
        direccion: '',
        correo: '',
    });
    const [documento, setDocumento] = useState('');
    const [buscandoDoc, setBuscandoDoc] = useState(false);
    const [docError, setDocError] = useState('');

    const [planes, setPlanes] = useState([]); 
    const [planSeleccionado, setPlanSeleccionado] = useState(null);

    // ESTADOS DE LA TABLA 'contrato_publicidad'
    const [nombreCampana, setNombreCampana] = useState(''); 
    const [fechaInicio, setFechaInicio] = useState(''); 
    const [tipoContrato, setTipoContrato] = useState('inicial'); 
    const [detallesAnuncio, setDetallesAnuncio] = useState(''); 
    const [anunciosPorDia, setAnunciosPorDia] = useState(0); 
    const [diasEmision, setDiasEmision] = useState([]); 
    const [nrodiasEscogidos, setNrodiasEscogidos] = useState(0)
    const [MontoAcordado, setMonto_acordado]= useState([]);
    const [Precio_base, setPrecio_base] = useState([]);
    
    const [metodoPago, setMetodoPago] = useState(''); 
    const [comprobante, setComprobante] = useState(null); 
    
    console.log(anunciosPorDia)
    // --- LÓGICA DE CÁLCULO Y EFECTOS ---
    
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
    
    // --- HANDLERS DE FORMULARIO ---

    const handleChangeCliente = (e) => {
        const { name, value } = e.target;
        setCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleBuscarDocumento = async () => {
        if (!documento.trim()) {
            setDocError('Por favor ingresa un número de documento.');
            return;
        }

        setBuscandoDoc(true);
        setDocError('');
        
        try {
            const data = await buscarClientePorDocumento(documento);

            // Autocompletar campos del cliente
            setCliente({
                id: data.clienteId, 
                nombre: data.nombreCompleto || '',
                dni: documento,
                direccion: data.direccion || '',
                correo: data.correo || cliente.correo, 
            });
            setDocError(''); 
            
        } catch (error) {
            console.error('Error al buscar documento:', error);
            setDocError(error.message || 'Error al consultar el documento.');
            setCliente({ id: null, nombre: '', dni: documento, direccion: '', correo: '' });
        } finally {
            setBuscandoDoc(false);
        }
    };
    
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

        // Si intenta pasar el límite
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
      Swal.fire({
        icon: "warning",
        title: "Plan no seleccionado",
        text: "Debe seleccionar un plan antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (diasEmision.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Días de emisión faltantes",
        text: "Debe seleccionar al menos un día de emisión.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!usuario.id) {
      Swal.fire({
        icon: "error",
        title: "Cliente no válido",
        text: "Debe buscar y seleccionar un cliente válido.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!comprobante) {
      Swal.fire({
        icon: "info",
        title: "Comprobante requerido",
        text: "Debe cargar un comprobante de pago antes de continuar.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const datosFormulario = {
      cliente_id: usuario.id,
      nombre_campana: nombreCampana,
      plan_id: planSeleccionado.id,
      fecha_inicio: fechaInicio,
      monto_acordado: MontoAcordado,
      tipo_contrato: tipoContrato,
      contrato_padre_id: null,
      detalles_anuncio: detallesAnuncio,
      tags: null,
      precio_base: Precio_base,
      descuento: descuento,
      dias_emision: diasEmision,
      anuncios_por_dia: anunciosPorDia,
      metodo_pago: metodoPago,
      comprobante_pago: comprobante,
    };

    try {
      console.log("Datos del Contrato Final:", datosFormulario);
      const apiUrl = "http://localhost:3000/api/contratosySoli/soliCon";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormulario),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Contrato creado",
          text: result.message || "El contrato publicitario fue registrado con éxito.",
          confirmButtonColor: "#28a745",
        });
        console.log("Respuesta del servidor:", result);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: result.message || "Ocurrió un problema al guardar el contrato.",
          confirmButtonColor: "#d33",
        });
        console.error("Error al enviar:", result);
      }
    } catch (error) {
      console.error("Error de conexión:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: `No se pudo conectar al servidor. ${error.message}`,
        confirmButtonColor: "#d33",
      });
    }
  };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
            <Header />

            <main className="flex-grow container mx-auto my-12 px-4 max-w-4xl mt-25">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
                    Registro de Solicitud de Contrato
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 1. DATOS DEL CLIENTE */}
                    <FieldGroup title="1. Datos del Cliente">
                        <div className="space-y-6">
                            
                            {/* Buscar por DNI o RUC */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Buscar por DNI / RUC</label>
                                <div className="mt-1 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={documento}
                                        onChange={(e) => setDocumento(e.target.value)}
                                        placeholder="Ingrese DNI o RUC"
                                        className="flex-grow block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleBuscarDocumento}
                                        disabled={buscandoDoc}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white shadow-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                    >
                                        <HiSearch className="w-5 h-5" /> <span>{buscandoDoc ? 'Buscando...' : 'Buscar'}</span>
                                    </button>
                                </div>
                                {docError && <p className="text-xs text-red-600 mt-1">{docError}</p>}
                                {!cliente.id && documento && !buscandoDoc && !docError && <p className="text-sm text-red-600 mt-1 font-medium">⚠️ Cliente no encontrado. Los datos se registrarán manualmente.</p>}
                            </div>

                            {/* Campos del cliente */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-4 border-t border-gray-100">
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <HiUser className="text-sky-600 w-5 h-5" /> Nombre / Razón Social
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={cliente.nombre}
                                        onChange={handleChangeCliente}
                                        placeholder="(Autocompletado o manual)"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <HiTag className="text-sky-600 w-5 h-5" /> DNI / RUC
                                    </label>
                                    <input
                                        type="text"
                                        name="dni"
                                        value={cliente.dni}
                                        onChange={handleChangeCliente}
                                        placeholder="(Autocompletado o manual)"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <HiMail className="text-sky-600 w-5 h-5" /> Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={cliente.correo}
                                        onChange={handleChangeCliente}
                                        placeholder="contacto@empresa.com"
                                        required
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <HiOfficeBuilding className="text-sky-600 w-5 h-5" /> Dirección Fiscal
                                    </label>
                                    <input
                                        type="text"
                                        name="direccion"
                                        value={cliente.direccion}
                                        onChange={handleChangeCliente}
                                        placeholder="(Opcional para DNI, se autocompleta para RUC)"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </FieldGroup>

                    {/* 2. SELECCIÓN DE PLAN (plan_id, precio_base) */}
                    <FieldGroup title="2. Seleccione un Plan (API: /api/planes)">
                        <p className="text-sm text-gray-600 mb-4">
                            El **Precio Base** del plan se usará como **Monto Acordado**. El descuento se establece en **0.00**.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {planes.length > 0 && planes
                                .map((plan) => {
                                    const isSelected = planSeleccionado?.id === plan.id;
                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => setPlanSeleccionado(plan)}
                                            className={`border rounded-xl p-4 shadow-lg cursor-pointer bg-white transition duration-300 ease-in-out transform hover:scale-[1.02]
                                            ${isSelected ? 'border-sky-700 border-4 bg-sky-50 shadow-2xl ring-4 ring-sky-200' : 'hover:border-sky-400'}`}
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
                    <FieldGroup title="3. Detalles del Contrato y Publicidad">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Nombre Campaña */}
                            <div className="md:col-span-2">
                                <label htmlFor="nombre_campana" className="block text-sm font-medium text-gray-700">Nombre de la Campaña (nombre_campana)</label>
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
                                <label htmlFor="tipo_contrato" className="block text-sm font-medium text-gray-700">Tipo de Contrato (tipo_contrato)</label>
                                <select
                                    id="tipo_contrato"
                                    value={tipoContrato}
                                    onChange={(e) => setTipoContrato(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                    required
                                >
                                    <option value="inicial">Inicial</option>
                                    <option value="renovacion">Renovación</option>
                                </select>
                            </div>

                            {/* Fecha Inicio */}
                            <div>
                                <label htmlFor="fecha_inicio" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <HiCalendar className="text-sky-600 w-5 h-5" /> Fecha de Inicio (fecha_inicio)
                                </label>
                                <input
                                    type="date"
                                    id="fecha_inicio"
                                    name="fecha_inicio"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 p-2.5"
                                />
                            </div>
                            
                            {/* Detalles Anuncio */}
                            <div className="md:col-span-2">
                                <label htmlFor="detalles_anuncio" className="block text-sm font-medium text-gray-700">Detalles/Guion del Anuncio (detalles_anuncio)</label>
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

                        </div>
                    </FieldGroup>
                    
                    {/* 4. CONFIGURACIÓN DE EMISIÓN */}
                    <FieldGroup title="4. Configuración de Emisión">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                        {/* Días de Emisión */}
                        <div className="md:col-span-3 mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Días de Emisión (dias_emision)
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
                    <FieldGroup title="5. Resumen de Pago (Sin Descuento)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            
                            {/* Precio Base */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FiDollarSign className="text-sky-600 w-5 h-5" /> Precio Base del Plan (precio_base)
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
                                    <FiPercent className="text-red-600 w-5 h-5" /> Descuento Aplicado (descuento)
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
                                    <FiDollarSign className="text-green-600 w-6 h-6" /> MONTO TOTAL ACORDADO (monto_acordado)
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
                                <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700">Método de Pago (metodo_pago)</label>
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
                                <label htmlFor="comprobante" className="block text-sm font-medium text-gray-700">Comprobante de Pago (comprobante_pago)</label>
                                <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-500 transition-colors">
                                    <input
                                        type="file"
                                        id="comprobante"
                                        name="comprobante"
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
                            disabled={!planSeleccionado || !usuario.id || !comprobante}
                            className="w-full justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:bg-gray-400 transition-colors transform hover:scale-[1.005]"
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