import React, { useState } from "react";
import { AppProvider } from "./AppContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills"; 
import Habits from "./pages/Habits";
import Progress from "./pages/Progress";
import GoalPredictor from "./pages/GoalPredictor";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  function navigateToPage(page) {
    setCurrentPage(page);
  }

  let page;

  if (currentPage === "home") {
    page = <Home navigateToPage={navigateToPage} />;
  } else if (currentPage === "dashboard") {
    page = <Dashboard />;
  } else if (currentPage === "skills") {
    page = <Skills />;
  } else if (currentPage === "habits") {
    page = <Habits />;
  } else if (currentPage === "progress") {
    page = <Progress />;
  } else if (currentPage === "goalPredictor") {
    page = <GoalPredictor />;
  } else {
    page = <Home navigateToPage={navigateToPage} />;
  }

  return (
    <AppProvider>
      {currentPage === "home" ? (
        page
      ) : (
        <Layout currentPage={currentPage} navigateToPage={navigateToPage}>
          {page}
        </Layout>
      )}
    </AppProvider>
  );
}
