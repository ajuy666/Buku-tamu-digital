import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LogAktivitas() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ search: "", start: "", end: "" });

  const getLogs = async () => {
    try {
      const params = new URLSearchParams(filter);
      const res = await axios.get(`http://localhost:5000/logs?${params.toString()}`);
      setLogs(res.data);
    } catch (err) {
      console.error("❌ Gagal ambil log aktivitas:", err);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    getLogs();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🕓 Log Aktivitas</h1>

      <form onSubmit={handleSearch} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Cari nama admin / tenant / aksi"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filter.start}
            onChange={(e) => setFilter({ ...filter, start: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filter.end}
            onChange={(e) => setFilter({ ...filter, end: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            🔍 Cari
          </button>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-3 text-left">Waktu</th>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3 text-left">Perusahaan</th>
              <th className="p-3 text-left">Aksi</th>
              <th className="p-3 text-left">Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {new Date(log.created_at).toLocaleString("id-ID")}
                </td>
                <td className="p-3">{log.admin_username || "-"}</td>
                <td className="p-3">{log.nama_perusahaan || "-"}</td>
                <td className="p-3">{log.aksi}</td>
                <td className="p-3">{log.deskripsi}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Belum ada log aktivitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
