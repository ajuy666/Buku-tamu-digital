import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function ProtectedAdmin({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    const tenantId = localStorage.getItem("tenant_id");

    if (!token || !admin || !tenantId) {
      navigate("/login");
      return;
    }

    const cekStatus = async () => {
      try {
        // 🔥 WAJIB: URL BACKEND YANG BENAR
        const res = await axios.get("/admin/cek-status");

        if (!res.data.aktif) {
          throw new Error("Admin nonaktif");
        }

        setChecking(false);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("tenant_id");

        navigate(`/tenant/${tenantId}/admin-nonaktif`);
      }
    };

    cekStatus();
  }, []);

  if (checking) return <div className="p-6">Memeriksa status akun...</div>;

  return children;
}
