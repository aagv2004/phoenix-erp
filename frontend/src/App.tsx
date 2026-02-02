import { useState } from "react";
import CompanyList from "./components/CompanyList.tsx";
import CreateCompanyForm from "./components/CreateCompanyForm.tsx";
import type { Company } from "./types/company.ts";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingCompany(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Phoenix ERP</h1>
          <p className="text-gray-500 mt-2">
            Gestión centralizada de empresas.
          </p>
        </header>
      </div>

      <main className="space-y-8">
        <section>
          <CreateCompanyForm
            key={editingCompany?.id || "new"}
            companyToEdit={editingCompany}
            onSuccess={handleSuccess}
            onCancel={() => setEditingCompany(null)}
          />
        </section>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Listado de empresas
            </h2>
            <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
              En vivo
            </span>
          </div>
          <CompanyList
            refreshTrigger={refreshKey}
            onEdit={(company) => setEditingCompany(company)}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
