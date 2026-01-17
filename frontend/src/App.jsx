import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Editor from "./pages/Editor";
import VersionHistory from "./pages/VersionHistory";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/:id" element={<Workspace />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/versions/:id" element={<VersionHistory />} />
      </Routes>
    </AuthProvider>
  );
}
