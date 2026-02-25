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
    return (
      <div className="bg-white shadow rounded-lg border border-gray-200 px-6 py-4 text-sm text-gray-500">
        Cargando empresas...
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Empresas registradas
        </h2>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {companies.length} registro{companies.length === 1 ? "" : "s"}
        </span>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RUT / ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No hay empresas registradas.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                    {company.tax_id || "Sin RUT"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                  {company.description || "Sin descripción"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(company)}
                    className="text-orange-600 hover:text-orange-900 font-medium mr-4 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
