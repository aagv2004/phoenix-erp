import { useEffect, useState } from "react";
import { Building2, Store, Activity, WifiOff, Loader2 } from "lucide-react"; // Nuevos iconos
import client from "../api/client";
import StatCard from "../components/StatCard";
import { useAuthStore } from "../store/authStore";
import { getErrorMessage } from "../utils/errorHandling";
import { showErrorToast } from "../utils/toast";
import type { Branch } from "../types/branch";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    companiesCount: 0,
    branchesCount: 0,
  });

  // Estados de carga y error separados
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const user = useAuthStore((state) => state.user);
  const [isHydrated, setIsHydrated] = useState(false);

  const normalizedRole = user?.role?.toUpperCase();
  const isGlobalRole =
    normalizedRole === "SUPERADMIN" || normalizedRole === "DIRECTOR";

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setIsError(false);

      try {
        const role = user?.role?.toUpperCase();
        const canSeeCompanies = role === "SUPERADMIN" || role === "DIRECTOR";

        const companiesPromise = canSeeCompanies
          ? client.get("/companies")
          : Promise.resolve({ data: [] as unknown[] });

        const [companiesRes, branchesRes] = await Promise.all([
          companiesPromise,
          client.get("/branches"),
        ]);

        let branchesData: Branch[] = branchesRes.data;

        if (
          role &&
          role !== "SUPERADMIN" &&
          role !== "DIRECTOR" &&
          user?.company_id
        ) {
          branchesData = branchesData.filter(
            (branch) => branch.company?.id === user.company_id,
          );
        }

        setStats({
          companiesCount: companiesRes.data.length,
          branchesCount: branchesData.length,
        });
      } catch (err) {
        const message = getErrorMessage(err);
        console.error("Error conectando con el backend:", err);
        showErrorToast(message);
        // Si falla, activamos el modo "Sin Conexión"
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.role, user?.company_id]);

  // Lógica para decidir qué mostrar en la tarjeta de Estado
  const getSystemStatusCard = () => {
    if (loading) {
      return {
        title: "Estado del Sistema",
        value: "Verificando...",
        icon: <Loader2 size={24} className="animate-spin" />,
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
  const displayName = isHydrated ? user?.full_name || "Usuario" : "Cargando...";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <p className="mt-2 text-gray-600">
          Resumen de operaciones en tiempo real.
        </p>
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
            ¡Bienvenido, {displayName}{" "}
            <span className="text-orange-500">a Phoenix ERP! 🦅</span>
          </h3>
          <p className="mt-2 text-gray-600">
            Rol:{" "}
            <span className="uppercase font-mono text-orange-800">
              {user?.role}
            </span>
            {user?.company && (
              <>
                <br />
                Usted pertenece a la empresa:{" "}
                <span className="font-mono text-orange-500">
                  {user.company.name}
                </span>
              </>
            )}{" "}
            <br />
            Resumen de operaciones en tiempo real.
          </p>
        </div>
      )}

      {/* GRILLA DE TARJETAS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={isGlobalRole ? "Empresas Registradas" : "Tu empresa"}
          value={
            isGlobalRole
              ? isError
                ? "-"
                : loading
                  ? "..."
                  : stats.companiesCount
              : (user?.company?.name ?? "Sin empresa")
          }
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
    </div>
  );
}
