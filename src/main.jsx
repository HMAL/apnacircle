import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./styles/global.css";

const el = document.getElementById("root");
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

if (el.innerHTML.trim()) {
  hydrateRoot(el, app);
} else {
  createRoot(el).render(app);
}
