import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export default function SettingsSuperAdmin({ isSidebarOpen }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        flex-1 p-6 min-h-screen transition-all duration-300 
        ${isSidebarOpen ? "ml-64" : "ml-0"}
        ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-800"}
      `}
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`
          bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 
          shadow-md p-4 rounded-xl mb-8
        `}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          ⚙️ Pengaturan SuperAdmin
        </h1>
      </motion.div>

      {/* AKUN SUPERADMIN */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={`
          bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border 
          border-gray-200 dark:border-slate-700 mb-8 max-w-2xl
        `}
      >
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
          🔐 Pengaturan Akun
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username baru"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password baru"
            className="input-field"
          />

          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            Simpan Perubahan
          </button>
        </div>
      </motion.div>

      {/* TEMA (SAMA PERSIS DENGAN ADMIN) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className={`
          bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border 
          border-gray-200 dark:border-slate-700 max-w-2xl
        `}
      >
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          🌙 Tema Dashboard
        </h2>

        <div className="flex items-center gap-3">
          {/* SWITCH MODE GELAP/TERANG */}
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

          <span className="text-gray-700 dark:text-gray-300 text-sm">
            {darkMode ? "Mode Gelap Aktif" : "Mode Terang Aktif"}
          </span>
        </div>
      </motion.div>

      {/* Input Styling */}
      <style>{`
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
      `}</style>
    </motion.main>
  );
}
