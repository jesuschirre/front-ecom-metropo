export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-10 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Radio Metropoli</h3>
            <p className="text-gray-300">
              La voz de tu comunidad. Anuncia con nosotros y llega a miles.
            </p>
          </div>
       <div>
          <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2">
            <li>
              <a href="#contacto" className="text-gray-300 hover:text-white">
                Contacto
              </a>
            </li>
            <li>
              <a
                onClick={() => window.open("https://www.metropoliradio.com/", "_blank")}
                className="text-gray-300 hover:text-white cursor-pointer"
              >
                Escuchar En Vivo
              </a>
            </li>
          </ul>
        </div>
          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
        <p>&copy; 2025 Radio Metropoli. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}