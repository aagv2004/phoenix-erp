import { useState, useEffect } from "react";
import client from "../api/client";
import type { Company } from "../types/company";

interface Props {
  onSuccess: () => void;
  companies: Company[];
}

export default function CreateBranchForm({ onSuccess, companies }: Props) {
  // Estados del formulario
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [companyId, setCompanyId] = useState(""); // El ID de la empresa seleccionada

  // Estados para llenar el Select

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Cargar empresas al iniciar el componente 🔄
  useEffect(() => {
    if (companies.length > 0 && !companyId) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviamos el companyId para relacionar las tablas
      await client.post("/branches", {
        name,
        address,
        companyId,
      });

      // Limpiamos solo los textos
      setName("");
      setAddress("");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error al crear sucursal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border";

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        📍 Nueva Sucursal
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Bodega Norte"
            className={inputClasses}
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Panamericana 500"
            className={inputClasses}
          />
        </div>

        {/* SELECTOR DE EMPRESAS (La magia) 🪄 */}
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
            {companies.length === 0 && (
              <option value="">Sin empresas...</option>
            )}

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting || companies.length === 0}
          className={`h-10 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSubmitting || companies.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
          }`}
        >
          {isSubmitting ? "Guardando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}
