import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { useState, useEffect } from "react";

import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ModuleView from "./pages/ModuleView";
import { syncPendingRecordings } from "./utils/syncRecordings";
export default function App() {
  const { loading } = useUser();

useEffect(() => {
  const handleOnline = () => {
    console.log("🌐 Back online");
    syncPendingRecordings();
  };

  window.addEventListener("online", handleOnline);

  // Run once on app start too
  syncPendingRecordings();

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}, []);


  // Wait until user is loaded from localStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-500 flex items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/module/:moduleId" element={<ModuleView />} />
      </Routes>
    </BrowserRouter>
  );
}
