import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";
import Modules from "./pages/Modules";
import Courses from "./pages/Courses";
import Snackbar from "./components/Snackbar";
import Questions from "./pages/Questions";
import Quiz from "./pages/Quiz";
import ErrorPage from "./pages/Error-Page";
import Sidebar from "./components/Sidebar";
import Profile from "./pages/Profile";
import FavoriteCategories from "./pages/FavoriteCategories";
import FavoriteModules from "./pages/FavoriteModules";
import FavoriteCourses from "./pages/FavoriteCourses";
import FavoriteQuestions from "./pages/FavoriteQuestions";
import FavoriteQuiz from "./pages/FavoriteQuiz";
import ExamQuiz from "./pages/ExamQuiz";
import Simulation from "./pages/Simulation";
import SimulationQuiz from "./pages/SimulationQuiz";
import SimulationDetails from "./pages/SimulationDetails";
import Stats from "./pages/Stats";
import Residency from "./pages/Residency";

function AppContent({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      
      
      if (
        !token &&
        location.pathname !== "/" &&
        location.pathname !== "/signup"
      ) {
        navigate("/");
      }
    };
  
    checkToken();
  
    // Optionally, set up a listener for storage changes (if token might be removed from another tab)
    const storageListener = () => {
  
      if (
        !localStorage.getItem("token") &&
        location.pathname !== "/" &&
        location.pathname !== "/signup"
      ) {
        navigate("/");
      }
    };
    window.addEventListener("storage", storageListener);
  
    // Clean up the event listener
    return () => {
      window.removeEventListener("storage", storageListener);
    };
  }, [location, navigate]);

  return (
    <div className="flex-grow-1 w-full h-full overflow-auto">
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/favorites-categories" element={<FavoriteCategories />} />
        <Route path="/favorites-modules/:id" element={<FavoriteModules />} />
        <Route path="/favorites-courses/:id" element={<FavoriteCourses />} />
        <Route
          path="/favorites-questions/:id"
          element={<FavoriteQuestions />}
        />
        <Route path="/favorites-quiz/:index" element={<FavoriteQuiz />} />
        <Route path="/modules/:id" element={<Modules />} />
        <Route path="/courses/:id" element={<Courses />} />
        <Route path="/questions/:id" element={<Questions />} />
        <Route path="/quiz/:index" element={<Quiz />} />
        <Route path="/exam/:id" element={<ExamQuiz />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/simulation-details/:id" element={<SimulationDetails />} />
        <Route path="/simulation-quiz" element={<SimulationQuiz />} />
        <Route path="/residency" element={<Residency />} />
        <Route path="/profile" element={<Profile setToken={setToken} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <Router>
      <div className="overflow-hidden">
        <div className="h-screen flex flex-col lg:flex-row ">
          {token && <Sidebar />}
          <AppContent setToken={setToken} />
        </div>
        <Snackbar />
      </div>
    </Router>
  );
}

export default App;
