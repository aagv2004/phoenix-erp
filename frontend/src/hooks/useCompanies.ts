import { useState, useEffect, useCallback } from "react";
import client from "../api/client";
import type { Company } from "../types/company";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Usamos useCallback para memorizar la función y poder usarla en dependencias
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get("/companies");
      setCompanies(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error cargando empresas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar empresas al montar el hook
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const deleteCompany = async (id: string) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta empresa?"))
      return;

    try {
      await client.delete(`/companies/${id}`);
      // Recargamos la lista después de borrar
      await fetchCompanies();
      alert("Empresa eliminada correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la empresa.");
    }
  };

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    deleteCompany,
  };
}
