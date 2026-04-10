
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Home from "./pages/Home";  
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";       
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Editor from "./pages/Editor";
import VersionHistory from "./pages/VersionHistory";
import CreateWorkspace from "./pages/CreateWorkspace";
import RunCode from "./pages/RunCode";


export default function App() {
  return (
    <div className="App">
      <div className="glow-overlay" />
    <AuthProvider>
      <>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Password Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 🧠 App Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/versions/:id" element={<VersionHistory />} />
          <Route path="/create-workspace" element={<CreateWorkspace />} />
          <Route path="/run/:fileId" element={<RunCode />} />
        </Routes>

        {/* 🔔 Global Toasts */}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
      </>
    </AuthProvider>
    </div>
    
  );
}
