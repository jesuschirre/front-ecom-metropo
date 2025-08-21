import { Outlet, NavLink } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-white">
        <aside className="w-64 bg-[#232323] shadow-lg p-6 flex flex-col fixed top-0 left-0 h-screen">
        <a href="/" className="flex items-center space-x-3 my-9">
              <img
                className="h-10 md:h-15 w-auto"
                src="/img/logo1.png"
                alt="Logo tienda"
              />
             
        </a>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold shadow"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Panel Principal
          </NavLink>
          <NavLink
            to="/dashboard/Perfil"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold shadow"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Perfil
          </NavLink>
          <NavLink
            to="/dashboard/Productos"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold shadow"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            Productos
          </NavLink>

        </nav>
      </aside>

      <main className="flex-1 p-8 bg-black ml-64">
        <header className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-semibol">Dashboard</h1>
        </header>
        <Outlet /> {/* Aquí renderizan las rutas hijas */}
      </main>
            
    </div>
  );
};

export default DashboardLayout;