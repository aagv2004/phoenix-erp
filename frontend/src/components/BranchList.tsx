import type { Branch } from "../types/branch";

interface Props {
  branches: Branch[];
}

export default function BranchList({ branches }: Props) {
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
              Empresa Dueña 🏢
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {branches.length === 0 ? (
            <tr>
              <td
                colSpan={3}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold">
                  {/* Accedemos seguro por si company viene undefined */}
                  {branch.company?.name || "Sin Asignar"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
