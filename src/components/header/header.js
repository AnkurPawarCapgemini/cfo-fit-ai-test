import React from "react";
import { useLocation } from "react-router-dom";
import { HeaderWrapper } from "./style";
import { FaSignOutAlt } from "react-icons/fa";
import UseAuthLogin from "../../store/useAuthLogin";

const Header = ({ isOpen, toggleSidebar }) => {
  const logout = UseAuthLogin((state) => state.logout);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getComponentName = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/fit_gpt":
        return "FIT GPT";
      case "/reports":
        return "Reports";
      // Add more cases as needed
      default:
        return "";
    }
  };

  return (
    <HeaderWrapper className="d-flex align-items-center justify-content-end right-1 relative">
      <div className="header w-full">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <h1 className="poppins-font ml-5" style={{ color: "#fff", fontSize: "24px" }}>
            {getComponentName()}
          </h1>
          <FaSignOutAlt
            style={{ cursor: "pointer", color: "#fff", fontSize: "24px" }}
            onClick={() => handleLogout()}
            className=""
            aria-hidden="true"
          />
        </div>
      </div>
    </HeaderWrapper>
  );
};

export default Header;