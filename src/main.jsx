import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppProviders from "./context/AppProviders";
import { ErrorBoundary } from "./components/ui/Error";
import "./styles/App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <App />
      </AppProviders>
    </ErrorBoundary>
  </React.StrictMode>
);