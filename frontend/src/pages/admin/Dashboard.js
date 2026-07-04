import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosConfig";

import { FaUsers, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Auto tambah token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { tenant_id } = useParams(); 
  const { darkMode } = useTheme();

  const [statistik, setStatistik] = useState(null);
  const [tamuTerbaru, setTamuTerbaru] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cek login admin
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const role = localStorage.getItem("role");

    if (!admin || role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Load data statistik + tamu
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!tenant_id) return;

        // 📌 FIX: Endpoint backend yang valid
        const [statRes, tamuRes] = await Promise.all([
          axios.get(`http://localhost:5000/admin/statistik/${tenant_id}`),

          // 🔥 FIX UTAMA — gunakan endpoint /admin/tamu
          axios.get("http://localhost:5000/admin/tamu"),
        ]);

        setStatistik(statRes.data);

        // 🔥 Filter 10 terbaru sesuai tenant_id (karena backend belum punya route-nya)
        const filtered = (tamuRes.data || [])
          .filter((t) => t.tenant_id === tenant_id)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);

        setTamuTerbaru(filtered);

      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [tenant_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex-1 p-4 md:p-6 transition-all duration-300
        ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      {/* TITLE */}
      <motion.div
        className={`shadow p-3 md:p-4 rounded-xl mb-6 flex items-center gap-3 
          ${darkMode ? "bg-slate-800" : "bg-white"}
        `}
      >
        <span className="bg-blue-100 px-3 py-2 rounded-lg text-blue-700 text-lg">
          📊
        </span>
        <h1 className="text-xl md:text-2xl font-bold">Dashboard Admin</h1>
      </motion.div>

      {/* STATISTIK GRID */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard
          icon={<FaUsers />}
          color="text-blue-500"
          title="Total Pengunjung"
          value={statistik?.total_pengunjung || 0}
          darkMode={darkMode}
        />

        <StatCard
          icon={<FaCalendarAlt />}
          color="text-green-500"
          title="Bulan Ini"
          value={statistik?.bulan_ini || 0}
          darkMode={darkMode}
        />

        <StatCard
          icon={<FaChartBar />}
          color="text-yellow-500"
          title="Minggu Ini"
          value={statistik?.minggu_ini || 0}
          darkMode={darkMode}
        />

        <StatCard
          icon={<FaChartBar />}
          color="text-purple-500"
          title="Rata-rata Harian"
          value={statistik?.rata_harian || 0}
          darkMode={darkMode}
        />
      </motion.div>

      {/* TABEL TAMU */}
      <motion.div
        className={`p-4 md:p-6 rounded-xl shadow-md 
          ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
        `}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          👥 Pengunjung Terbaru
        </h2>

        <div className="overflow-x-auto rounded-lg pb-2">
          <table className="min-w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className={`${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
                <th className="p-2 md:p-3 text-left">Nama</th>
                <th className="p-2 md:p-3 text-left">Instansi</th>
                <th className="p-2 md:p-3 text-left">Tujuan</th>
                <th className="p-2 md:p-3 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {tamuTerbaru.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                tamuTerbaru.map((t, i) => (
                  <tr
                    key={i}
                    className={`${darkMode
                      ? "border-b border-slate-700 hover:bg-slate-700"
                      : "border-b border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <td className="p-2 md:p-3">{t.nama}</td>
                    <td className="p-2 md:p-3">{t.instansi || "-"}</td>
                    <td className="p-2 md:p-3">{t.tujuan_kunjungan || "-"}</td>
                    <td className="p-2 md:p-3">
                      {new Date(t.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, color, title, value, darkMode }) {
  return (
    <motion.div
      className={`p-4 md:p-5 rounded-xl shadow flex items-center gap-3 md:gap-4
        ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
      `}
    >
      <div className={`text-2xl md:text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-[11px] md:text-sm opacity-80">{title}</p>
        <h2 className="text-lg md:text-2xl font-bold">{value}</h2>
      </div>
    </motion.div>
  );
}
