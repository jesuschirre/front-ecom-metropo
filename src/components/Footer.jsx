export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo y descripción */}
        <div>
          <h2 className="text-2xl font-bold text-white">LEDERES</h2>
          <p className="mt-4 text-gray-400">
            Tu tienda de confianza para artículos únicos del mundo fantástico.
          </p>
        </div>

        {/* Links rápidos */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Enlaces rápidos</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Inicio</a></li>
            <li><a href="#" className="hover:text-white transition">Productos</a></li>
            <li><a href="#" className="hover:text-white transition">Categorías</a></li>
            <li><a href="#" className="hover:text-white transition">Contacto</a></li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a href="#" className="hover:text-white transition">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="hover:text-white transition">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
        © {new Date().getFullYear()} MiTienda. Todos los derechos reservados.
      </div>
    </footer>
  );
}
