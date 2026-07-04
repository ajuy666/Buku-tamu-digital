// ==============================
// Appadmin.js (FINAL FIX AKURAT)
// ==============================

import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";
import ProtectedAdmin from "../middleware/ProtectedAdmin";

// 🧩 Pages
import Dashboard from "../pages/admin/Dashboard";
import DataTamu from "../pages/admin/DataTamu";
import ProfilPerusahaan from "../pages/admin/ProfilPerusahaan";
import PengaturanAdmin from "../pages/admin/PengaturanAdmin";
import SubAdminList from "../pages/admin/SubAdminList";

export default function Appadmin() {
  const { tenant_id } = useParams(); // 👍 FIX PENTING
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { darkMode } = useTheme();

  return (
    <ProtectedAdmin tenant_id={tenant_id}>
      <div
        className={`flex min-h-screen ${
          darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* SIDEBAR */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* CONTENT AREA */}
        <div
          className={`flex-1 p-4 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-tamu" element={<DataTamu />} />
            <Route path="profil" element={<ProfilPerusahaan />} />
            <Route path="pengaturan" element={<PengaturanAdmin />} />
            <Route path="kelola-subadmin" element={<SubAdminList />} />
          </Routes>
        </div>
      </div>
    </ProtectedAdmin>
  );
}
