import { useEffect, useState } from "react";
import client from "./api/client.ts";

function App() {
  const [mensaje, setMensaje] = useState("Probando conexión...");

  useEffect(() => {
    client
      .get("/companies")
      .then((response) => {
        console.log("Datos recibidos:", response.data);
        setMensaje("Conexión exitosa con el backend!");
      })
      .catch((error) => {
        console.error("Error conectando al backend:", error);
        setMensaje("✖️ Error de conexión. Revisa si el backend está prendido.");
      });
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Phoenix ERP</h1>
      <hr />
      <h3>Estado: {mensaje}</h3>
      <p>Bienvenido al Frontend. Si lees esto, React está funcionando</p>
    </div>
  );
}

export default App;
