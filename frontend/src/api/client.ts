import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000", // Dirección backend (si está luego en render, se cambia por el link de render)
});

export default client;
