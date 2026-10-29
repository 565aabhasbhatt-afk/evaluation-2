import React from "react";
import { useApp } from "../AppContext";

const links = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "skills", label: "Skills", icon: "📚" },
  { id: "habits", label: "Habits", icon: "✅" },
  { id: "progress", label: "Progress", icon: "📈" },
];

function Sidebar({ open, onClose, currentPage, navigateToPage }) {
  const { data } = useApp();

  const handleNavigate = (page) => {
    if (navigateToPage) {
      navigateToPage(page);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={open ? "sidebar sidebar-open" : "sidebar"}>
      <button
        type="button"
        className="logo"
        onClick={() => handleNavigate("home")}
      >
        <span className="logo-mark">S</span> SkillSphere
      </button>

      <nav className="side-nav">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => handleNavigate(link.id)}
            className={currentPage === link.id ? "side-link side-link-active" : "side-link"}
          >
            <span>{link.icon}</span> {link.label}
          </button>
        ))}
      </nav>

      <div className="side-user">
        <div className="avatar">{data.profile.name.charAt(0)}</div>
        <div>
          <p className="side-user-name">{data.profile.name}</p>
          <p className="side-user-sub">Learning every day</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

