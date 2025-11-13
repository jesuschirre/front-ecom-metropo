import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { FaPlus, FaTicketAlt, FaHourglassHalf, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // Iconos para mejora visual

export default function Tickets() {
  const { usuario } = useAuth();
  const [tickets, setTickets] = useState([]);

  // Se eliminan los estados formData y showModal, ya que Swal.fire lo manejará.

  // --- Lógica de Carga de Tickets ---

  // Esperar a que usuario esté disponible y cargar tickets
  useEffect(() => {
    if (!usuario || !usuario.id) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`http://localhost:3000/tickets/${usuario.id}`);
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Error al obtener tickets:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de carga',
            text: 'No se pudieron obtener sus tickets.',
        });
      }
    };
    fetchTickets();
  }, [usuario]);
  
  // Función para recargar la lista de tickets después de una acción
  const recargarTickets = () => {
      if (usuario && usuario.id) {
          // Re-ejecuta el efecto para cargar tickets
          // Se puede hacer una función dedicada o simplemente re-llamar la lógica
          const fetchTickets = async () => {
              try {
                  const res = await fetch(`http://localhost:3000/tickets/${usuario.id}`);
                  const data = await res.json();
                  setTickets(data);
              } catch (error) {
                  console.error("Error al obtener tickets:", error);
              }
          };
          fetchTickets();
      }
  };

  const showCreateTicketModal = () => {
    if (!usuario || !usuario.id) {
        Swal.fire('Error', 'Debe iniciar sesión para crear un ticket.', 'error');
        return;
    }
    Swal.fire({
      title: 'Crear Ticket de Soporte',
      html: `
        <input id="swal-asunto" class="swal2-input custom-swal-input" placeholder="Describe brevemente tu problema" required>
        <select id="swal-categoria" class="swal2-select custom-swal-select" required>
          <option value="">Selecciona una categoría</option>
          <option value="Consulta_General">Consulta General</option>
          <option value="Soporte_Tecnico">Soporte Técnico</option>
          <option value="Mejora_Campana">Mejora de Campaña</option>
          <option value="Facturacion">Facturación</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enviar Ticket',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6', 
      cancelButtonColor: '#6B7280',
      preConfirm: () => {
        const asunto = document.getElementById('swal-asunto').value;
        const categoria = document.getElementById('swal-categoria').value;
        
        if (!asunto.trim() || !categoria) {
          Swal.showValidationMessage('Por favor, completa el asunto y selecciona una categoría.');
          return false;
        }
        return { asunto, categoria };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(result.value.asunto, result.value.categoria);
      }
    });
  };
  
  // Función de envío adaptada para ser llamada desde Swal
  const handleSubmit = async (asunto, categoria) => {
    const ticketData = {
      cliente_id: usuario.id,
      asunto: asunto,
      categoria: categoria,
    };

    try {
      const res = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "¡Ticket creado exitosamente!",
          text: data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        recargarTickets(); // Recargar la lista después de la creación
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "No se pudo crear su ticket",
          icon: "error",
          confirmButtonText: "Cerrar",
        });
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      Swal.fire({
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor",
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };
  
  // --- Estilos y Columnas de DataTable Mejorados ---
  
  const EstadoCell = ({ estado }) => {
    let styleClasses = "font-semibold px-3 py-1 rounded-full text-xs flex items-center justify-center min-w-[110px] shadow-sm";
    let icon = null;

    switch (estado) {
      case "Resuelto":
        styleClasses += " bg-green-100 text-green-700 border border-green-300";
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case "En_Proceso":
        styleClasses += " bg-yellow-100 text-yellow-700 border border-yellow-300";
        icon = <FaHourglassHalf className="mr-1" />;
        break;
      case "Abierto":
        styleClasses += " bg-red-100 text-red-700 border border-red-300";
        icon = <FaExclamationCircle className="mr-1" />;
        break;
      default:
        styleClasses += " bg-gray-100 text-gray-500 border border-gray-300";
        break;
    }

    const displayEstado = estado ? estado.replace('_', ' ') : 'N/A';

    return (
      <span className={styleClasses}>
        {icon}
        {displayEstado}
      </span>
    );
  };

  const columnas = [
    { name: "Asunto", selector: row => row.asunto, sortable: true, wrap: true, minWidth: "250px" },
    { 
      name: "Estado", 
      selector: row => row.estado,
      sortable: true,
      center: true,
      cell: (row) => <EstadoCell estado={row.estado} />,
    },
    { 
        name: "Prioridad", 
        selector: row => row.prioridad || "N/A", 
        sortable: true,
        cell: (row) => (
            <span className={`font-medium ${row.prioridad === 'Alta' ? 'text-red-600' : row.prioridad === 'Media' ? 'text-orange-500' : 'text-green-600'}`}>
                {row.prioridad || 'N/A'}
            </span>
        ),
    },
    { 
        name: "Creación", 
        selector: row => row.fecha_creacion || "N/A", 
        sortable: true,
        cell: (row) => row.fecha_creacion ? new Date(row.fecha_creacion).toLocaleDateString() : 'N/A'
    },
    { name: "Respuesta", selector: row => row.mensaje_remitente || "N/A", wrap: true },
  ];
  
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#E5EEFA",
        color: "#1F2937", 
        fontWeight: "bold",
        fontSize: "15px",
        padding: "12px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        padding: "12px",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: 'rgb(243 244 246)', 
        borderBottomColor: '#FFFFFF',
        borderRadius: '5px',
        cursor: 'pointer',
      },
    },
  };

  return (
    <div >
      <style>{`
        .custom-swal-input, .custom-swal-select {
          display: block;
          width: 90%;
          margin: 10px auto;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          box-sizing: border-box;
          font-size: 16px;
        }
        .swal2-select {
            height: 50px;
        }
      `}</style>
      
      <div className="p-6 mx-auto">
          
        {/* Encabezado y Botón de Creación */}
        <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-extrabold text-white flex items-center">
                <FaTicketAlt className="mr-3 text-white" />
                Mis Tickets de Soporte
            </h2>
            <button
              onClick={showCreateTicketModal}
              className="flex items-center bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition duration-200 shadow-lg cursor-pointer"
            >
                <FaPlus className="mr-2" />
                Crear Nuevo Ticket
            </button>
        </div>
        
        {/* Contenedor de la Tabla */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <DataTable
            title={<span className="text-xl font-semibold text-gray-700">Historial de Solicitudes</span>}
            columns={columnas}
            data={tickets}
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            noDataComponent={
              <div className="p-10 text-center text-gray-500">
                <FaTicketAlt className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-lg">¡Aún no has creado tickets de soporte!</p>
                <p>Haz clic en "Crear Nuevo Ticket" para empezar.</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}