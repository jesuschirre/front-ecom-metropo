import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import FormNueVendedor from "./pages/FormNueVendedor";

import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Perfil from "./pages/dashboard/Perfil";
import Tickets from "./pages/dashboard/Tickets";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route
          path="/FormNvend"
          element={
            <ProtectedRoute>
              <FormNueVendedor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="Perfil" element={<Perfil />} />
          <Route path="Tickets" element={<Tickets />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;