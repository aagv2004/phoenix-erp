import { useState } from "react";
import { useCompanies } from "../hooks/useCompanies";
import CompanyList from "../components/CompanyList";
import CreateCompanyForm from "../components/CreateCompanyForm";
import type { Company } from "../types/company";

export default function CompaniesPage() {
  const { companies, fetchCompanies, deleteCompany } = useCompanies();
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
      </div>

      <CreateCompanyForm
        onSuccess={fetchCompanies}
        companyToEdit={companyToEdit}
        onCancel={() => setCompanyToEdit(null)}
      />

      <CompanyList
        companies={companies}
        onDelete={deleteCompany}
        onEdit={setCompanyToEdit}
      />
    </div>
  );
}
