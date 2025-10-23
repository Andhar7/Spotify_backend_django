import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// @ts-ignore
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
