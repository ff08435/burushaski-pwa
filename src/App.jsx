import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUser } from "./context/UserContext";

import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ModuleView from "./pages/ModuleView";

export default function App() {
  const { loading } = useUser();

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
