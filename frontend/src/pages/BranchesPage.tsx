import { useState, useEffect } from "react";
import client from "../api/client";
import CreateBranchForm from "../components/CreateBranchForm";
import BranchList from "../components/BranchList";
import { useCompanies } from "../hooks/useCompanies";
import type { Branch } from "../types/branch";
import { getErrorMessage } from "../utils/errorHandling";
import {
  showConfirmDialog,
  showErrorToast,
  showSuccessToast,
} from "../utils/toast";
import { useAuthStore } from "../store/authStore";

export default function BranchesPage() {
  const { companies } = useCompanies();
  const [branches, setBranches] = useState<Branch[]>([]);
  const user = useAuthStore((state) => state.user);
  const canManageBranches =
    user?.role === "SUPERADMIN" || user?.role === "DIRECTOR";

  // Estado para saber a quién estamos editando
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);

  const fetchBranches = async () => {
    try {
      const response = await client.get("/branches");
      let data = response.data;

      const role = user?.role?.toUpperCase();
      if (
        role &&
        role !== "SUPERADMIN" &&
        role !== "DIRECTOR" &&
        user?.company_id
      ) {
        data = data.filter(
          (branch: { company: { id: string | undefined } }) =>
            branch.company?.id === user.company_id,
        );
      }

      setBranches(data);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error fetching branches:", error);
      showErrorToast(message);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchBranches();
    }, 0);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función Borrar
  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      "¿Eliminar sucursal?",
      "Esta acción no se puede deshacer",
      "Sí, eliminar",
    );
    if (!confirmed) return;
    try {
      await client.delete(`/branches/${id}`);
      fetchBranches(); // Recargar tabla
      showSuccessToast("Sucursal eliminada correctamente");
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error al eliminar sucursal:", error);
      showErrorToast(message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Gestión de Sucursales
      </h1>

      {/* Pasamos los estados nuevos al Formulario */}
      {canManageBranches && (
        <CreateBranchForm
          onSuccess={() => {
            fetchBranches();
            setBranchToEdit(null); // Salir del modo edición al guardar
          }}
          companies={companies}
          branchToEdit={branchToEdit}
          onCancel={() => setBranchToEdit(null)}
        />
      )}

      {/* Pasamos las funciones a la Tabla */}
      <BranchList
        branches={branches}
        onEdit={canManageBranches ? setBranchToEdit : undefined}
        onDelete={canManageBranches ? handleDelete : undefined}
      />
    </div>
  );
}
