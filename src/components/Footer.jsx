import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    let playerLoaded = false;

    function loadRadioPlayer() {
      if (playerLoaded) return;
      playerLoaded = true;

      // Cargar jQuery
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.2.1.min.js";
      document.body.appendChild(jqueryScript);

      jqueryScript.onload = () => {
        // Cargar script de LunaRadio
        const lunaradioScript = document.createElement("script");
        lunaradioScript.src = "https://extassisnetwork.com/player/Luna/largo.js";
        document.body.appendChild(lunaradioScript);

        lunaradioScript.onload = () => {
          window.$(document).ready(function () {
            // Inicializar LunaRadio
            window.$("#extassisnetwork").lunaradio({
              userinterface: "small",
              backgroundcolor: "#121212",
              fontcolor: "#FFFFFF",
              hightlightcolor: "#607876",
              streamurl: "https://cast2.my-control-panel.com/proxy/radiote2/stream",
              streamtype: "shoutcast2",
              radioname: "METROPOLI RADIO 92.7 FM - JAUJA",
              coverimage: "https://www.metropoliradio.com/img/metro.png",
              onlycoverimage: false,
              autoplay: true,
              coverstyle: "animated",
              usevisualizer: "real",
              visualizertype: "2",
              metadatainterval: "20000",
              volume: "100",
              usestreamcorsproxy: "true",
            });

            // --- Lógica de ocultar/mostrar ---
            const radioContainer = window.$("#radioPlayerContainer");
            const toggleBtn = window.$("#togglePlayerBtn");
            const toggleIcon = window.$("#toggleIcon");
            const toggleText = toggleBtn.find("span");

            toggleBtn.addClass("visible opacity-100 pointer-events-auto");

            toggleBtn.on("click", function () {
              window.$("body").toggleClass("player-hidden");
              if (window.$("body").hasClass("player-hidden")) {
                radioContainer.addClass("hidden-player");
                toggleIcon
                  .removeClass("fa-chevron-down")
                  .addClass("fa-chevron-up");
                toggleText.text("Mostrar");
              } else {
                radioContainer.removeClass("hidden-player");
                toggleIcon
                  .removeClass("fa-chevron-up")
                  .addClass("fa-chevron-down");
                toggleText.text("Ocultar");
              }
            });
          });
        };
      };
    }

    window.addEventListener("load", loadRadioPlayer);
    return () => window.removeEventListener("load", loadRadioPlayer);
  }, []);

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
                  href="https://www.metropoliradio.com/"
                  className="text-gray-300 hover:text-white"
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

      {/* --- REPRODUCTOR DE RADIO --- */}
      <div id="radioPlayerContainer">
        <div id="extassisnetwork" style={{ width: "100%", height: "60px" }}></div>
      </div>

      {/* --- BOTÓN OCULTAR/MOSTRAR --- */}
      <button
        id="togglePlayerBtn"
        className="fixed bottom-[60px] left-1/2 -translate-x-1/2 bg-gray-800 text-white w-[120px] h-[30px] rounded-t-xl flex items-center justify-center cursor-pointer border-t border-gray-700 opacity-0 pointer-events-none transition-all duration-500 z-[1001]"
      >
        <i id="toggleIcon" className="fas fa-chevron-down mr-2"></i>
        <span>Ocultar</span>
      </button>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
        <p>&copy; 2025 Radio Metropoli. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}