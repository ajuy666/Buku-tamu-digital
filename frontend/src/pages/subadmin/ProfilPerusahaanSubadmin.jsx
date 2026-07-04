import { useState, useEffect, useMemo } from "react";
import axios from "../../utils/axiosConfig";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function ProfilPerusahaanSubadmin() {
  const { darkMode } = useTheme();

  const [logo, setLogo] = useState("");
  const [teks, setTeks] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [subjudul, setSubjudul] = useState("");
  const [judulUtama, setJudulUtama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [copyright, setCopyright] = useState("");

  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000";

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const axiosAuth = useMemo(() => {
    const a = axios.create({ baseURL: API_URL });
    a.interceptors.request.use((cfg) => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return a;
  }, [API_URL, token]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 2500);
  };

  // ============================
  // GET DATA PROFIL PERUSAHAAN
  // ============================
  useEffect(() => {
    (async () => {
      try {
        // FIX: endpoint diganti sesuai backend
        const res = await axiosAuth.get("/api/subadmin/pengaturan-tampilan");

        const d = res?.data || {};

        setLogo(d.logo_url || "");
        setPreview(d.logo_url || "");
        setTeks(d.teks_samping_logo || "");
        setSubjudul(d.subjudul || "");
        setJudulUtama(d.judul_utama || "");
        setDeskripsi(d.deskripsi || "");
        setCopyright(d.copyright_text || "");
      } catch (err) {
        showAlert("error", "Gagal memuat profil perusahaan.");
      } finally {
        setLoading(false);
      }
    })();
  }, [axiosAuth]);

  const handleFileChange = (e) => {
    const f = e?.target?.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      showAlert("error", "File harus berupa gambar.");
      return;
    }

    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);

    setFile(f);
    setPreview(URL.createObjectURL(f));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setFileBase64(base64);
    };
    reader.readAsDataURL(f);
  };

  // ============================
  // SIMPAN PERUBAHAN
  // ============================
  const handleSimpan = async () => {
    try {
      setSaving(true);

      let uploadedUrl = logo || "";

      if (file && fileBase64) {
        const up = await axiosAuth.post("/api/subadmin/upload-logo", {
          file: fileBase64,
          filename: file.name,
        });
        uploadedUrl = up?.data?.url || uploadedUrl;
      }

      // FIX: endpoint diganti sesuai backend
      await axiosAuth.put("/api/subadmin/pengaturan-tampilan", {
        logo_url: uploadedUrl,
        teks_samping_logo: teks,
        subjudul,
        judul_utama: judulUtama,
        deskripsi,
        copyright_text: copyright,
      });

      showAlert("success", "Profil Perusahaan berhasil disimpan!");
    } catch (err) {
      showAlert("error", "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-gray-200">
        Memuat...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`flex-1 min-h-screen p-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`shadow-md rounded-lg p-4 mb-6 border ${
          darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          🏢 Profil Perusahaan
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`shadow-md rounded-lg p-4 border ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Logo perusahaan"
                className="w-24 h-24 object-cover rounded-md border shadow-sm"
              />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Unggah Logo Baru
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 rounded-md text-sm border cursor-pointer ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-gray-100"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <FieldInput label="URL Logo" value={logo} onChange={setLogo} darkMode={darkMode} />
            <FieldInput label="Nama Perusahaan" value={teks} onChange={setTeks} darkMode={darkMode} />
            <FieldInput label="Subjudul" value={subjudul} onChange={setSubjudul} darkMode={darkMode} />
            <FieldInput label="Judul Utama" value={judulUtama} onChange={setJudulUtama} darkMode={darkMode} />
            <FieldTextarea label="Deskripsi" value={deskripsi} onChange={setDeskripsi} darkMode={darkMode} />
            <FieldInput label="Copyright" value={copyright} onChange={setCopyright} darkMode={darkMode} />

            <button
              onClick={handleSimpan}
              disabled={saving}
              className={`w-full py-2 rounded-md text-white font-semibold mt-2 ${
                saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </div>

        <div
          className={`shadow-md rounded-lg p-4 border max-w-[550px] mx-auto ${
            darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className="text-center text-white font-bold text-lg bg-blue-600 py-2 rounded-md shadow mb-4">
            Preview Profil
          </h3>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-[500px] h-[260px] rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-yellow-400" />

              <div className="absolute left-0 top-0 w-[55%] h-full flex flex-col justify-center px-4 text-white">
                {subjudul && (
                  <span className="bg-white/20 px-2 py-1 rounded-full text-[10px] font-semibold mb-2 w-fit">
                    {subjudul}
                  </span>
                )}

                <h2 className="text-lg font-bold leading-tight mb-1">
                  {judulUtama || "Judul Perusahaan"}
                </h2>

                <p className="text-[11px] text-white/90 line-clamp-3">
                  {deskripsi || "Deskripsi singkat perusahaan."}
                </p>

                <p className="text-[10px] mt-3 opacity-80">
                  {copyright || "© 2025 Perusahaan Anda"}
                </p>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1">
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo"
                    className="w-7 h-7 rounded-full border-2 border-white shadow-sm object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-[10px] text-white">
                    Logo
                  </div>
                )}
                <span className="text-[11px] font-semibold text-white">
                  {teks || "Nama Perusahaan"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 35 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FieldInput({ label, value, onChange, darkMode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-md text-sm border ${
          darkMode
            ? "bg-slate-700 border-slate-600 text-gray-100"
            : "bg-gray-50 border-gray-300 text-gray-900"
        }`}
      />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, darkMode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-md text-sm border h-24 resize-none ${
          darkMode
            ? "bg-slate-700 border-slate-600 text-gray-100"
            : "bg-gray-50 border-gray-300 text-gray-900"
        }`}
      />
    </div>
  );
}
