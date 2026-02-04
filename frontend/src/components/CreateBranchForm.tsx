import { useState, useEffect } from "react";
import client from "../api/client";
import type { Company } from "../types/company";
import type { Branch } from "../types/branch"; // Importamos el tipo Branch

interface Props {
  onSuccess: () => void;
  companies: Company[];
  branchToEdit?: Branch | null; // <--- NUEVO
  onCancel: () => void; // <--- NUEVO
}

export default function CreateBranchForm({
  onSuccess,
  companies,
  branchToEdit,
  onCancel,
}: Props) {
  // Estados
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // EFECTO: Detectar si estamos editando o creando
  useEffect(() => {
    if (branchToEdit) {
      // MODO EDICIÓN: Rellenamos los campos
      setName(branchToEdit.name);
      setAddress(branchToEdit.address);
      // Ojo: branchToEdit trae el objeto company entero, sacamos el ID
      setCompanyId(branchToEdit.company?.id || "");
    } else {
      // MODO CREACIÓN: Limpiamos (o seleccionamos la primera empresa por defecto)
      setName("");
      setAddress("");
      if (companies.length > 0) setCompanyId(companies[0].id);
    }
  }, [branchToEdit, companies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = { name, address, companyId };

    try {
      if (branchToEdit) {
        // ACTUALIZAR (PATCH)
        await client.patch(`/branches/${branchToEdit.id}`, data);
        // alert("Sucursal actualizada");
      } else {
        // CREAR (POST)
        await client.post("/branches", data);
        // alert("Sucursal creada");
      }

      // Limpiar y avisar al padre
      if (!branchToEdit) {
        setName("");
        setAddress("");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la sucursal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!branchToEdit;

  // Tus clases de input arregladas (Phoenix Style) 🔥
  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-sm px-3 py-2 border transition-all bg-white";

  return (
    <div
      className={`shadow-md rounded-lg p-6 mb-8 border transition-colors duration-300 ${isEditing ? "bg-orange-50 border-orange-200" : "bg-white border-gray-200"}`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${isEditing ? "text-orange-800" : "text-gray-900"}`}
      >
        {isEditing ? "✏️ Editar Sucursal" : "📍 Nueva Sucursal"}
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            required
            value={name}
            placeholder="Sucursal Norte"
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* DIRECCIÓN */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            required
            value={address}
            placeholder="Panamericana Norte KM 882"
            onChange={(e) => setAddress(e.target.value)}
            className={inputClasses}
          />
        </div>

        {/* EMPRESA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className={inputClasses}
            required
          >
            {companies.length === 0 && <option value="">Cargando...</option>}
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* BOTONES */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting || companies.length === 0}
            className={`h-10 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors w-full md:w-auto ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
            }`}
          >
            {isSubmitting ? "..." : isEditing ? "Actualizar" : "Crear Sucursal"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
