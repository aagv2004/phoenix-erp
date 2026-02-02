import { useState, useEffect } from "react";
import client from "../api/client.ts";
import type { Company } from "../types/company.ts";

export default function CompanyList() {
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
  }, []);

  if (loading) return <p>Cargando empresas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de empresas</h2>
      <table
        border={1}
        cellPadding={10}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Descripción</th>
            <th>Fecha de creación</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.tax_id || "-"}</td>
              <td>{company.description || "-"}</td>
              <td>{new Date(company.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {companies.length === 0 && <p>No hay empresas registradas.</p>}
    </div>
  );
}
