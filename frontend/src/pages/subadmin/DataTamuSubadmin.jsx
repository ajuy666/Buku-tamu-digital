import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";

import { FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// Interceptor token otomatis
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function DataTamuSubadmin() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [dataTamu, setDataTamu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
    type: "", // success | error | confirm
    onConfirm: null,
  });

  const showModal = (title, message, type = "success", onConfirm = null) => {
    setModal({ show: true, title, message, type, onConfirm });
  };

  const closeModal = () => {
    setModal({ show: false, title: "", message: "", type: "", onConfirm: null });
  };

  const [filter, setFilter] = useState({
    keyword: "",
    start: "",
    end: "",
  });

  // Validasi
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "subadmin") navigate("/login");
  }, [navigate]);

  // Ambil data tamu
  const fetchTamu = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.keyword) params.keyword = filter.keyword;
      if (filter.start) params.start = filter.start;
      if (filter.end) params.end = filter.end;

      const res = await axios.get("http://localhost:5000/api/subadmin/tamu", {
        params,
      });

      setDataTamu(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
      showModal("Gagal Memuat Data", "Terjadi kesalahan saat mengambil data tamu.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTamu();
  }, []);

  // Filter
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTamu();
  };

  // Hapus data
  const handleDelete = async (id) => {
    showModal(
      "Hapus Data?",
      "Apakah kamu yakin ingin menghapus data tamu ini?",
      "confirm",
      async () => {
        try {
          await axios.delete(`http://localhost:5000/api/subadmin/tamu/${id}`);
          fetchTamu();
          showModal("Berhasil", "Data tamu berhasil dihapus!", "success");
        } catch (err) {
          showModal("Gagal", "Tidak dapat menghapus data!", "error");
        }
      }
    );
  };

  // Export PDF/Excel
  const handleExport = async (type) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/subadmin/export/${type}`,
        {
          responseType: "blob",
          params: filter,
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `data_tamu.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showModal("Berhasil", "Data berhasil diekspor!", "success");
    } catch (err) {
      showModal("Gagal Ekspor", "Terjadi kesalahan saat mengekspor data.", "error");
    }
  };

  // LOADING
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl shadow-xl w-80 ${
              darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{modal.title}</h2>
            <p className="mb-5">{modal.message}</p>

            <div className="flex justify-end gap-3">
              {/* CONFIRM MODAL */}
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={() => {
                      closeModal();
                      modal.onConfirm && modal.onConfirm();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Ya
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-gray-800"
                  >
                    Tidak
                  </button>
                </>
              ) : (
                <button
                  onClick={closeModal}
                  className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ===================== END MODAL ===================== */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`flex-1 p-6 transition-all duration-300 ${
          darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* HEADER */}
        <div
          className={`shadow p-4 rounded-xl mb-6 flex justify-between items-center ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📋 Data Tamu Subadmin
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport("pdf")}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded flex items-center gap-2 text-white"
            >
              <FaDownload /> PDF
            </button>

            <button
              onClick={() => handleExport("xlsx")}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded flex items-center gap-2 text-white"
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
          className={`p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end shadow ${
            darkMode ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col">
            <label className="text-sm mb-1">Cari Nama / Instansi / Tujuan</label>
            <input
              type="text"
              placeholder="Ketik kata kunci..."
              value={filter.keyword}
              onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
              className={`p-2 rounded w-56 ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1">Tanggal Awal</label>
            <input
              type="date"
              value={filter.start}
              onChange={(e) => setFilter({ ...filter, start: e.target.value })}
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
              onChange={(e) => setFilter({ ...filter, end: e.target.value })}
              className={`p-2 rounded ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100"
              }`}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex items-center gap-2 text-white"
          >
            <FaSearch /> Filter
          </button>
        </motion.form>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-xl shadow overflow-x-auto ${
            darkMode ? "bg-slate-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <table className="min-w-full text-sm">
            <thead>
              <tr
                className={`font-semibold ${
                  darkMode ? "bg-slate-700" : "bg-gray-200"
                }`}
              >
                <th className="p-2">Nama</th>
                <th className="p-2">No. Telepon</th>
                <th className="p-2">Instansi</th>
                <th className="p-2">Email</th>
                <th className="p-2">Alamat</th>
                <th className="p-2">Tujuan</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2 text-center">Aksi</th>
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
                    <td className="p-2">{t.nama}</td>
                    <td className="p-2">{t.no_telp}</td>
                    <td className="p-2">{t.instansi || "-"}</td>
                    <td className="p-2">{t.email || "-"}</td>
                    <td className="p-2">{t.alamat || "-"}</td>
                    <td className="p-2">{t.tujuan_kunjungan || "-"}</td>
                    <td className="p-2">
                      {new Date(t.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-500 hover:text-red-400 text-lg"
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
