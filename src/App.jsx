import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import FormNuevopr from './pages/FormNuevopr';
import UserInfo from "./pages/UsuInfo";
import Tienda from "./pages/Tienda";
import ProductIndi from "./pages/ProductIndi";
import FormNueVendedor from "./pages/FormNueVendedor";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Perfil from "./pages/dashboard/Perfil";
function App() {
  return (
    <AuthProvider>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registro/>}/>
        <Route path='/FormNuevopr' element={<FormNuevopr/>}/>
        <Route path="/Tienda" element={<Tienda/>}/>
        <Route path="/Product/:id" element={<ProductIndi />} />
        <Route path="/FormNvend" element={<FormNueVendedor/>}/>

        {/* Ruta padre para el dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Aquí van las rutas hijas del dashboard */}
          <Route index element={<DashboardHome />} />  {/* /dashboard */}
            {/* Agrega más rutas de panel aquí */}
          <Route path="Perfil" element={<Perfil/>}/>
          <></>
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;