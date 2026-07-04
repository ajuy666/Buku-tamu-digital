import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Sidebar
import SidebarSuperAdmin from "../components/SidebarSuperAdmin";

// Pages
import DashboardSuperAdmin from "../pages/superadmin/DashboardSuperAdmin";
import PerusahaanList from "../pages/superadmin/PerusahaanList";
import AdminList from "../pages/superadmin/AdminList";
import SettingsSuperAdmin from "../pages/superadmin/SettingsSuperAdmin";

export default function Appsuperadmin() {

  // ============================
  // 💾 SIMPAN STATE SIDEBAR
  // ============================
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen_superadmin");
    return saved ? saved === "true" : true; // default terbuka
  });

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarOpen_superadmin", String(next));
      return next;
    });
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <SidebarSuperAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* CONTENT */}
      <div
        className={`flex-1 min-h-screen bg-gray-100 dark:bg-slate-900 p-6 transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-20"}
        `}
      >
        <Routes>
          {/* Default → /superadmin */}
          <Route index element={<DashboardSuperAdmin />} />

          {/* Route utama */}
          <Route path="dashboard" element={<DashboardSuperAdmin />} />
          <Route path="perusahaan" element={<PerusahaanList />} />
          <Route path="admin" element={<AdminList />} />
          <Route path="settings" element={<SettingsSuperAdmin />} />

          {/* 404 → fallback ke dashboard */}
          <Route path="*" element={<DashboardSuperAdmin />} />
        </Routes>
      </div>
    </div>
  );
}
