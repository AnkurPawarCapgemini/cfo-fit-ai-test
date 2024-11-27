import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./components/login/loginForm";
import Header from "./components/header/header";
import Navbar from "./components/header/navbar";
import UseAuthLogin from "./store/useAuthLogin";
import Dashboard from "./modules/dashBoard/dashboard";
import FitGpt from "./modules/fitGPT/fitGpt";
import Report from "./modules/report/report";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, checkAuthOnLoad } = UseAuthLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthOnLoad();
      setLoading(false);
    };
    initializeAuth();
  }, [checkAuthOnLoad]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (location.pathname === "/login" || location.pathname === "/") {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isLoginPage = location.pathname === "/login";

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="app-container">
      {!isLoginPage && (
        <div style={{ position: "absolute" }} className="border-b-10">
          <div className={`bg-sky-100 rounded-lg sidebar ${isOpen ? "open" : ""} border-black z-50`} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRight: '1px solid #0070ad' }}>
            <div>
              <div className="hamburger" onClick={toggleSidebar}>
                {!isOpen ? (
                  <FaAngleRight className="menu-icon" />
                ) : (
                  <FaAngleLeft className="menu-icon" />
                )}
              </div>
              {isOpen ? (
                <img src="../images/logo.png" alt="Logo" />
              ) : (
                <div className="sm-logo-div">
                  <img
                    src="../images/logo_sm.png"
                    style={{
                      width: "69px",
                      height: "69px",
                      objectFit: "contain",
                    }}
                    alt="Logo"
                  />
                </div>
              )}

              <Navbar isOpen={isOpen} />
            </div>
          </div>
        </div>
      )}

      <div
        className={`${
          isLoginPage ? "" : `content-container ${isOpen ? "shifted" : ""}`
        }`}
      >
        {!isLoginPage && (
          <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
        )}
        <div className={`${isLoginPage ? "" : "content"}`}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fit_gpt"
              element={
                <ProtectedRoute>
                  <FitGpt />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
