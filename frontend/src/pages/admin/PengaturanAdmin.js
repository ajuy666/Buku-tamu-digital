import { useState } from "react";
import axios from "../../utils/axiosConfig";

import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PengaturanAdmin() {
  const { darkMode, toggleTheme } = useTheme();

  // Form state
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  // Notifikasi
  const [notif, setNotif] = useState({
    show: false,
    text: "",
    success: false,
  });

  const showNotif = (success, text) => {
    setNotif({ show: true, text, success });
    setTimeout(() => {
      setNotif({ show: false, text: "", success: false });
    }, 3000);
  };

  // ============================================================
  // 🔐 GANTI PASSWORD ADMIN — SUDAH DIOPTIMALKAN
  // ============================================================
  const handleGantiPassword = async () => {
    if (!oldPass || !newPass || !confirmPass)
      return showNotif(false, "⚠️ Semua kolom wajib diisi!");

    if (newPass !== confirmPass)
      return showNotif(false, "❌ Konfirmasi password tidak cocok!");

    try {
      setLoading(true);

      const res = await axios.put(`/admin/ganti-password`, {
        oldPassword: oldPass,
        newPassword: newPass,
      });

      showNotif(true, `✅ ${res.data.message}`);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err) {
      showNotif(
        false,
        err.response?.data?.error ||
          "❌ Terjadi kesalahan saat ganti password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 p-6"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md p-4 rounded-xl mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          ⚙️ Pengaturan Admin
        </h1>
      </motion.div>

      {/* GANTI PASSWORD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6 mb-8 max-w-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          🔐 Ganti Password
        </h2>

        <div className="space-y-3">
          <input
            type="password"
            placeholder="Password lama"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password baru"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Konfirmasi password baru"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="input-field"
          />

          <button
            onClick={handleGantiPassword}
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </motion.div>

      {/* TEMA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-6 max-w-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          🌙 Tema Dashboard
        </h2>

        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
              className="hidden"
            />

            <div
              className={`w-14 h-7 flex items-center rounded-full p-1 duration-300 ${
                darkMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                  darkMode ? "translate-x-7" : ""
                }`}
              ></div>
            </div>
          </label>

          <span className="text-gray-600 dark:text-gray-300 text-sm">
            {darkMode ? "Mode Gelap Aktif" : "Mode Terang Aktif"}
          </span>
        </div>
      </motion.div>

      {/* NOTIFIKASI */}
      <AnimatePresence>
        {notif.show && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 35 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
              notif.success ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notif.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Styling */}
      <style>
        {`
        .input-field {
          border: 1px solid rgb(209 213 219);
          background-color: rgb(249 250 251);
          color: rgb(31 41 55);
          padding: 8px;
          width: 100%;
          border-radius: 6px;
          outline: none;
        }
        .dark .input-field {
          border-color: rgb(75 85 99);
          background-color: rgb(51 65 85);
          color: white;
        }
        .input-field:focus {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5);
        }
      `}
      </style>
    </motion.main>
  );
}
