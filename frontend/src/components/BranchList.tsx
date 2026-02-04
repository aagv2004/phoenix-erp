import type { Branch } from "../types/branch";

interface Props {
  branches: Branch[];
  onEdit: (branch: Branch) => void; // <--- NUEVO
  onDelete: (id: string) => void; // <--- NUEVO
}

export default function BranchList({ branches, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sucursal
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empresa Dueña
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {branches.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No hay sucursales registradas.
              </td>
            </tr>
          ) : (
            branches.map((branch) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {branch.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {branch.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-semibold">
                  {branch.company?.name || "Sin Asignar"}
                </td>

                {/* BOTONES DE ACCIÓN PHOENIX 🔥 */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(branch)}
                    className="text-orange-600 hover:text-orange-900 font-medium mr-4 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(branch.id)}
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
