import { useState } from "react";
import { createProduct } from "../api/products";
import { Save, X } from "lucide-react";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ onSuccess, onCancel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      sku: formData.get("sku") as string,
      price: Number(formData.get("price")),
      min_stock: Number(formData.get("min_stock")),
    };

    try {
      await createProduct(payload);
      alert("Producto creado con éxito");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Error creando el producto. Revisa la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all px-4 py-2.5 border";
  return (
    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 mb-8 animate-slideDown">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-orange-800 flex items-center gap-2">
          📦 Registrar Nuevo Producto
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Nombre del Producto*
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Ej: Coca Cola 350ml"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            SKU / Código*
          </label>
          <input
            name="sku"
            type="text"
            required
            placeholder="Ej: BEB-001"
            className={inputClasses}
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Descripción
          </label>
          <input
            name="description"
            type="text"
            placeholder="Breve detalle del producto..."
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Precio de Venta ($)*
          </label>
          <input
            name="price"
            type="number"
            required
            min="0"
            placeholder="0"
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Stock Mínimo (Alerta)
          </label>
          <input
            name="min_stock"
            type="number"
            min="0"
            placeholder="5"
            className={inputClasses}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
}
