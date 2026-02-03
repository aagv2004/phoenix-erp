import { useState, useEffect } from "react";
import client from "./api/client"; // Necesario para branches
import { useCompanies } from "./hooks/useCompanies"; // Importamos el hook nuevo

// Componentes
import CompanyList from "./components/CompanyList";
import CreateCompanyForm from "./components/CreateCompanyForm";
import CreateBranchForm from "./components/CreateBranchForm";
import BranchList from "./components/BranchList";

// Tipos
import type { Company } from "./types/company";
import type { Branch } from "./types/branch";

function App() {
  // 1. LÓGICA DE EMPRESAS (Usando el Hook que acabamos de crear)
  const { companies, fetchCompanies, deleteCompany } = useCompanies();
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  // 2. LÓGICA DE SUCURSALES (La dejamos aquí para no complicarte con más archivos hoy)
  const [branches, setBranches] = useState<Branch[]>([]);

  const fetchBranches = () => {
    client
      .get("/branches")
      .then((response) => setBranches(response.data))
      .catch((error) => console.error("Error fetching branches:", error));
  };

  // Cargar sucursales al inicio
  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* --- SECCIÓN EMPRESAS --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          </div>

          <CreateCompanyForm
            onSuccess={fetchCompanies}
            companyToEdit={companyToEdit}
            onCancel={() => setCompanyToEdit(null)}
          />

          <div className="mt-8">
            <CompanyList
              companies={companies}
              onDelete={deleteCompany}
              onEdit={setCompanyToEdit}
            />
          </div>
        </section>

        <hr className="border-t-2 border-gray-200" />

        {/* --- SECCIÓN SUCURSALES --- */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Gestión de Sucursales
          </h2>

          {/* El formulario recibe las empresas del hook y refresca la lista de branches al guardar */}
          <CreateBranchForm onSuccess={fetchBranches} companies={companies} />

          <div className="mt-8">
            <BranchList branches={branches} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
