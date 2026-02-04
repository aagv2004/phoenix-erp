import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CompaniesPage from "./pages/CompaniesPage";
import BranchesPage from "./pages/BranchesPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta padre renderiza el Layout (Menú) */}
        <Route path="/" element={<Layout />}>
          {/* Rutas hijas (se muestran donde pusimos <Outlet />) */}
          <Route index element={<Dashboard />} />

          <Route path="companies" element={<CompaniesPage />} />
          <Route path="branches" element={<BranchesPage />} />

          {/* Si escriben cualquier otra cosa, mandar al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
