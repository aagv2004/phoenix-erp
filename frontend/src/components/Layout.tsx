import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  Store,
  LayoutDashboard,
  LogOut,
  Package2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, setLogout, fetchCurrentUser } = useAuthStore();
  const [profileRequested, setProfileRequested] = useState(false);

  // Si hay token pero aún no hemos cargado el perfil completo, lo pedimos una sola vez
  useEffect(() => {
    if (!token) return;
    if (!user) return;
    if (user.company || user.branch) return;
    if (!fetchCurrentUser) return;
    if (profileRequested) return;

    void fetchCurrentUser().finally(() => {
      setProfileRequested(true);
    });
  }, [token, user, fetchCurrentUser, profileRequested]);

  const handleLogout = () => {
    setLogout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["SUPERADMIN", "DIRECTOR", "GERENTE", "EMPLEADO"],
    },
    {
      path: "/inventory",
      label: "Inventario",
      icon: <Package2 size={20} />,
      roles: ["SUPERADMIN", "DIRECTOR", "GERENTE", "EMPLEADO"],
    },
    {
      path: "/companies",
      label: "Empresas",
      icon: <Building2 size={20} />,
      roles: ["SUPERADMIN", "DIRECTOR"],
    },
    {
      path: "/branches",
      label: "Sucursales",
      icon: <Store size={20} />,
      roles: ["SUPERADMIN", "DIRECTOR", "GERENTE", "EMPLEADO"],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 bg-[radial-gradient(#e5e7b_1px, transparent_1px)] [background-size:16px_16px]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white/95 backdrop-blur-sm shadow-xl flex flex-col border-r border-orange-100 z-10">
        <div className="p-6 border-b border-orange-100">
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            Phoenix ERP
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const role = user?.role?.toUpperCase();
            if (role && !item.roles.includes(role)) {
              return null;
            }
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold shadow-sm border-l-4 border-orange-500"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
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

        <div className="px-4 py-4 border-t border-orange-100 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-gray-800 truncate">
                {user?.full_name || "Usuario"}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                {user?.role || "SIN ROL"}
              </span>

              {user?.company && (
                <span className="text-[11px] text-gray-500 truncate">
                  Empresa:{" "}
                  <span className="font-medium text-orange-700">
                    {user.company.name}
                  </span>
                </span>
              )}

              {user?.branch && (
                <span className="text-[11px] text-gray-500 truncate">
                  Sucursal:{" "}
                  <span className="font-medium text-gray-700">
                    {user.branch.name}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>

        <div className="p-4 border-t border-orange-100 bg-orange-50/30 text-xs text-center text-orange-400/80 font-medium">
          v0.1.0 Alpha
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-auto p-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
