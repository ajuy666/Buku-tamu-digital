import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";

import { FaPlus, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function SubAdminList() {
  const { tenant_id } = useParams();
  const { darkMode } = useTheme();

  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
  });

  const token = localStorage.getItem("token");

  // FETCH SUBADMIN LIST
  const fetchSubadmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/subadmin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubadmins(res.data);
    } catch (err) {
      console.error("Gagal load subadmin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD SUBADMIN
  const handleAdd = async () => {
    if (!form.username || !form.password || !form.nama_lengkap) {
      alert("Semua field harus diisi");
      return;
    }

    try {
      await axios.post("http://localhost:5000/admin/subadmin", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAddModal(false);
      setForm({ username: "", password: "", nama_lengkap: "" });
      fetchSubadmins();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal membuat subadmin");
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/admin/subadmin/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchSubadmins();
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  const deleteSubadmin = async (id) => {
    if (!window.confirm("Yakin hapus subadmin ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/subadmin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchSubadmins();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex-1 p-6 min-h-screen transition-all ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div
        className={`shadow-md rounded-xl p-4 mb-6 border transition ${
          darkMode
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          👥 Kelola Sub Admin
        </h1>
      </div>

      {/* TABLE WRAPPER */}
      <div
        className={`shadow-md rounded-xl overflow-hidden border transition ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <FaPlus /> Tambah Subadmin
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr
              className={`font-semibold ${
                darkMode ? "bg-slate-700 text-white" : "bg-blue-900 text-white"
              }`}
            >
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Nama Lengkap</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : subadmins.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 dark:text-gray-300"
                >
                  Belum ada subadmin.
                </td>
              </tr>
            ) : (
              subadmins.map((s) => (
                <tr
                  key={s.id}
                  className={`transition ${
                    darkMode
                      ? "border-b border-slate-700 hover:bg-slate-700"
                      : "border-b hover:bg-gray-100"
                  }`}
                >
                  <td className="px-4 py-3">{s.username}</td>
                  <td className="px-4 py-3">{s.nama_lengkap}</td>

                  <td className="px-4 py-3">
                    {s.status === "active" ? (
                      <span className="text-green-400 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 flex gap-4">
                    {s.status === "active" ? (
                      <button
                        onClick={() => toggleStatus(s.id, "inactive")}
                        className="text-yellow-500 hover:text-yellow-400"
                      >
                        <FaToggleOn size={26} />
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(s.id, "active")}
                        className="text-gray-400 hover:text-green-500"
                      >
                        <FaToggleOff size={26} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteSubadmin(s.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH SUBADMIN */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-96 p-6 rounded-xl shadow-xl border transition ${
                darkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <h2 className="text-xl font-bold mb-4">Tambah Sub Admin</h2>

              <div className="space-y-3">
                <InputField
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleInput}
                  darkMode={darkMode}
                />

                <InputField
                  name="nama_lengkap"
                  placeholder="Nama Lengkap"
                  value={form.nama_lengkap}
                  onChange={handleInput}
                  darkMode={darkMode}
                />

                <InputField
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInput}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
                >
                  Batal
                </button>

                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InputField({ name, type = "text", placeholder, value, onChange, darkMode }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded-md border transition ${
        darkMode
          ? "bg-slate-700 border-slate-600 text-white placeholder-slate-300"
          : "bg-gray-100 border-gray-300"
      }`}
    />
  );
}
