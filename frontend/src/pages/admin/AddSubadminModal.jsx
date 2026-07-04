import { useState } from "react";
import axios from "../../utils/axiosConfig";


export default function AddSubadminModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/admin/subadmin",
        {
          username,
          password,
          nama_lengkap: namaLengkap,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Gagal menambahkan subadmin");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[380px] shadow-xl animate-fadeIn">

        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Tambah Subadmin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username */}
          <div>
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="text-sm text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
}
