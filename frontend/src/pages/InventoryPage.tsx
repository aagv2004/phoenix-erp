import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import type { Product } from "../types/product";
import { Search, AlertTriangle, Plus, Package, X } from "lucide-react";
import ProductForm from "../components/ProductForm";
import { getErrorMessage } from "../utils/errorHandling";
import { showErrorToast } from "../utils/toast";
import { useAuthStore } from "../store/authStore";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((state) => state.user);
  const canCreateProduct =
    user?.role === "SUPERADMIN" ||
    user?.role === "DIRECTOR" ||
    user?.role === "GERENTE";

  const loadData = async () => {
    try {
      const { data } = await getProducts();

      const role = user?.role?.toUpperCase();
      let filtered = data;

      if (
        role &&
        role !== "SUPERADMIN" &&
        role !== "DIRECTOR" &&
        user?.company_id
      ) {
        filtered = data.filter(
          (product) => product.company_id === user.company_id,
        );
      }

      setProducts(filtered);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Error loading products:", error);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSuccess = () => {
    setShowForm(false);
    loadData();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <Package className="text-orange-500" /> Gestión de Inventario
          </h1>
          <p className="text-gray-500 text-sm">
            Administra el catálogo global de productos de tu empresa.
          </p>
        </div>
        {canCreateProduct && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
          >
            {showForm ? (
              <>
                <X size={20} /> Cerrar Formulario
              </>
            ) : (
              <>
                <Plus size={20} /> Nuevo Producto
              </>
            )}
          </button>
        )}
      </div>

      {/* FORMULARIO */}
      {canCreateProduct && showForm && (
        <ProductForm
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* BUSCADOR */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Stock Mín.
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Cargando catálogo...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-800">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">
                        {product.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-700">
                        ${Number(product.price).toLocaleString("es-CL")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {product.min_stock}
                        {product.min_stock > 0 && (
                          <AlertTriangle size={14} className="text-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-orange-600 transition-colors font-medium text-sm">
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
