import { Link, Outlet, useLocation } from "react-router-dom";
import { Building2, Store, LayoutDashboard } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/companies", label: "Empresas", icon: <Building2 size={20} /> },
    { path: "/branches", label: "Sucursales", icon: <Store size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-xl flex flex-col border-r border-orange-100">
        <div className="p-6 border-b border-orange-100">
          {/* LOGO CON DEGRADADO PHOENIX 🔥 */}
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Phoenix ERP
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold shadow-sm border-l-4 border-orange-500" // ACTIVO
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600" // HOVER
                }`}
              >
                {/* El icono cambia de color un poco más sutilmente */}
                <span
                  className={
                    isActive
                      ? "text-orange-600"
                      : "text-gray-400 group-hover:text-orange-500"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-orange-100 bg-orange-50/30 text-xs text-center text-orange-400/80 font-medium">
          v0.1.0 Alpha
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
