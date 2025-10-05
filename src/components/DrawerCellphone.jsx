import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
export const DrawerCellPhone = ({ isOpen, onClose,user }) => {
  return (

    <div className="md:hidden">
      {/* Fondo oscuro semitransparente */}
      <div
        className={`fixed inset-0  bg-opacity-50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer derecho */}
      <div
        className={`fixed top-0 right-0 h-full w-[45%] max-w-sm bg-black text-white z-50 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Contenido */}
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-lg font-semibold">Menú</h2>
          <button onClick={onClose} className="text-white text-2xl">&times;</button>
        </div>
        {user ? <div> asds</div>:    <div className="flex flex-col justify-center  p-2 space-y-2">
      <button className="flex items-center justify-center gap-2 p-2 font-bold cursor-pointer  hover:text-gray-200 transition-colors duration-300 ">
        <FaSignInAlt className="text-xl" />
          <a href="/login">Iniciar Sesión</a>
   
      </button>
      <button className="flex items-center justify-center gap-2 p-2 font-bold cursor-pointer hover:text-gray-200 transition-colors duration-300">
        <FaUserPlus className="text-xl" />
         <a href="/registro">Registrarse</a>
      </button>
    </div>}

      </div>
    </div>

  );
};
