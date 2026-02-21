export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await client.get("/products");
    setProducts(res.data);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          📦 Gestión de Inventario
        </h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          + Nuevo Producto
        </button>
      </header>

      {/* Aquí iría tu componente de formulario (similar al de Empresas) */}

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Precio
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-orange-50/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-sm text-orange-600">
                  {p.sku}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${Number(p.price).toLocaleString("es-CL")}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
