import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { FaBan } from "react-icons/fa";

export default function SubadminNonaktif() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md text-center rounded-xl shadow-xl p-8 border ${
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-center mb-4">
          <FaBan className="text-red-500 text-5xl" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>

        <p className="text-sm opacity-80 mb-5 leading-relaxed">
          Akun Subadmin Anda telah <b>dinonaktifkan</b> oleh pihak perusahaan,
          atau perusahaan sedang dalam kondisi <b>tidak aktif</b>.  
          <br />
          Untuk melanjutkan penggunaan sistem, silakan hubungi Admin atau pihak perusahaan.
        </p>

        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full py-2 mt-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
        >
          Kembali ke Login
        </button>
      </motion.div>
    </div>
  );
}
