import { useState, useEffect } from "react";
import client from "../api/client.ts";
import type { Company } from "../types/company.ts";
import { formatRut, validateRut, cleanRut } from "../utils/rutUtils.ts";
import { getErrorMessage } from "../utils/errorHandling";
import { showErrorToast, showSuccessToast } from "../utils/toast";

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
  const [description, setDescription] = useState(
    companyToEdit?.description || "",
  );
  const [rut, setRut] = useState("");
  const [rutError, setRutError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (companyToEdit) {
      setRut(formatRut(companyToEdit.tax_id || ""));
      setDescription(companyToEdit.description || "");
      setRutError(false);
    } else {
      // Si cancelamos o es nuevo, limpiamos
      setRut("");
      setDescription("");
      setRutError(false);
    }
  }, [companyToEdit]);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Forzamos mayúscula desde la entrada

    if (cleanRut(value).length === 0) {
      setRut("");
      setRutError(false);
      return;
    }

    const formatted = formatRut(value);
    setRut(formatted);

    // Validamos con el valor limpio para evitar líos con puntos/guiones
    if (cleanRut(value).length > 7) {
      setRutError(!validateRut(value));
    } else {
      setRutError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const rutLimpio = cleanRut(rut);

    if (rutLimpio && !validateRut(rut)) {
      showErrorToast("El RUT ingresado no es válido.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      tax_id: rutLimpio,
      description: formData.get("description"),
    };

    try {
      if (companyToEdit) {
        await client.patch(`/companies/${companyToEdit.id}`, data);
        showSuccessToast("Empresa actualizada con éxito");
      } else {
        await client.post("/companies", data);
        showSuccessToast("Empresa creada con éxito");
      }

      setRut("");
      setDescription("");
      setRutError(false);

      form.reset();

      onSuccess();
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error creando la empresa:", error);
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!companyToEdit;
  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none sm:text-sm px-3 py-2 border transition-all";

  return (
    <div
      className={`shadow-md rounded-lg p-6 transition-colors duration-300 border ${isEditing ? "bg-orange-50 border border-orange-200" : "bg-white border-gray-200"}`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${isEditing ? "text-orange-800" : "text-gray-800"}`}
      >
        {isEditing ? "✏️ Editar Empresa" : "🏢 Nueva Empresa"}
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
            name="name"
            defaultValue={companyToEdit?.name}
            type="text"
            required
            placeholder="Ej: Mi Pyme SpA"
            className={`${inputClasses}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            RUT / ID
            {rutError && (
              <span className="text-red-500 text-xs ml-2">(Inválido)</span>
            )}
          </label>
          <input
            type="text"
            name="tax_id"
            value={rut}
            maxLength={12}
            onChange={handleRutChange}
            placeholder="Ej: 76.123.456-K"
            className={`${inputClasses} ${rutError ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50" : ""}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rubro..."
            className={`${inputClasses}`}
          />
        </div>

        {/* 4. BOTÓN CANCELAR: Solo aparece si estamos editando 👇 */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-10 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
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
