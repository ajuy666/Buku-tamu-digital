import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function StatistikGlobal() {
  const [statistik, setStatistik] = useState({
    total_perusahaan: 0,
    total_admin: 0,
    total_tamu: 0,
    admin_aktif: 0,
    admin_nonaktif: 0,
    tamu_bulanan: [],
  });

  const warnaPie = ["#4CAF50", "#F44336"]; // Hijau = aktif, merah = nonaktif

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/superadmin/statistik-global");
        setStatistik(res.data);
      } catch (err) {
        console.error("❌ Gagal ambil statistik global:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📈 Statistik Global</h1>

      {/* 📊 Ringkasan Total */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Total Perusahaan</h2>
          <p className="text-3xl font-bold text-blue-600">{statistik.total_perusahaan}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Total Admin</h2>
          <p className="text-3xl font-bold text-green-600">{statistik.total_admin}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Total Tamu</h2>
          <p className="text-3xl font-bold text-purple-600">{statistik.total_tamu}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 📈 Grafik Jumlah Tamu Bulanan */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">📆 Kunjungan Tamu per Bulan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistik.tamu_bulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#3B82F6" name="Jumlah Tamu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 Grafik Admin Aktif vs Nonaktif */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">👤 Status Admin</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Aktif", value: statistik.admin_aktif },
                  { name: "Nonaktif", value: statistik.admin_nonaktif },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: "Aktif", value: statistik.admin_aktif },
                  { name: "Nonaktif", value: statistik.admin_nonaktif },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={warnaPie[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
