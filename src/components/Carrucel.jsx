import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Carrucel() {
    const [productos2, setProductos2] = useState([
      { id: 1, nombre: "Anillo de Elfo", precio: 120.0, category: "Joyería", imagen: "https://cdn0.matrimonio.com.pe/vendor/2605/3_2/640/jpeg/whatsapp-image-2017-10-22-at-12-14-25-pm_11_112605.jpeg" },
      { id: 2, nombre: "Colgante Arwen", precio: 75.5, category: "Joyería", imagen: "https://persistent.imagedescriber.online/image-describer-examples/000.jpg" },
      { id: 3, nombre: "Espada de Gondor", precio: 250.0, category: "Armas", imagen: "https://cdn.agenciasinc.es/var/ezwebin_site/storage/images/_aliases/img_1col/noticias/las-mejores-imagenes-cientificas-de-2024-segun-nature/12207004-5-esl-MX/Las-mejores-imagenes-cientificas-de-2024-segun-Nature.png" },
      { id: 4, nombre: "Capa Elfica", precio: 150.0, category: "Ropa", imagen: "https://i.blogs.es/3f45c4/pcpotente-ap/1366_2000.jpeg" },
      { id: 5, nombre: "Arco de Legolas", precio: 180.0, category: "Armas", imagen: "https://img.freepik.com/fotos-premium/rifle-airsoft-juguete-militar-aislado_93675-78231.jpg" },
      { id: 6, nombre: "Libro de Elfos", precio: 45.0, category: "Libros", imagen: "https://dojiw2m9tvv09.cloudfront.net/48881/product/v-mouse-rgb-logitech-g203-lightsync-8000-dpi-d_nq_np_650959-mpe43162621953_082020-f0008.jpg" },
      { id: 7, nombre: "Botas de Hobbit", precio: 80.0, category: "Ropa", imagen: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/hobbit-boots-kristian-godvik.jpg" },
      { id: 8, nombre: "Cerveza Enana", precio: 10.0, category: "Bebidas", imagen: "https://i.etsystatic.com/20963524/r/il/4b3730/3666422293/il_570xN.3666422293_7biw.jpg" },
      { id: 9, nombre: "Anillo Único", precio: 300.0, category: "Joyería", imagen: "https://cdn.shopify.com/s/files/1/0272/9524/5524/products/OneRing.jpg" },
      { id: 10, nombre: "Espada de Faramir", precio: 220.0, category: "Armas", imagen: "https://cdn11.bigcommerce.com/s-9n22hf5a6/images/stencil/1280x1280/products/309/1521/Faramir-Sword__23325.1575565089.jpg?c=2" },
    ]);  
    
  return (
    <>

     <div className="relative">
        {/* Botones personalizados */}
        <button className="custom-prev absolute top-1/2 left-4 -translate-y-1/2 bg-white text-black p-4 rounded-full shadow-md hover:bg-neutral-200 z-10 transition">
          <FaChevronLeft size={20} />
        </button>
        <button className="custom-next absolute top-1/2 right-4 -translate-y-1/2 bg-white text-black p-4 rounded-full shadow-md hover:bg-neutral-200 z-10 transition">
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
          loop={true} // 👈 Esta línea hace el carrusel infinito
          className="h-[600px] rounded-lg overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <img
              src="https://cdn.conmebol.com/wp-content/uploads/2023/04/000_DV779097-1-scaled.jpg"
              alt="MSI"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://cdn.conmebol.com/wp-content/uploads/2023/04/000_DV779097-1-scaled.jpg"
              alt="RTX"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://cdn.conmebol.com/wp-content/uploads/2023/04/000_DV779097-1-scaled.jpg"
              alt="xd"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

        
    </>
  )
}