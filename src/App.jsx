import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect,useContext } from "react";
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
import { SnackbarContext, SnackbarType } from "./contexts/SnackbarContext";

import { AuthContext } from "./contexts/AuthContext";
import { VersionContext } from "./contexts/VersionContext";
import ResidencyStats from "./pages/ResidencyStats";
import ResidencyMenu from "./pages/ResidencyMenu";
import ResidencyCategories from "./pages/ResidencyCategories";

function AppContent({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

   const { login, setCurrentUser, getMe, updateUserInfo, getDeviceId } =
      useContext(AuthContext);
    const { showSnackbar } = useContext(SnackbarContext);
    const { version, setVersion, getLatestVersion } = useContext(VersionContext);

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

   useEffect(() => {
      handleAutoLogin();
    }, []);
  
    const handleAutoLogin = async () => {
      try {
        const token = localStorage.getItem("token");
        var verRes = await getLatestVersion();
  
        setVersion(verRes.data.data);
        if (token) {
          const userRes = await getMe(token);
  
          if (
            userRes.data.data.deviceToken === null ||
            userRes.data.data.deviceToken === undefined ||
            userRes.data.data.deviceToken === ""
          ) {
            localStorage.clear();
            setToken(null);
          } else {
            const deviceId = localStorage.getItem("deviceId");
            if (userRes.data.data.deviceToken === deviceId) {
              localStorage.setItem("year", userRes.data.data.year);
              
              userRes.data.data.token = token;
              setCurrentUser(userRes.data.data);
              if(userRes.data.data.year === "Residency"){
  
                navigate("/categories");
              }
              else{
                navigate("/modules");
  
              }
            } else {
              setToken(null);
              localStorage.clear();
            }
          }
        }
      } catch (error) {
        localStorage.clear();
        setToken(null);
      } finally {
      }
    };

  return (
        <div className={`flex-grow-1 w-full h-full overflow-auto ${localStorage.getItem("token") ? "mt-16" : ""} lg:mt-0 dark:bg-black`}>
          <Routes>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/residency-categories" element={<ResidencyCategories />} />
            <Route
              path="/favorites-categories"
              element={<FavoriteCategories />}
            />
            <Route
              path="/favorites-modules"
              element={<FavoriteModules />}
            />
            <Route
              path="/favorites-modules/:id"
              element={<FavoriteModules />}
            />
            <Route
              path="/favorites-courses/:id"
              element={<FavoriteCourses />}
            />
            <Route
              path="/favorites-questions/:id"
              element={<FavoriteQuestions />}
            />
            <Route path="/favorites-quiz/:index" element={<FavoriteQuiz />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/modules/:id" element={<Modules />} />
            <Route path="/courses/:id" element={<Courses />} />
            <Route path="/questions/:id" element={<Questions />} />
            <Route path="/quiz/:index" element={<Quiz />} />
            <Route path="/exam/:id" element={<ExamQuiz />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route
              path="/simulation-details/:id"
              element={<SimulationDetails />}
            />
            <Route path="/simulation-quiz" element={<SimulationQuiz />} />
            <Route path="/residency" element={<Residency />} />
            <Route path="/residency/:id" element={<Residency />} />
            <Route path="/residency-menu" element={<ResidencyMenu />} />
            <Route path="/residency-stats" element={<ResidencyStats />} />
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
