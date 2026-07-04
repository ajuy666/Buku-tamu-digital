import { Routes, Route, Navigate } from "react-router-dom";

import Appsuperadmin from "./apps/Appsuperadmin";
import Appadmin from "./apps/Appadmin";
import Appsubadmin from "./apps/Appsubadmin";
import Appuser from "./apps/Appuser";

import Login from "./pages/admin/Login";
import LoginSuperAdmin from "./pages/superadmin/LoginSuperAdmin";

import ForgotPasswordAdmin from "./pages/ForgotPasswordAdmin";
import ResetPasswordAdmin from "./pages/ResetPasswordAdmin";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminNonaktif from "./pages/admin/AdminNonaktif";
import SubadminNonaktif from "./pages/subadmin/SubadminNonaktif";



export default function App() {
  return (
    <Routes>

      {/* SUPERADMIN */}
      <Route path="/superadmin/login" element={<LoginSuperAdmin />} />
      <Route path="/superadmin/*" element={<Appsuperadmin />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* Redirect URL lama */}
      <Route path="/login-subadmin" element={<Navigate to="/login" replace />} />

      {/* ========================= */}
      {/* ADMIN */}
      {/* ========================= */}
      <Route
        path="/tenant/:tenant_id/admin/*"
        element={<Appadmin />}
      />

      {/* ADMIN NONAKTIF */}
      <Route
        path="/tenant/:tenant_id/admin-nonaktif"
        element={<AdminNonaktif />}
      />

      {/* ========================= */}
      {/* SUBADMIN */}
      {/* ========================= */}
      <Route
        path="/tenant/:tenant_id/subadmin/*"
        element={<Appsubadmin />}
      />

      {/* USER */}
      <Route path="/perusahaan/:domain/*" element={<Appuser />} />

      {/* FORGOT RESET */}
      <Route path="/forgot-password-admin" element={<ForgotPasswordAdmin />} />
      <Route path="/reset-password-admin" element={<ResetPasswordAdmin />} />

      {/* PRIVACY */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/tenant/:tenant_id/subadmin-nonaktif" element={<SubadminNonaktif />} />


      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="*" element={<h1>404 Halaman Tidak Ditemukan</h1>} />
    </Routes>
  );
}
