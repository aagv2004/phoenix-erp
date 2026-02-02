import { useState, useEffect } from "react";
import client from "../api/client.ts";
import type { Company } from "../types/company.ts";

interface Props {
  onEdit: (company: Company) => void;
  refreshTrigger: number;
}

export default function CompanyList({ onEdit, refreshTrigger }: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/companies")
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("No se pudieron cargar las empresas.");
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro que deseas eliminar esta empresa? Esta acción no se puede deshacer.",
      )
    )
      return;

    try {
      await client.delete(`/companies/${id}`);

      setCompanies((prev) => prev.filter((company) => company.id !== id));
      alert("Empresa eliminada con éxito.");
    } catch (err) {
      console.error(err);
      alert(
        "Error eliminando la empresa. Revisa la consola para más detalles.",
      );
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Cargando datos...</div>
    );
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
      {companies.length === 0 ? (
        <div className="text-center py-12 px-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay empresas
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una en el formulario de arriba.
          </p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                RUT / ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {company.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {company.tax_id || (
                      <span className="italic text-gray-300">N/A</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {company.description || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(company)}
                    className="text-amber-600 hover:text-amber-900 mr-4 transition focus:outline-none"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-900 transition focus:outline-none"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
