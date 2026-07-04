import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";

import { FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Tambahkan token di setiap request axios
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function DataTamu() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [dataTamu, setDataTamu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    keyword: "",
    start: "",
    end: "",
  });

  // ===================== MODAL STATE =====================
  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "", // success | error | confirm
    onConfirm: null,
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const fetchTamu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.keyword) params.keyword = filter.keyword;
      if (filter.start) params.start = filter.start;
      if (filter.end) params.end = filter.end;

      const res = await axios.get("http://localhost:5000/admin/tamu", {
        params,
      });

      setDataTamu(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil data tamu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamu();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTamu();
  };

  // ===================== DELETE =====================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data tamu ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/admin/tamu/${id}`);
      fetchTamu();
    } catch {
      alert("Gagal menghapus data tamu!");
    }
  };

  // ===================== EXPORT CONFIRM MODAL =====================
  const handleExport = (type) => {
    setModal({
      show: true,
      title: "Ingin mengekspor data?",
      message: `Data akan diekspor ke file ${type.toUpperCase()}.`,
      type: "confirm",
      onConfirm: () => exportNow(type),
    });
  };

  // ===================== EXPORT FIX (BLOB + TOKEN + ERROR CHECK) =====================
  const exportNow = async (type) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/export/${type}`,
        {
          responseType: "blob",
          params: filter,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // =============================
      // DETEKSI ERROR JSON DARI BLOB
      // =============================
      const isJson =
        res.data.type === "application/json" ||
        res.headers["content-type"]?.includes("application/json");

      if (isJson) {
        const reader = new FileReader();
        reader.onload = () => {
          const err = JSON.parse(reader.result);
          setModal({
            show: true,
            title: "Gagal!",
            message: err.error || "Terjadi kesalahan saat mengekspor file.",
            type: "error",
          });
        };
        reader.readAsText(res.data);
        return;
      }

      // =============================
      // DOWNLOAD FILE
      // =============================
      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `data_tamu.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // =============================
      // MODAL SUKSES
      // =============================
      setModal({
        show: true,
        title: "Berhasil!",
        message: `File ${type.toUpperCase()} berhasil diekspor.`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        title: "Gagal!",
        message: "Terjadi kesalahan saat mengunduh file.",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Memuat data tamu...
      </div>
    );
  }

  return (
    <>
      {/* ===================== MODAL ===================== */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">
              {modal.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {modal.message}
            </p>

            {/* Confirm */}
            {modal.type === "confirm" && (
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    modal.onConfirm();
                    setModal({ ...modal, show: false });
                  }}
                >
                  Ya
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-700 dark:text-white rounded-lg"
                  onClick={() => setModal({ ...modal, show: false })}
                >
                  Tidak
                </button>
              </div>
            )}

            {/* Success */}
            {modal.type === "success" && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setModal({ ...modal, show: false })}
              >
                OK
              </button>
            )}

            {/* Error */}
            {modal.type === "error" && (
              <div className="flex gap-3 justify-center">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => setModal({ ...modal, show: false })}
                >
                  Tutup
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => window.location.reload()}
                >
                  Coba Lagi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== CONTENT ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
          darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* HEADER */}
        <div
          className={`shadow p-3 md:p-4 rounded-xl mb-6 flex flex-col md:flex-row 
            md:items-center justify-between gap-3 md:gap-0
            ${darkMode ? "bg-slate-800 text-white" : "bg-white"}
          `}
        >
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            📋 Data Tamu
          </h1>

          {/* EXPORT BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("pdf")}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white flex items-center gap-2 text-sm"
            >
              <FaDownload /> PDF
            </button>

            <button
              onClick={() => handleExport("xlsx")}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white flex items-center gap-2 text-sm"
            >
              <FaDownload /> Excel
            </button>
          </div>
        </div>

        {/* FILTER */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleFilterSubmit}
          className={`p-4 rounded-xl mb-6 shadow flex flex-wrap items-end gap-4
            ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
          `}
        >
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm mb-1">Cari Nama / Instansi / Tujuan</label>
            <input
              type="text"
              placeholder="Ketik kata kunci..."
              value={filter.keyword}
              onChange={(e) =>
                setFilter({ ...filter, keyword: e.target.value })
              }
              className={`p-2 rounded w-full sm:w-56 ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Tanggal Awal</label>
            <input
              type="date"
              value={filter.start}
              onChange={(e) =>
                setFilter({ ...filter, start: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Tanggal Akhir</label>
            <input
              type="date"
              value={filter.end}
              onChange={(e) =>
                setFilter({ ...filter, end: e.target.value })
              }
              className={`p-2 rounded ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white flex items-center gap-2"
          >
            <FaSearch /> Filter
          </button>
        </motion.form>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 md:p-5 rounded-xl shadow overflow-x-auto
            ${darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"}
          `}
        >
          <table className="min-w-full text-xs md:text-sm">
            <thead>
              <tr
                className={
                  darkMode
                    ? "bg-slate-700 text-white"
                    : "bg-gray-200 text-gray-900"
                }
              >
                <th className="p-2 md:p-3">Nama</th>
                <th className="p-2 md:p-3">No. Telepon</th>
                <th className="p-2 md:p-3">Instansi</th>
                <th className="p-2 md:p-3">Email</th>
                <th className="p-2 md:p-3">Alamat</th>
                <th className="p-2 md:p-3">Tujuan</th>
                <th className="p-2 md:p-3">Tanggal</th>
                <th className="p-2 md:p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {dataTamu.length > 0 ? (
                dataTamu.map((t) => (
                  <tr
                    key={t.id}
                    className={`transition ${
                      darkMode
                        ? "border-b border-slate-700 hover:bg-slate-700"
                        : "border-b border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <td className="p-2 md:p-3">{t.nama}</td>
                    <td className="p-2 md:p-3">{t.no_telp}</td>
                    <td className="p-2 md:p-3">{t.instansi || "-"}</td>
                    <td className="p-2 md:p-3">{t.email || "-"}</td>
                    <td className="p-2 md:p-3">{t.alamat || "-"}</td>
                    <td className="p-2 md:p-3">
                      {t.tujuan_kunjungan || "-"}
                    </td>
                    <td className="p-2 md:p-3">
                      {new Date(t.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2 md:p-3 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-400 text-base md:text-lg"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </>
  );
}
