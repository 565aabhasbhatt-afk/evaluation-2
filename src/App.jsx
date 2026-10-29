import React, { useState } from "react";
import { AppProvider } from "./AppContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Habits from "./pages/Habits";
import Progress from "./pages/Progress";

export default function App() {
  // Navigation state to track which page is currently active
  const [currentPage, setCurrentPage] = useState("home");

  function navigateToPage(page) {
    setCurrentPage(page);
  }

  // Render the component matching the current page
  function renderPage() {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "skills":
        return <Skills />;
      case "habits":
        return <Habits />;
      case "progress":
        return <Progress />;
      case "home":
      default:
        return <Home navigateToPage={navigateToPage} />;
    }
  }

  const activePage = renderPage();

  return (
    <AppProvider>
      {currentPage === "home" ? (
        activePage
      ) : (
        <Layout currentPage={currentPage} navigateToPage={navigateToPage}>
          {activePage}
        </Layout>
      )}
    </AppProvider>
  );
}
