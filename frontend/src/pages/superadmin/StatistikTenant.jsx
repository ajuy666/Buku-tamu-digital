import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function StatistikTenant() {
  const { tenantId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/superadmin/statistik/${tenantId}`);
        setData(res.data);
      } catch (err) {
        console.error("❌ Gagal ambil data tenant:", err);
      }
    };
    fetchTenantData();
  }, [tenantId]);

  if (!data) return <p className="p-6 text-gray-600">Loading...</p>;

  const warnaPie = ["#4CAF50", "#F44336"];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          📈 Statistik Perusahaan: {data.nama_perusahaan}
        </h1>
        <Link
          to="/superadmin/statistik"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ⬅️ Kembali
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Total Admin</h2>
          <p className="text-3xl font-bold text-blue-600">{data.total_admin}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Total Tamu</h2>
          <p className="text-3xl font-bold text-green-600">{data.total_tamu}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-600 text-lg">Rata-rata Tamu per Hari</h2>
          <p className="text-3xl font-bold text-purple-600">
            {data.rata_harian}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 📆 Grafik tamu bulanan */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">📅 Kunjungan Tamu per Bulan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.tamu_bulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jumlah" fill="#3B82F6" name="Jumlah Tamu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 👤 Pie chart admin aktif vs nonaktif */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">👤 Status Admin Tenant</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Aktif", value: data.admin_aktif },
                  { name: "Nonaktif", value: data.admin_nonaktif },
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
                  { name: "Aktif", value: data.admin_aktif },
                  { name: "Nonaktif", value: data.admin_nonaktif },
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
