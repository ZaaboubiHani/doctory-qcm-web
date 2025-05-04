import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./contexts/AuthContext.jsx";
import SnackbarProvider from "./contexts/SnackbarContext.jsx";
import CategoriesProvider from "./contexts/CategoriesContext.jsx";
import ModulesProvider from "./contexts/ModulesContext.jsx";
import CoursesProvider from "./contexts/CoursesContext.jsx";
import QuestionsProvider from "./contexts/QuestionsContext.jsx";
import FavoritesProvider from "./contexts/FavoritesContext.jsx";
import NotesProvider from "./contexts/NotesContext.jsx";
import ReportsProvider from "./contexts/ReportsContext.jsx";
import ExamProvider from "./contexts/ExamContext.jsx";
import StatsProvider from "./contexts/StatsContext.jsx";
import ResidencyProvider from "./contexts/ResidencyContext.jsx";
import VersionProvider from "./contexts/VersionContext.jsx";

const toggleTheme = () => {
  const html = document.documentElement;
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

// Make it available globally
window.toggleTheme = toggleTheme;

ReactDOM.createRoot(document.getElementById("root")).render(
  <CategoriesProvider>
    <ModulesProvider>
      <CoursesProvider>
        <QuestionsProvider>
          <FavoritesProvider>
            <ExamProvider>
              <NotesProvider>
                <ReportsProvider>
                  <StatsProvider>
                    <SnackbarProvider>
                      <ResidencyProvider>
                        <VersionProvider>
                          <AuthProvider>
                            <App />
                          </AuthProvider>
                        </VersionProvider>
                      </ResidencyProvider>
                    </SnackbarProvider>
                  </StatsProvider>
                </ReportsProvider>
              </NotesProvider>
            </ExamProvider>
          </FavoritesProvider>
        </QuestionsProvider>
      </CoursesProvider>
    </ModulesProvider>
  </CategoriesProvider>
);
