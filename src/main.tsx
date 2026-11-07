import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/400.css";
import "@fontsource-variable/archivo/index.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
