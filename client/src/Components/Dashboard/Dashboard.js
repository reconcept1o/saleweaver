import React from "react";
import { Container } from "react-bootstrap"; // Container react-bootstrap'tan import edildi
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const colors = {
    text: "#000000",
    subtleBg: "rgba(255, 255, 255, 0.75)",
    shadow: "rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-grow-1 p-4">
        <Container>
          <h2>Hoş Geldiniz, {user?.name || "Kullanıcı"}!</h2>
          <div
            style={{
              backgroundColor: colors.subtleBg,
              padding: "2rem",
              borderRadius: "15px",
              boxShadow: `0 4px 20px ${colors.shadow}`,
            }}
          >
            <Outlet /> {/* Alt rotaların içeriği burada render edilecek */}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Dashboard;
