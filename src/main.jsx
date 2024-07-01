import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthContext.jsx";
import SnackbarProvider from "./contexts/SnackbarContext.jsx";
import CategoriesProvider from "./contexts/CategoriesContext.jsx";
import ModulesProvider from "./contexts/ModulesContext.jsx";
import CoursesProvider from "./contexts/CoursesContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <CategoriesProvider>
    <ModulesProvider>
      <CoursesProvider>
        <SnackbarProvider>
          <AuthProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </AuthProvider>
        </SnackbarProvider>
      </CoursesProvider>
    </ModulesProvider>
  </CategoriesProvider>
);
