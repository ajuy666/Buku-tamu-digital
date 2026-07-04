import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

import { FaUsers, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Auto tambah token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function DashboardSubadmin() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [statistik, setStatistik] = useState(null);
  const [recentGuests, setRecentGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Validasi role subadmin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "subadmin") navigate("/login");
  }, [navigate]);

  // Load data dari backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subadmin/dashboard");

        setStatistik({
          total_today: res.data.total_today,
          total_week: res.data.total_week,
          total_month: res.data.total_month,
          total_all: res.data.total_all,      // FIX TOTAL KUNJUNGAN!!
        });

        setRecentGuests(res.data.recent_guests || []);
      } catch (err) {
        console.error("Dashboard Subadmin Error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
      className={`flex-1 p-6 transition-all duration-300 
        ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"}
      `}
    >
      {/* HEADER */}
      <motion.div
        className={`shadow p-4 rounded-xl mb-6 flex items-center gap-3 transition-all
          ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
        `}
      >
        <span className="bg-blue-100 px-3 py-2 rounded-lg">📊</span>
        <h1 className="text-2xl font-bold">Dashboard Subadmin</h1>
      </motion.div>

      {/* STATISTIK */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<FaUsers />}
          color="text-blue-500"
          title="Tamu Hari Ini"
          value={statistik?.total_today || 0}
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaCalendarAlt />}
          color="text-green-500"
          title="Minggu Ini"
          value={statistik?.total_week || 0}
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaChartBar />}
          color="text-purple-500"
          title="Bulan Ini"
          value={statistik?.total_month || 0}
          darkMode={darkMode}
        />
        <StatCard
          icon={<FaChartBar />}
          color="text-yellow-500"
          title="Total Kunjungan"
          value={statistik?.total_all || 0}   // FIX PENTING !!!
          darkMode={darkMode}
        />
      </motion.div>

      {/* TAMU TERBARU */}
      <motion.div
        className={`p-6 rounded-xl shadow-md transition-all
          ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
        `}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          👥 Tamu Terbaru
        </h2>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr
                className={`${
                  darkMode
                    ? "bg-slate-700 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Instansi</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">No Telepon</th>
                <th className="p-3 text-left">Tujuan</th>
                <th className="p-3 text-left">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {recentGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500 dark:text-gray-300"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                recentGuests.map((t, i) => (
                  <tr
                    key={i}
                    className={`${
                      darkMode
                        ? "border-b border-slate-700 hover:bg-slate-700"
                        : "border-b border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <td className="p-3">{t.nama}</td>
                    <td className="p-3">{t.instansi || "-"}</td>
                    <td className="p-3">{t.email || "-"}</td>
                    <td className="p-3">{t.no_telp || "-"}</td>
                    <td className="p-3">{t.tujuan_kunjungan || t.tujuan || "-"}</td>
                    <td className="p-3">
                      {t.created_at
                        ? new Date(t.created_at).toLocaleString("id-ID")
                        : "-"}
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
      className={`p-5 rounded-xl shadow flex items-center gap-4 transition-all
        ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
      `}
    >
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </motion.div>
  );
}
