import { useState } from "react";
import CompanyList from "./components/CompanyList.tsx";
import CreateCompanyForm from "./components/CreateCompanyForm.tsx";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Phoenix ERP</h1>
      <hr />
      <CreateCompanyForm onCompanyCreated={handleRefresh} />
      <br />
      <CompanyList key={refreshKey} />
    </div>
  );
}

export default App;
