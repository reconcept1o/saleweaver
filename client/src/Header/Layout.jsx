import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import CustomCursor from "../Animation/CustomCursor";

function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      {/* CustomCursor sadece anasayfada render edilsin */}
      {location.pathname === "/" && <CustomCursor />}
      <main style={{ paddingTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
