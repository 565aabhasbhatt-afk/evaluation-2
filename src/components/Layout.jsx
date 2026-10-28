import React, { useState } from "react";
import Sidebar from "./Sidebar";

function Layout({ children, currentPage, navigateToPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPage={currentPage}
        navigateToPage={navigateToPage}
      />

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      <div className="main">
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
          ☰ Menu
        </button>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
