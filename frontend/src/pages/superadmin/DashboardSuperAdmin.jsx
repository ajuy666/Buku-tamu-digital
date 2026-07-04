import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardSuperAdmin() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [stats, setStats] = useState({
    total_perusahaan: 0,
    total_admin: 0,
  });

  const [perusahaan, setPerusahaan] = useState([]);

  // =======================================================
  // 🔐 CEK LOGIN SUPERADMIN (UNIVERSAL LOGIN)
  // =======================================================
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("superadmin_login");

    if (!isLoggedIn) {
      navigate("/"); // redirect universal login
      return;
    }

    fetchStats();
    fetchPerusahaan();
  }, []);

  // =======================================================
  // 📊 FETCH TOTAL PERUSAHAAN & ADMIN
  // =======================================================
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/superadmin/statistik-global");
      setStats(res.data);
    } catch (err) {
      console.error("Gagal ambil statistik:", err);
    }
  };

  // =======================================================
  // 🏢 FETCH DATA PERUSAHAAN
  // =======================================================
  const fetchPerusahaan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/superadmin/perusahaan");
      setPerusahaan(res.data);
    } catch (err) {
      console.error("Gagal ambil perusahaan:", err);
    }
  };

  // Animasi Framer Motion
  const pageAnim = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={pageAnim}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      className={`
        min-h-screen p-8 transition-all
        ${darkMode ? "bg-slate-900 text-slate-100" : "bg-gray-100 text-gray-800"}
      `}
    >
      {/* HEADER */}
      <motion.div
        variants={pageAnim}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1, duration: 0.45 }}
        className={`
          shadow-md p-4 mb-6 rounded-lg border
          ${darkMode 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-gray-300"}
        `}
      >
        <h3 className="text-2xl font-semibold">📊 Dashboard Super Admin</h3>
        <p className={darkMode ? "text-slate-400" : "text-gray-500"}>
          Daftar perusahaan & statistik sistem
        </p>
      </motion.div>

      {/* STATISTIC CARDS */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* TOTAL PERUSAHAAN */}
        <motion.div
          variants={pageAnim}
          className={`
            rounded-xl shadow p-5 flex items-center gap-4 border
            ${darkMode 
              ? "bg-slate-800 border-slate-700" 
              : "bg-white border-gray-300"}
          `}
        >
          <div className="text-blue-400 text-4xl">🏢</div>
          <div>
            <p className={darkMode ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>
              Total Perusahaan
            </p>
            <h3 className="text-3xl font-bold">{stats.total_perusahaan}</h3>
          </div>
        </motion.div>

        {/* TOTAL ADMIN */}
        <motion.div
          variants={pageAnim}
          className={`
            rounded-xl shadow p-5 flex items-center gap-4 border
            ${darkMode 
              ? "bg-slate-800 border-slate-700" 
              : "bg-white border-gray-300"}
          `}
        >
          <div className="text-purple-400 text-4xl">👤</div>
          <div>
            <p className={darkMode ? "text-slate-400 text-sm" : "text-gray-500 text-sm"}>
              Total Admin
            </p>
            <h3 className="text-3xl font-bold">{stats.total_admin}</h3>
          </div>
        </motion.div>
      </motion.div>

      {/* TABEL PERUSAHAAN */}
      <motion.div
        variants={pageAnim}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2, duration: 0.45 }}
        className={`
          rounded-xl shadow-md p-6 border
          ${darkMode 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-gray-300"}
        `}
      >
        <h4 className="text-lg font-semibold mb-4">📋 Data Perusahaan Terdaftar</h4>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr
                className={`
                  text-left
                  ${darkMode ? "bg-slate-700" : "bg-gray-200"}
                `}
              >
                <th className="p-3">Nama Perusahaan</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Kontak Admin</th>
                <th className="p-3">Status</th>
                <th className="p-3">Masa Berlaku</th>
              </tr>
            </thead>

            <tbody>
              {perusahaan.length > 0 ? (
                perusahaan.map((item) => (
                  <tr
                    key={item.id}
                    className={`
                      border-b transition
                      ${darkMode 
                        ? "border-slate-700 hover:bg-slate-700" 
                        : "border-gray-300 hover:bg-gray-100"}
                    `}
                  >
                    <td className="p-3">{item.nama_perusahaan}</td>
                    <td className="p-3">{item.domain || "-"}</td>
                    <td className="p-3">{item.kontak_admin || "-"}</td>

                    <td className="p-3">
                      <span
                        className={`
                          px-3 py-1 rounded text-xs text-white
                          ${
                            item.status_sewa === "aktif"
                              ? "bg-green-600"
                              : item.status_sewa === "nonaktif"
                              ? "bg-yellow-500"
                              : "bg-red-600"
                          }
                        `}
                      >
                        {item.status_sewa}
                      </span>
                    </td>

                    <td className="p-3">
                      {item.masa_berlaku
                        ? item.masa_berlaku.split("T")[0]
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className={`p-5 text-center ${
                      darkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    Tidak ada data perusahaan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
