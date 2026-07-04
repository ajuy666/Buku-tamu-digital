// ==============================
// Appsubadmin.js (FULL FIX SIDEBAR + NONAKTIF)
// ==============================

import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import SidebarSubadmin from "../components/SidebarSubadmin";
import ProtectedSubadmin from "../middleware/ProtectedSubadmin";

import DashboardSubadmin from "../pages/subadmin/DashboardSubadmin";
import DataTamuSubadmin from "../pages/subadmin/DataTamuSubadmin";
import ProfilPerusahaanSubadmin from "../pages/subadmin/ProfilPerusahaanSubadmin";
import PengaturanSubadmin from "../pages/subadmin/PengaturanSubadmin";
import SubadminNonaktif from "../pages/subadmin/SubadminNonaktif";

export default function Appsubadmin() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProtectedSubadmin>
      <div className="flex min-h-screen bg-gray-100">

        {/* SIDEBAR */}
        <SidebarSubadmin
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* CONTENT */}
        <div
          className={`flex-1 transition-all duration-300
            ${isSidebarOpen ? "ml-64" : "ml-20"}
          `}
        >
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardSubadmin />} />
            <Route path="data-tamu" element={<DataTamuSubadmin />} />
            <Route path="profil-perusahaan" element={<ProfilPerusahaanSubadmin />} />
            <Route path="pengaturan" element={<PengaturanSubadmin />} />

            {/* FIX — NONAKTIF ROUTE */}
            <Route path="subadmin-nonaktif" element={<SubadminNonaktif />} />
          </Routes>
        </div>

      </div>
    </ProtectedSubadmin>
  );
}
