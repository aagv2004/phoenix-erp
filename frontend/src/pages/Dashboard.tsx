import { useEffect, useState } from "react";
import { Building2, Store, Activity, WifiOff, Loader2 } from "lucide-react"; // Nuevos iconos
import client from "../api/client";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    companiesCount: 0,
    branchesCount: 0,
  });

  // Estados de carga y error separados
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setIsError(false);

      try {
        // Intentamos cargar todo junto
        const [companiesRes, branchesRes] = await Promise.all([
          client.get("/companies"),
          client.get("/branches"),
        ]);

        setStats({
          companiesCount: companiesRes.data.length,
          branchesCount: branchesRes.data.length,
        });
      } catch (err) {
        console.error("Error conectando con el backend:", err);
        // Si falla, activamos el modo "Sin Conexión"
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Lógica para decidir qué mostrar en la tarjeta de Estado
  const getSystemStatusCard = () => {
    if (loading) {
      return {
        title: "Estado del Sistema",
        value: "Verificando...",
        icon: <Loader2 size={24} className="animate-spin" />, // Icono girando
        color: "bg-blue-500",
      };
    }

    if (isError) {
      return {
        title: "Estado del Sistema",
        value: "Sin Conexión 🔴",
        icon: <WifiOff size={24} />,
        color: "bg-red-600", // Rojo de alerta
      };
    }

    return {
      title: "Estado del Sistema",
      value: "Operativo 🟢",
      icon: <Activity size={24} />,
      color: "bg-emerald-600", // Verde de éxito
    };
  };

  const statusCard = getSystemStatusCard();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <p className="mt-2 text-gray-600">
          Resumen de operaciones en tiempo real.
        </p>
      </div>

      {/* GRILLA DE TARJETAS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Empresas Registradas"
          // Si hay error, mostramos "-", si carga "...", si no el numero
          value={isError ? "-" : loading ? "..." : stats.companiesCount}
          icon={<Building2 size={24} />}
          colorClass="bg-orange-500"
        />

        <StatCard
          title="Sucursales Activas"
          value={isError ? "-" : loading ? "..." : stats.branchesCount}
          icon={<Store size={24} />}
          colorClass="bg-orange-600" // Un tono más oscuro para variar
        />

        {/* TARJETA DINÁMICA DE ESTADO */}
        <StatCard
          title={statusCard.title}
          value={statusCard.value}
          icon={statusCard.icon}
          colorClass={statusCard.color}
        />
      </div>

      {/* BANNER: Cambia si hay error */}
      {isError ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
          <h3 className="text-lg font-bold text-red-800">
            ⚠️ Error de Conexión
          </h3>
          <p className="mt-2 text-red-700">
            No pudimos conectar con el servidor (Base de datos). Puedes revisar
            tu conexión a internet, o consultar a un técnico.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm">
          <h3 className="text-lg font-bold text-orange-800">
            ¡Bienvenido a Phoenix ERP! 🦅
          </h3>
          <p className="mt-2 text-orange-700">
            Utiliza el menú lateral para gestionar tus Empresas y Sucursales.
          </p>
        </div>
      )}
    </div>
  );
}
