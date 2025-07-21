import React from "react";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode; // İçerik için alan
};
//! TEST
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* <header style={{ background: "lightgray", padding: "1rem" }}>
        <h1>Benim Navbarım</h1>
      </header> */}

      <main /*style={{ margin: "2rem" }}*/>
        <Outlet /> {/* Sayfa içeriği buraya gelecek */}
      </main>
      {/* 
      <footer style={{ background: "lightgray", padding: "1rem", marginTop: "2rem" }}>
        <p>Benim Footerım © 2025</p>
      </footer> */}
    </div>
  );
};

export default Layout;
