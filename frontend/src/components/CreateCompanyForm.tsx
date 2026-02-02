import { useState } from "react";
import client from "../api/client.ts";
import type { Company } from "../types/company.ts";

interface Props {
  onSuccess: () => void;
  companyToEdit?: Company | null;
  onCancel: () => void;
}

export default function CreateCompanyForm({
  onSuccess,
  companyToEdit,
  onCancel,
}: Props) {
  // Estados inputs
  const [name, setName] = useState(companyToEdit?.name || "");
  const [taxId, setTaxId] = useState(companyToEdit?.tax_id || "");
  const [description, setDescription] = useState(
    companyToEdit?.description || "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: name,
        tax_id: taxId,
        description: description,
      };

      if (companyToEdit) {
        await client.patch(`/companies/${companyToEdit.id}`, data);
        alert("Empresa actualizada con éxito.");
      } else {
        await client.post("/companies", data);
        alert("Empresa creada con éxito.");
      }

      setName("");
      setTaxId("");
      setDescription("");

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error creando la empresa. Revisa la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!companyToEdit;
  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border";

  return (
    <div
      className={`shadow-md rounded-lg p-6 transition-colors duration-300 ${isEditing ? "bg-amber-50 border border-amber-200" : "bg-white"}`}
    >
      <h3
        className={`text-lg font-medium mb-4 ${isEditing ? "text-amber-700" : "text-gray-900"}`}
      >
        {isEditing ? "Editar Empresa" : "Nueva empresa"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre*
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Mi Pyme SpA"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            RUT / ID
          </label>
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Ej: 76.123.456-K"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rubro..."
            className={inputClasses}
          />
        </div>

        {/* 4. BOTÓN CANCELAR: Solo aparece si estamos editando 👇 */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isEditing
                ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting
              ? "Guardando..."
              : isEditing
                ? "Actualizar empresa"
                : "Crear empresa"}
          </button>
          {companyToEdit && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                backgroundColor: "#ddd",
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
