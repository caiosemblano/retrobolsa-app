
  import { createRoot } from "react-dom/client";
  import App from "./app/App";
  import "./styles/index.css";
  import { registrarServiceWorker } from "./app/pwa";

  createRoot(document.getElementById("root")!).render(<App />);
  registrarServiceWorker();
  