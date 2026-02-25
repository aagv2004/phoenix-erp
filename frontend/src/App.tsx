import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CompaniesPage from "./pages/CompaniesPage";
import BranchesPage from "./pages/BranchesPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import InventoryPage from "./pages/InventoryPage";
import RegisterTestPage from "./pages/RegisterTestPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/RoleProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-test" element={<RegisterTestPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route
              element={
                <RoleProtectedRoute allowedRoles={["SUPERADMIN", "DIRECTOR"]} />
              }
            >
              <Route path="companies" element={<CompaniesPage />} />
            </Route>
            <Route path="branches" element={<BranchesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
