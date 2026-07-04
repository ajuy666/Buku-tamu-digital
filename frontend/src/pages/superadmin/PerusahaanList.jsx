import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function PerusahaanList({ isSidebarOpen }) {
  const { darkMode } = useTheme();

  const [perusahaan, setPerusahaan] = useState([]);
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    domain: "",
    logo_url: "",
    alamat: "",
    kontak_admin: "",
    masa_berlaku: "",
    status_sewa: "aktif",
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPerusahaan = async () => {
    try {
      const res = await axios.get("http://localhost:5000/superadmin/perusahaan");
      setPerusahaan(res.data);
    } catch (err) {
      console.error("❌ Gagal fetch perusahaan:", err);
    }
  };

  useEffect(() => {
    fetchPerusahaan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/superadmin/perusahaan/${editId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/superadmin/perusahaan", formData);
      }

      setFormData({
        nama_perusahaan: "",
        domain: "",
        logo_url: "",
        alamat: "",
        kontak_admin: "",
        masa_berlaku: "",
        status_sewa: "aktif",
      });

      setEditId(null);
      fetchPerusahaan();
    } catch (err) {
      console.error("❌ Gagal menyimpan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      nama_perusahaan: item.nama_perusahaan,
      domain: item.domain,
      logo_url: item.logo_url,
      alamat: item.alamat,
      kontak_admin: item.kontak_admin,
      masa_berlaku: item.masa_berlaku?.split("T")[0] || "",
      status_sewa: item.status_sewa,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus data ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/superadmin/perusahaan/${id}`);
      fetchPerusahaan();
    } catch (err) {
      console.error("❌ Gagal hapus:", err);
    }
  };

  // 🌟 ANIMASI MASUK
  const pageAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={pageAnim}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
      className={`
        flex-1 min-h-screen p-8 transition-all duration-300
        ${isSidebarOpen ? "ml-64" : "ml-0"}
        ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-800"}
      `}
    >
      {/* HEADER */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.1, duration: 0.45 }}
        className={`
          mb-8 p-5 rounded-xl shadow-lg border
          ${darkMode ? "bg-slate-800 border-slate-700 shadow-black/30" : "bg-white border-gray-300 shadow-gray-300/60"}
        `}
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span>🏢</span> Daftar Perusahaan
        </h1>
        <p className={`${darkMode ? "text-slate-400" : "text-gray-500"} mt-1`}>
          Kelola perusahaan yang terdaftar di sistem
        </p>
      </motion.div>

      {/* FORM SECTION */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.15, duration: 0.45 }}
        className={`
          p-6 rounded-xl shadow mb-8 border
          ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}
        `}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "✏️ Edit Perusahaan" : "➕ Tambah Perusahaan"}
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Perusahaan"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.nama_perusahaan}
            required
            onChange={(e) =>
              setFormData({ ...formData, nama_perusahaan: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Domain"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
          />

          <input
            type="text"
            placeholder="Logo URL"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          />

          <input
            type="text"
            placeholder="Kontak Admin"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.kontak_admin}
            onChange={(e) => setFormData({ ...formData, kontak_admin: e.target.value })}
          />

          <input
            type="date"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.masa_berlaku}
            onChange={(e) => setFormData({ ...formData, masa_berlaku: e.target.value })}
          />

          <select
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.status_sewa}
            onChange={(e) => setFormData({ ...formData, status_sewa: e.target.value })}
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
            <option value="expired">Expired</option>
          </select>

          <textarea
            placeholder="Alamat"
            className={`p-2 rounded md:col-span-2 ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={formData.alamat}
            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-2"
          >
            {loading ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Perusahaan"}
          </button>
        </form>
      </motion.div>

      {/* TABLE */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.2, duration: 0.45 }}
        className={`
          p-6 rounded-xl shadow overflow-x-auto border
          ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}
        `}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className={`${darkMode ? "bg-slate-700" : "bg-gray-200"} text-left`}>
              <th className="p-3">Nama</th>
              <th className="p-3">Domain</th>
              <th className="p-3">Kontak Admin</th>
              <th className="p-3">Masa Berlaku</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {perusahaan.map((item) => (
              <tr
                key={item.id}
                className={`border-b ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-gray-300 hover:bg-gray-100"
                } transition`}
              >
                <td className="p-3">{item.nama_perusahaan}</td>
                <td className="p-3">{item.domain || "-"}</td>
                <td className="p-3">{item.kontak_admin || "-"}</td>
                <td className="p-3">{item.masa_berlaku?.split("T")[0] || "-"}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs text-white ${
                      item.status_sewa === "aktif"
                        ? "bg-green-600"
                        : item.status_sewa === "nonaktif"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  >
                    {item.status_sewa}
                  </span>
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {perusahaan.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-400">
                  Tidak ada data perusahaan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
