import { useState, useEffect } from "react";
import client from "../api/client";
import CreateBranchForm from "../components/CreateBranchForm";
import BranchList from "../components/BranchList";
import { useCompanies } from "../hooks/useCompanies";
import type { Branch } from "../types/branch";

export default function BranchesPage() {
  const { companies } = useCompanies();
  const [branches, setBranches] = useState<Branch[]>([]);

  // Estado para saber a quién estamos editando
  const [branchToEdit, setBranchToEdit] = useState<Branch | null>(null);

  const fetchBranches = () => {
    client
      .get("/branches")
      .then((response) => setBranches(response.data))
      .catch((error) => console.error("Error fetching branches:", error));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Función Borrar
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta sucursal?"))
      return;
    try {
      await client.delete(`/branches/${id}`);
      fetchBranches(); // Recargar tabla
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Gestión de Sucursales
      </h1>

      {/* Pasamos los estados nuevos al Formulario */}
      <CreateBranchForm
        onSuccess={() => {
          fetchBranches();
          setBranchToEdit(null); // Salir del modo edición al guardar
        }}
        companies={companies}
        branchToEdit={branchToEdit}
        onCancel={() => setBranchToEdit(null)}
      />

      {/* Pasamos las funciones a la Tabla */}
      <BranchList
        branches={branches}
        onEdit={setBranchToEdit} // Al click en editar, subimos el dato al estado
        onDelete={handleDelete}
      />
    </div>
  );
}
