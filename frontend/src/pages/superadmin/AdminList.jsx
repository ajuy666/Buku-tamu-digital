import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function AdminList({ isSidebarOpen }) {
  const { darkMode } = useTheme();

  const [adminList, setAdminList] = useState([]);
  const [perusahaanList, setPerusahaanList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    email_admin: "",
    username: "",
    password: "",
    tenant_id: "",
    aktif: true,
  });

  // =====================================================================
  // ALERT 2 DETIK
  // =====================================================================
  const showAlert = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2000);
  };

  // =====================================================================
  // VALIDASI USERNAME
  // =====================================================================
  const validateUsername = (value) => {
    if (!value) return;

    if (!/^[A-Z]/.test(value)) {
      showAlert("error", "Username harus diawali huruf besar!");
      return false;
    }
    if (value.length < 5) {
      showAlert("error", "Username minimal 5 karakter!");
      return false;
    }
    if (!/\d/.test(value)) {
      showAlert("error", "Username harus mengandung angka!");
      return false;
    }
    return true;
  };

  // =====================================================================
  // VALIDASI PASSWORD
  // =====================================================================
  const validatePassword = (value) => {
    if (!value) return;

    if (!/^[A-Z]/.test(value)) {
      showAlert("error", "Password harus diawali huruf besar!");
      return false;
    }
    if (value.length < 5) {
      showAlert("error", "Password minimal 5 karakter!");
      return false;
    }
    if (!/\d/.test(value)) {
      showAlert("error", "Password harus mengandung angka!");
      return false;
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
      showAlert("error", "Password harus mengandung simbol!");
      return false;
    }
    return true;
  };

  // =====================================================================
  // FETCH DATA
  // =====================================================================
  const fetchData = async () => {
    try {
      const [admins, perusahaan] = await Promise.all([
        axios.get("http://localhost:5000/superadmin/admin"),
        axios.get("http://localhost:5000/superadmin/perusahaan"),
      ]);

      setAdminList(admins.data);
      setPerusahaanList(perusahaan.data);
    } catch (err) {
      showAlert("error", "Gagal memuat data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================================
  // CEK PERUSAHAAN SUDAH PUNYA ADMIN
  // =====================================================================
  const perusahaanSudahPunyaAdmin = (tenantId) => {
    return adminList.some((a) => a.tenant_id === tenantId);
  };

  // =====================================================================
  // SUBMIT FORM
  // =====================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateUsername(form.username)) {
      setLoading(false);
      return;
    }

    if (!editId && !validatePassword(form.password)) {
      setLoading(false);
      return;
    }

    try {
      // CEK USERNAME SAMA
      const usernameExists = adminList.some(
        (a) =>
          a.username.toLowerCase() === form.username.toLowerCase() &&
          a.id !== editId
      );

      if (usernameExists) {
        showAlert("error", "❗ Username sudah digunakan!");
        setLoading(false);
        return;
      }

      // CEK JIKA PERUSAHAAN SUDAH PUNYA ADMIN
      if (!editId && perusahaanSudahPunyaAdmin(form.tenant_id)) {
        showAlert("error", "Perusahaan ini sudah memiliki admin!");
        setLoading(false);
        return;
      }

      if (editId) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/superadmin/admin/${editId}`,
          form
        );
        showAlert("success", "Admin berhasil diperbarui.");
      } else {
        // INSERT
        await axios.post("http://localhost:5000/superadmin/admin", form);
        showAlert("success", "Admin berhasil ditambahkan.");
      }

      setEditId(null);
      setForm({
        email_admin: "",
        username: "",
        password: "",
        tenant_id: "",
        aktif: true,
      });

      fetchData();
    } catch (err) {
      showAlert("error", err.response?.data?.error || "Gagal menyimpan admin.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================================
  // EDIT
  // =====================================================================
  const handleEdit = (a) => {
    setEditId(a.id);
    setForm({
      email_admin: a.email_admin || "",
      username: a.username,
      password: "",
      tenant_id: a.tenant_id,
      aktif: a.aktif,
    });
  };

  // =====================================================================
  // DELETE
  // =====================================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus admin ini?")) return;

    try {
      await axios.delete(`http://localhost:5000/superadmin/admin/${id}`);
      showAlert("success", "Admin berhasil dihapus.");
      fetchData();
    } catch {
      showAlert("error", "Gagal menghapus admin.");
    }
  };

  // =====================================================================
  // TOGGLE STATUS ADMIN
  // =====================================================================
  const handleToggleAktif = async (id, aktif) => {
    try {
      await axios.put(
        `http://localhost:5000/superadmin/admin/${id}/status`,
        { aktif: !aktif }
      );
      showAlert("success", "Status berhasil diubah.");
      fetchData();
    } catch {
      showAlert("error", "Gagal mengubah status admin.");
    }
  };

  // =====================================================================
  // ANIMASI
  // =====================================================================
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
      className={`flex-1 min-h-screen p-8 transition-all duration-300
      ${isSidebarOpen ? "ml-64" : "ml-0"}
      ${darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-800"}`}
    >
      {/* HEADER */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.1 }}
        className={`mb-8 p-5 rounded-xl shadow-lg border
        ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"}`}
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          👤 Daftar Admin Perusahaan
        </h1>
      </motion.div>

      {/* ALERT */}
      {message && (
        <div
          className={`p-3 rounded-lg mb-6 text-center font-semibold ${
            message.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl shadow mb-8 border
          ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"}`}
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "✏️ Edit Admin" : "➕ Tambah Admin"}
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Admin"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            required
            value={form.email_admin}
            onChange={(e) => setForm({ ...form, email_admin: e.target.value })}
          />

          {/* USERNAME */}
          <input
            type="text"
            placeholder="Username"
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            required
            value={form.username}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, username: value });
              validateUsername(value);
            }}
          />

          {/* PASSWORD */}
          {!editId && (
            <input
              type="password"
              placeholder="Password"
              className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
              required
              value={form.password}
              onChange={(e) => {
                const value = e.target.value;
                setForm({ ...form, password: value });
                validatePassword(value);
              }}
            />
          )}

          {/* PERUSAHAAN */}
          <select
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            required
            value={form.tenant_id}
            onChange={(e) => {
              const val = e.target.value;

              if (perusahaanSudahPunyaAdmin(val) && !editId) {
                showAlert("error", "Perusahaan ini sudah memiliki admin!");
                return;
              }

              setForm({ ...form, tenant_id: val });
            }}
          >
            <option value="">Pilih Perusahaan</option>
            {perusahaanList.map((p) => {
              const sudahAda = perusahaanSudahPunyaAdmin(p.id);
              return (
                <option key={p.id} value={p.id} disabled={sudahAda && !editId}>
                  {p.nama_perusahaan} {sudahAda ? "(SUDAH ADA ADMIN)" : ""}
                </option>
              );
            })}
          </select>

          {/* STATUS */}
          <select
            className={`p-2 rounded ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
            value={form.aktif ? "true" : "false"}
            onChange={(e) =>
              setForm({ ...form, aktif: e.target.value === "true" })
            }
          >
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-2 mt-3"
          >
            {loading
              ? "Menyimpan..."
              : editId
              ? "Simpan Perubahan"
              : "Tambah Admin"}
          </button>
        </form>
      </motion.div>

      {/* TABLE */}
      <motion.div
        variants={pageAnim}
        transition={{ delay: 0.25 }}
        className={`p-6 rounded-xl shadow overflow-x-auto border
          ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-300"}`}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className={`${darkMode ? "bg-slate-700" : "bg-gray-200"}`}>
              <th className="p-3">Email</th>
              <th className="p-3">Username</th>
              <th className="p-3">Perusahaan</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Login Terakhir</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {adminList.map((a) => (
              <tr
                key={a.id}
                className={`border-b ${
                  darkMode
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <td className="p-3">{a.email_admin || "-"}</td>
                <td className="p-3">{a.username}</td>
                <td className="p-3">{a.nama_perusahaan || "-"}</td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleToggleAktif(a.id, a.aktif)}
                    className={`px-3 py-1 rounded text-xs text-white ${
                      a.aktif ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {a.aktif ? "Aktif" : "Nonaktif"}
                  </button>
                </td>

                <td className="p-3 text-center">
                  {a.last_login
                    ? new Date(a.last_login).toLocaleDateString("id-ID")
                    : "-"}
                </td>

                <td className="p-3 text-center flex gap-3 justify-center">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {adminList.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  Tidak ada data admin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
