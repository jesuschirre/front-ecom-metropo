import { useEffect, useState } from 'react';
import { 
  HiUser, HiPlus, HiSearch, HiOfficeBuilding, HiMail
} from 'react-icons/hi';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Componente reutilizable para agrupar secciones del formulario
const FieldGroup = ({ title, children }) => (
  <div className="bg-white p-6 shadow-sm rounded-lg border mb-8">
    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">{title}</h3>
    {children}
  </div>
);

export default function FormNueVendedor() {

  // Estados del formulario
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
  console.log(planSeleccionado)

  const [nombreCampana, setNombreCampana] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [comprobante, setComprobante] = useState(null);
  console.log(comprobante)

  // Traer los planes
  useEffect ( () => {
    // cargar los planes
    fetch("http://localhost:3000/api/planes")
    .then((res) => res.json())
    .then((data) => setPlanes(data))
    .catch((err) => console.error("Error al cargar planes:", err))
  }, []);

  //  Buscar cliente por DNI/RUC
  const handleBuscarDocumento = async () => {
    if (!documento.trim()) {
      setDocError('Por favor ingresa un número de documento.');
      return;
    }

    setBuscandoDoc(true);
    setDocError('');

    try {
      const response = await fetch(`http://localhost:3000/api/consultas_admin/documento/${documento}`);
      const data = await response.json();

      if (data.error) {
        setDocError(data.error);
        return;
      }

      // Autocompletar campos del cliente
      setCliente({
        nombre: data.nombreCompleto || '',
        dni: documento,
        direccion: data.direccion || '',
        correo: cliente.correo,
      });
    } catch (error) {
      console.error('Error al buscar documento:', error);
      setDocError('Error al consultar el documento.');
    } finally {
      setBuscandoDoc(false);
    }
  };

  // Manejar cambios en los inputs del cliente
  const handleChangeCliente = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  // Manejo de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const datosFormulario = {
      cliente,
      nombreCampana,
      metodoPago,
      comprobante,
    };

    console.log('Datos del contrato:', datosFormulario);
    alert('Formulario enviado correctamente ');
  };


  const cargarImagnes = async(e) => {
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

  return (
    <>
      <Header />

      <div className="container mx-auto my-24 px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* DATOS DEL CLIENTE */}
          <FieldGroup title="1. Datos del Cliente">
            <div className="space-y-6">
              
              {/* Botón crear nuevo cliente */}
              <div className="flex gap-1 mb-4 border border-gray-200 rounded-lg p-1 bg-gray-100">
                <button
                  type="button"
                  className="w-full justify-center px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                  onClick={() => setCliente({ nombre: '', dni: '', direccion: '', correo: '' })}
                >
                  <HiPlus /> Crear Nuevo Cliente
                </button>
              </div>

              {/* Buscar por DNI o RUC */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Buscar por DNI / RUC</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Ingrese DNI o RUC"
                    className="flex-grow block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleBuscarDocumento}
                    disabled={buscandoDoc}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-600 text-white shadow-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    <HiSearch /> <span>{buscandoDoc ? 'Buscando...' : 'Buscar'}</span>
                  </button>
                </div>
                {docError && <p className="text-xs text-red-600 mt-1">{docError}</p>}
              </div>

              {/* Campos del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-4 border-t">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <HiUser /> Nombre / Razón Social
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={cliente.nombre}
                    onChange={handleChangeCliente}
                    placeholder="(Se autocompleta)"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <HiUser /> DNI / RUC
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={cliente.dni}
                    onChange={handleChangeCliente}
                    placeholder="(Se autocompleta)"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <HiOfficeBuilding /> Dirección Fiscal
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={cliente.direccion}
                    onChange={handleChangeCliente}
                    placeholder="(Opcional para DNI, se autocompleta para RUC)"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <HiMail /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={cliente.correo}
                    onChange={handleChangeCliente}
                    placeholder="contacto@empresa.com"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          </FieldGroup>

        {/*  PLAN */}
          <FieldGroup title="2. Seleccione un Plan">
              <p className="text-sm text-gray-600 mb-4">
                Aquí puedes seleccionar uno de los planes disponibles.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planes.length > 0 ? (
                  planes.map((plan) => {
                    const isSelected = planSeleccionado === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setPlanSeleccionado(plan.precio,plan.max_anuncios_por_dia)}
                        className={`border rounded-lg p-4 shadow-sm cursor-pointer bg-white transition
                          ${isSelected ? 'border-sky-600 border-2 bg-sky-100 shadow-md' : 'hover:shadow-md'}`}
                      >
                        <h2 className="text-lg font-semibold text-gray-800">{plan.nombre}</h2>
                        <p className="text-sm text-gray-600">{plan.descripcion}</p>
                        <p className="text-sky-700 font-bold mt-2">S/ {plan.precio}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No hay planes disponibles.</p>
                )}
              </div>
            </FieldGroup>


          {/* DETALLES DEL CONTRATO */}
          <FieldGroup title="3. Detalles Finales del Contrato">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <label htmlFor="nombre_campana" className="block text-sm font-medium text-gray-700">Nombre de la Campaña</label>
                <input
                  type="text"
                  id="nombre_campana"
                  name="nombre_campana"
                  value={nombreCampana}
                  onChange={(e) => setNombreCampana(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
            </div>
          </FieldGroup>

          {/* MÉTODO DE PAGO */}
          <FieldGroup title="4. Datos de Pago">
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
              required
            >
              <option value="">Selecciona un método</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </FieldGroup>

          {/* COMPROBANTE */}
          <FieldGroup title="5. Comprobante de Pago">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={cargarImagnes}
              className="mt-2 block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700"
            />
          </FieldGroup>

          {/* BOTÓN FINAL */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md font-medium shadow-md"
            >
              Guardar Contrato
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}