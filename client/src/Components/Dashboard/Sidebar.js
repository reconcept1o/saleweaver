import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const colors = {
    text: "#000000",
    textHover: "#555555",
    accent: "#FBD041",
    accentHover: "#ecca3e",
    shadow: "rgba(0, 0, 0, 0.1)",
    sidebarBg: "#f8f9fa",
  };

  const sidebarLinks = [
    { to: "/dashboard/profile", label: "Profil" },
    { to: "/dashboard/settings", label: "Ayarlar" },
    { to: "/dashboard/reports", label: "Raporlar" },
  ];

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      navigate("/");
    });
  };

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: colors.sidebarBg,
        padding: "1rem",
        boxShadow: `2px 0 5px ${colors.shadow}`,
        minHeight: "100vh",
      }}
    >
      <Navbar.Brand
        className="fw-bold fs-4 mb-4"
        style={{ color: colors.text, cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        Logo
      </Navbar.Brand>
      <Nav className="flex-column">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className="nav-link-sidebar"
            style={({ isActive }) => ({
              color: isActive ? colors.textHover : colors.text,
              backgroundColor: isActive ? colors.accent : "transparent",
              fontWeight: 500,
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              textDecoration: "none",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </Nav>
      <Button
        style={{
          backgroundColor: colors.accent,
          border: "none",
          borderRadius: "50px",
          padding: "0.7rem 1.4rem",
          fontWeight: 600,
          marginTop: "1rem",
          width: "100%",
        }}
        onClick={handleLogout}
      >
        Çıkış Yap
      </Button>

      <style>{`
        .nav-link-sidebar:hover {
          background-color: ${colors.accent};
          color: ${colors.textHover};
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
