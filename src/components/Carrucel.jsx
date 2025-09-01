import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Carrucel() {
   const [banners, setBanners] = useState([]);
  
  // traemos 3 banners aleatorios
  useEffect(() => {
    fetch("http://localhost:3000/vendedores/banners")
      .then((res) => res.json())
      .then((data) => {
        setBanners(data); // Guardamos los 3 banners
      })
      .catch((error) => {
        console.error("Error al obtener banners:", error);
      });
  }, []);

  return (
    <>

     <div className="relative">
      {/* Botones personalizados */}
      <button className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-white text-black p-4 rounded-full shadow-md hover:bg-neutral-200 z-10 transition cursor-pointer">
        <FaChevronLeft size={20} />
      </button>
      <button className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-white text-black p-4 rounded-full shadow-md hover:bg-neutral-200 z-10 transition cursor-pointer">
        <FaChevronRight size={20} />
      </button>

      {/* Carrusel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-[600px] rounded-lg overflow-hidden shadow-lg"
      >
        {banners.map((banners, index) => (
          <SwiperSlide key={index}>
            <img
              src={banners.banner} // 👈 aquí ponemos la url que viene de la BD
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  )
}