import { useState, useEffect, useCallback } from "react";
import client from "../api/client";
import type { Company } from "../types/company";
import { getErrorMessage, isForbiddenError } from "../utils/errorHandling";
import { showErrorToast } from "../utils/toast";
import { showSuccessToast } from "../utils/toast";

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
    } catch (error) {
      // Si es un 403, dejamos que el interceptor muestre el toast de permisos
      if (isForbiddenError(error)) {
        return;
      }
      const message = getErrorMessage(error);
      console.error("Error cargando empresas:", error);
      setError(message);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar empresas al montar el hook
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const deleteCompany = async (id: string) => {
    try {
      await client.delete(`/companies/${id}`);
      // Recargamos la lista después de borrar
      await fetchCompanies();
      showSuccessToast("Empresa eliminada correctamente");
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Error al eliminar la empresa:", err);
      showErrorToast(message);
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
