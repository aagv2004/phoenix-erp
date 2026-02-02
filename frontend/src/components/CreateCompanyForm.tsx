import { useState } from "react";
import client from "../api/client.ts";

export default function CreateCompanyForm({
  onCompanyCreated,
}: {
  onCompanyCreated: () => void;
}) {
  // Estados inputs
  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await client.post("/companies", {
        name: name,
        tax_id: taxId,
        description: description,
      });

      setName("");
      setTaxId("");
      setDescription("");

      alert("Empresa creada con éxito.");
      onCompanyCreated();
    } catch (error) {
      console.error(error);
      alert("Error creando la empresa. Revisa la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <h3>Nueva Empresa</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}
      >
        <div>
          <label style={{ display: "block", fontSize: "12px" }}>Nombre*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Mi Pyme SpA"
            style={{ padding: "5px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px" }}>RUT / ID</label>
          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            placeholder="Ej: 76.123.456-K"
            style={{ padding: "5px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px" }}>
            Descripción
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Rubro..."
            style={{ padding: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          {isSubmitting ? "Guardando..." : "Crear"}
        </button>
      </form>
    </div>
  );
}
