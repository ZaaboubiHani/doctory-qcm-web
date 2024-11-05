import {
  BrowserRouter as Router,
  Route,
  Routes,
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


function AppContent({ setToken }) {
  return (
    <div className="flex-grow-1 w-full h-full overflow-auto">
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/modules/:id" element={<Modules />} />
        <Route path="/courses/:id" element={<Courses />} />
        <Route path="/questions/:id" element={<Questions />} />
        <Route path="/quiz/:index" element={<Quiz />} />
        <Route path="/profile" element={<Profile setToken={setToken}/>} />
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
        <div className="h-screen flex flex-col lg:flex-row">
          {token && <Sidebar />}
          <AppContent setToken={setToken} />
        </div>
        <Snackbar />
      </div>
    </Router>
  );
}

export default App;
