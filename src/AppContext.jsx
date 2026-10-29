import { createContext, useContext, useEffect, useState } from "react";
import { initialData } from "./data/data";
import { loadData, saveData } from "./lib/storage";

// Create the context for sharing state across components
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Initialize state directly from localStorage (or fallback to initialData)
  const [data, setData] = useState(loadData);

  // Automatically save data to localStorage whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Toggle dark mode class on document body
  useEffect(() => {
    if (data.profile && data.profile.darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [data.profile]);

  // Helper function to update part of the app data
  function update(changes) {
    setData({ ...data, ...changes });
  }

  // Reset data back to default values
  function resetData() {
    setData(initialData);
  }

  return (
    <AppContext.Provider value={{ data, setData, update, resetData }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook so components can easily access the context
export function useApp() {
  return useContext(AppContext);
}