import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import FormNuevopr from './pages/FormNuevopr';
import UserInfo from "./pages/UsuInfo";
import Tienda from "./pages/tienda";
import ProductIndi from "./pages/ProductIndi";
import FormNueVendedor from "./pages/FormNueVendedor";
function App() {
  return (
    <AuthProvider>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registro' element={<Registro/>}/>
        <Route path='/FormNuevopr' element={<FormNuevopr/>}/>
        <Route path="/Userinfo" element={<UserInfo/>}/>
        <Route path="/Tienda" element={<Tienda/>}/>
        <Route path="/Product" element={<ProductIndi/>}/>
        <Route path="/FormNvend" element={<FormNueVendedor/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;