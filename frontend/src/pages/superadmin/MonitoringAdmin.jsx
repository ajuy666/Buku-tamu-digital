import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MonitoringAdmin() {
  const [adminData, setAdminData] = useState([]);

  const fetchAdminStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/superadmin/monitoring-admin");
      setAdminData(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil data admin:", err);
    }
  };

  useEffect(() => {
    fetchAdminStatus();
    const interval = setInterval(fetchAdminStatus, 10000); // refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === "online") return "bg-green-500";
    if (status === "idle") return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🕒 Monitoring Aktivitas Admin</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <table className="min-w-full text-left border">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border">Perusahaan</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Terakhir Aktif</th>
              <th className="px-4 py-2 border">Idle (menit)</th>
            </tr>
          </thead>
          <tbody>
            {adminData.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2 border">{a.nama_perusahaan}</td>
                <td className="px-4 py-2 border">{a.username}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-3 py-1 text-white text-sm rounded ${getStatusColor(
                      a.status_real
                    )}`}
                  >
                    {a.status_real.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(a.last_active).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-2 border text-center">
                  {a.menit_idle ? a.menit_idle.toFixed(1) : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
