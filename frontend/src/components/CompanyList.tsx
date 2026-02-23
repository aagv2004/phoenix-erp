import { showConfirmDialog } from "../utils/toast";
import type { Company } from "../types/company";

type CompanyListProps = {
  companies: Company[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (company: Company) => void;
  isLoading?: boolean;
};

export function CompanyList({
  companies,
  onDelete,
  onEdit,
  isLoading = false,
}: CompanyListProps) {
  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmDialog(
      "¿Eliminar empresa?",
      "Esta acción no se puede deshacer",
      "Sí, eliminar",
    );

    if (!confirmed) return;

    try {
      await onDelete(id);
    } catch (error) {
      // El error ya se maneja en el interceptor
      console.error("Error al eliminar empresa:", error);
    }
  };

  if (isLoading) {
    return <div>Cargando empresas...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>
      <div className="grid gap-4">
        {companies.map((company) => (
          <div key={company.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{company.name}</h3>
            <p className="text-sm text-gray-600">{company.tax_id}</p>
            <div className="mt-2 flex gap-3">
              <button
                onClick={() => onEdit(company)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
