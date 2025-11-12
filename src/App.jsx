import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import FormNueVendedor from "./pages/FormNueVendedor";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Perfil from "./pages/dashboard/Perfil";
import Tickets from "./pages/dashboard/Tickets";
function App() {
  return (
    <AuthProvider>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registro/>}/>
        <Route path="/FormNvend" element={<FormNueVendedor/>}/>

        {/* Ruta padre para el dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Aquí van las rutas hijas del dashboard */}
          <Route index element={<DashboardHome />} />  {/* /dashboard */}
            {/* ruta perfil */}
          <Route path="Perfil" element={<Perfil/>}/>
            {/* ruta tikets */}
          <Route path="Tickets" element={<Tickets/>}/>
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;