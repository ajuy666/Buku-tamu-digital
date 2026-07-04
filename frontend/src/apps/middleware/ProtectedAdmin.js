import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";

export default function ProtectedAdmin({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");

    if (!token || !admin) {
      navigate("/login");
      return;
    }

    const cekStatus = async () => {
      try {
        const res = await axios.get("/admin/cek-status", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // admin nonaktif → langsung lempar
        if (!res.data.aktif) {
          throw new Error("Admin nonaktif");
        }

        setChecking(false);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        localStorage.removeItem("tenant_id");

        navigate("/admin-nonaktif");
      }
    };

    cekStatus();
  }, []);

  if (checking) return <div className="p-6">Memeriksa status akun...</div>;

  return children;
}
