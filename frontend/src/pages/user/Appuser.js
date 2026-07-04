import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Data tamu
  const [nama, setNama] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [instansi, setInstansi] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [keperluan, setKeperluan] = useState("");

  // Checkbox kebijakan privasi
  const [agreePrivacy, setAgreePrivacy] = useState(false); // PRIVACY POLICY

  // Pengaturan tampilan tenant
  const [pengaturan, setPengaturan] = useState({
    logo_url: "",
    teks_samping_logo: "",
    subjudul: "",
    judul_utama: "",
    deskripsi: "",
    copyright_text: "",
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Ambil domain aktif
  const domain = window.location.hostname.replace(/^www\./, "");

  // Ambil pengaturan tenant
  useEffect(() => {
    const getPengaturan = async () => {
      try {
        const res = await fetch(`http://localhost:5000/pengaturan-tampilan/${domain}`);
        if (!res.ok) throw new Error("Domain tidak ditemukan");
        const data = await res.json();
        setPengaturan(data);
      } catch (err) {
        console.error("❌ Gagal ambil pengaturan:", err.message);
      }
    };
    getPengaturan();
  }, [domain]);

  // ALERT
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 2000);
  };

  // ============================
  // SUBMIT DATA TAMU
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cek apakah privacy policy dicentang
    if (!agreePrivacy) {
      return showAlert("error", "Anda harus menyetujui Kebijakan Privasi ❗");
    }

    const data = {
      nama,
      no_telp: noTelp,
      instansi,
      email,
      alamat,
      tujuan_kunjungan: tujuan,
      keperluan,
      agree_privacy: true, // kirim ke backend (opsional)
    };

    try {
      const res = await fetch(`http://localhost:5000/tamu/${domain}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showAlert("success", "Data tamu berhasil dikirim 🎉");
        setNama("");
        setNoTelp("");
        setInstansi("");
        setEmail("");
        setAlamat("");
        setTujuan("");
        setKeperluan("");
        setAgreePrivacy(false); // reset checkbox
      } else {
        showAlert("error", "Gagal mengirim data tamu 😢");
      }
    } catch {
      showAlert("error", "Terjadi kesalahan jaringan ⚠️");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 relative">

      {/* ALERT */}
      {alert.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className={`rounded-xl shadow-2xl p-6 text-center w-[340px] ${
              alert.type === "success"
                ? "bg-white border-t-4 border-green-500"
                : "bg-white border-t-4 border-red-500"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              alert.type === "success" ? "text-green-600" : "text-red-600"
            }`}>
              {alert.type === "success" ? "Berhasil!" : "Gagal!"}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{alert.message}</p>

            <button
              onClick={() => setAlert({ show: false, type: "", message: "" })}
              className={`px-5 py-2 rounded-md text-sm font-medium text-white transition ${
                alert.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}>
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* PANEL KIRI */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-blue-700 via-blue-500 to-yellow-300 text-white flex flex-col justify-center px-10 md:px-16 py-10 relative overflow-hidden">
        
        {pengaturan.logo_url && (
          <div className="absolute top-8 right-8 flex items-center gap-3">
            <img src={pengaturan.logo_url} alt="Logo"
              className="w-20 h-20 object-cover rounded-full bg-white p-1 shadow-lg" />
            <h2 className="text-lg font-semibold text-white drop-shadow-md max-w-[150px]">
              {pengaturan.teks_samping_logo || "Buku Tamu Digital"}
            </h2>
          </div>
        )}

        <div className="max-w-md space-y-4">
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {pengaturan.subjudul || "Selamat Datang!"}
          </span>

          <h1 className="text-5xl font-bold mt-4 leading-tight">
            {pengaturan.judul_utama || "Buku Tamu Digital Modern"}
          </h1>

          <p className="mt-5 text-blue-50 text-lg leading-relaxed">
            {pengaturan.deskripsi ||
              "Silakan isi data diri Anda untuk dokumentasi kunjungan yang lebih baik."}
          </p>
        </div>

        <p className="absolute bottom-6 left-10 text-sm text-blue-100">
          {pengaturan.copyright_text ||
            `© ${new Date().getFullYear()} — Buku Tamu Digital`}
        </p>
      </div>

      {/* PANEL KANAN */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-white shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-semibold text-blue-700 mb-8">
          Registrasi Kunjungan Tamu
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">

          {/* NAMA */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Nama Lengkap *</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-blue-500"
              value={nama}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") return setNama("");
                const regex = /^[A-Za-zÀ-ÿ\s]+$/;
                if (!regex.test(val)) {
                  showAlert("error", "Nama hanya boleh huruf ❗");
                  return;
                }
                setNama(val);
              }}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          {/* INSTANSI & EMAIL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Asal Instansi *</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={instansi}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") return setInstansi("");
                  const regex = /^[A-Za-z0-9À-ÿ\s.,()-]+$/;
                  if (!regex.test(val)) {
                    showAlert("error", "Instansi tidak valid ❗");
                    return;
                  }
                  setInstansi(val);
                }}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Email *</label>
              <input
                type="email"
                className="w-full border rounded-lg p-2"
                value={email}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes(" ")) {
                    showAlert("error", "Email tidak boleh mengandung spasi ❗");
                    return;
                  }
                  if (val.includes("@") && val.includes(".")) {
                    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!regex.test(val)) {
                      showAlert("error", "Format email tidak valid ❗");
                    }
                  }
                  setEmail(val);
                }}
                required
              />
            </div>
          </div>

          {/* NO TELP & ALAMAT */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block font-medium mb-1 text-gray-700">Nomor Telepon *</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={noTelp}
                onChange={(e) => {
                  let val = e.target.value;
                  if (!/^[0-9+]*$/.test(val)) {
                    showAlert("error", "Nomor telepon hanya boleh angka ❗");
                    return;
                  }
                  if (val.startsWith("08")) {
                    val = "+62" + val.slice(1);
                  }
                  setNoTelp(val);
                }}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Alamat *</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={alamat}
                onChange={(e) => {
                  const val = e.target.value;
                  const regex = /^[A-Za-z0-9À-ÿ\s.,()/-]+$/;
                  if (!regex.test(val)) {
                    showAlert("error", "Alamat tidak valid ❗");
                    return;
                  }
                  setAlamat(val);
                }}
                required
              />
            </div>
          </div>

          {/* TUJUAN */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Tujuan Kunjungan *</label>
            <textarea
              className="w-full border rounded-lg p-2"
              value={tujuan}
              onChange={(e) => {
                const val = e.target.value;
                const regex = /^[A-Za-z0-9À-ÿ\s.,()/-]+$/;
                if (!regex.test(val)) {
                  showAlert("error", "Tujuan tidak valid ❗");
                  return;
                }
                setTujuan(val);
              }}
              required
            />
          </div>

          {/* KEPERLUAN */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Keperluan *</label>
            <select
              className="w-full border rounded-lg p-2"
              value={keperluan}
              onChange={(e) => setKeperluan(e.target.value)}
              required
            >
              <option value="">-- Pilih Keperluan --</option>
              <option value="Meeting">Meeting</option>
              <option value="Magang">Magang</option>
              <option value="Layanan Publik">Layanan Publik</option>
              <option value="Interview">Interview</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* ========================================= */}
          {/*           PRIVACY POLICY SECTION           */}
          {/* ========================================= */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              required
            />
            <p className="text-sm text-gray-700 leading-snug">
              Saya telah membaca dan menyetujui
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-blue-600 underline ml-1"
              >
                Kebijakan Privasi
              </a>.
            </p>
          </div>

          {/* Deskripsi singkat */}
          <p className="text-xs text-gray-500">
            Data Anda digunakan untuk pencatatan kunjungan, keamanan, dan kebutuhan operasional perusahaan.
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
