import { Navigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useEffect, useState } from "react";

export default function ProtectedSubadmin({ children }) {
  const token = localStorage.getItem("token");
  const subadminData = JSON.parse(localStorage.getItem("subadmin") || "{}");
  const tenant_id = localStorage.getItem("tenant_id");

  const [valid, setValid] = useState(null);

  useEffect(() => {
    // ❗ FIX PALING PENTING: cek apakah subadminData punya ID
    if (!token || !subadminData.id) {
      return setValid(false);
    }

    // 🔥 CEK STATUS SUBADMIN & PERUSAHAAN
    axios
      .get("/subadmin/cek-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const status_subadmin = res.data.status_subadmin;
        const status_perusahaan = res.data.status_perusahaan;

        // ❗ kalau subadmin nonaktif → tolak
        if (status_subadmin !== "active") return setValid(false);

        // ❗ kalau perusahaan nonaktif → tolak
        if (status_perusahaan !== "aktif") return setValid(false);

        setValid(true); // 🟢 Lolos semua
      })
      .catch(() => setValid(false));
  }, []);

  // ❗ Loading state
  if (valid === null) return <div>Mengecek akses...</div>;

  // ❗ Gagal validasi → redirect ke halaman nonaktif
  if (!valid) {
    return (
      <Navigate
        to={`/tenant/${tenant_id}/subadmin-nonaktif`}
        replace
      />
    );
  }

  // 🟢 Aman, role subadmin aktif dan perusahaan aktif
  return children;
}
