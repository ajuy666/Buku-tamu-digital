import { Navigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useEffect, useState } from "react";

export default function ProtectedSubadmin({ children }) {
  const token = localStorage.getItem("token");
  const tenant_id = localStorage.getItem("tenant_id");

  const [valid, setValid] = useState(null);

  useEffect(() => {
    if (!token) return setValid(false);

    axios
      .get("/subadmin/cek-status", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const statusSub = (res.data.status_subadmin || "").toLowerCase();
        const statusPerusahaan = (res.data.status_perusahaan || "").toLowerCase();

        console.log("CEK STATUS:", statusSub, statusPerusahaan);

        if (statusSub !== "active") return setValid(false);
        if (statusPerusahaan !== "aktif") return setValid(false);

        setValid(true);
      })
      .catch(() => setValid(false));
  }, []);

  if (valid === null) return <div>Mengecek akses...</div>;

  // 🔥 INI FIX TERPENTING
  // Jika tidak valid → arahkan ke halaman subadmin-nonaktif
  if (!valid)
    return (
      <Navigate
        to={`/tenant/${tenant_id}/subadmin-nonaktif`}
        replace
      />
    );

  return children;
}
