import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

function Appuser() {
  const params = useParams();
  const domain = params.domain;

  // STATE FIELD
  const [nama, setNama] = useState("");
  const [noTelp, setNoTelp] = useState("+62");
  const [instansi, setInstansi] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [keperluan, setKeperluan] = useState("");

  // PRIVACY POLICY CHECKBOX
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // MODAL PERINGATAN
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // ALERT STATE
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });

    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 2000);
  };

  // PENGATURAN TAMPILAN
  const [pengaturan, setPengaturan] = useState({
    logo_url: "",
    teks_samping_logo: "",
    subjudul: "",
    judul_utama: "",
    deskripsi: "",
    copyright_text: "",
  });

  useEffect(() => {
    const getPengaturan = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/pengaturan-tampilan/${domain}`
        );
        const data = await res.json();
        setPengaturan(data);
      } catch (err) {
        console.error(err);
      }
    };
    getPengaturan();
  }, [domain]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDASI WAJIB
    if (!nama || !instansi || !email || !alamat || !tujuan || !keperluan) {
      showAlert("error", "Semua field wajib diisi ❗");
      return;
    }

    // Validasi nomor telepon
    if (noTelp === "+62" || noTelp.length < 5) {
      showAlert("error", "Nomor telepon belum lengkap ❗");
      return;
    }

    // CEK PRIVACY POLICY
    if (!agreePrivacy) {
      setShowPrivacyModal(true);
      return;
    }

    const data = {
      nama,
      no_telp: noTelp,
      instansi,
      email,
      alamat,
      tujuan_kunjungan: tujuan,
      keperluan,
      agree_privacy: true,
    };

    try {
      const res = await fetch(`http://localhost:5000/tamu/${domain}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showAlert("success", "Data berhasil dikirim 🎉");

        setNama("");
        setNoTelp("+62");
        setInstansi("");
        setEmail("");
        setAlamat("");
        setTujuan("");
        setKeperluan("");
        setAgreePrivacy(false);
      } else {
        showAlert("error", "Gagal mengirim data!");
      }
    } catch {
      showAlert("error", "Kesalahan jaringan!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 relative">

      {/* ALERT TOAST */}
      {alert.show && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm 
          ${
            alert.type === "success"
              ? "bg-green-500 animate-bounce"
              : alert.type === "warning"
              ? "bg-yellow-500 text-black animate-pulse"
              : "bg-red-500 animate-pulse"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* =============================== */}
      {/*        MODAL PERINGATAN         */}
      {/* =============================== */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl p-6 text-center animate-[scaleIn_0.2s_ease-out]">

            <div className="text-yellow-500 text-5xl mb-3">⚠️</div>

            <h2 className="text-xl font-bold mb-1 text-gray-800">Perhatian</h2>

            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              Anda harus menyetujui <strong>Kebijakan Privasi</strong> sebelum mengirim data kunjungan tamu.
            </p>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Saya Mengerti ✔️
            </button>

          </div>
        </div>
      )}

      {/* ================================= */}
      {/* PANEL KIRI */}
      {/* ================================= */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-blue-700 via-blue-500 to-yellow-300 text-white flex flex-col justify-center px-10 md:px-16 py-10 relative">

        {pengaturan.logo_url && (
          <div className="absolute top-8 right-8 flex items-center gap-3">
            <img
              src={pengaturan.logo_url}
              alt="Logo"
              className="w-20 h-20 object-cover rounded-full bg-white p-1 shadow-lg"
            />
            <h2 className="text-lg font-semibold drop-shadow-md max-w-[150px]">
              {pengaturan.teks_samping_logo || "Buku Tamu Digital"}
            </h2>
          </div>
        )}

        <div className="max-w-md space-y-4">
          <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {pengaturan.subjudul || "Selamat Datang!"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
            {pengaturan.judul_utama || "Buku Tamu Digital Modern"}
          </h1>
          <p className="mt-5 text-blue-50 text-lg leading-relaxed">
            {pengaturan.deskripsi ||
              "Isi data diri Anda untuk dokumentasi kunjungan yang lebih baik."}
          </p>
        </div>

        <p className="absolute bottom-6 left-10 text-sm text-blue-100">
          {pengaturan.copyright_text ||
            `© ${new Date().getFullYear()} — Buku Tamu Digital`}
        </p>
      </div>

      {/* ================================= */}
      {/* PANEL KANAN */}
      {/* ================================= */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-white shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-semibold text-blue-700 mb-8">
          Registrasi Kunjungan Tamu
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">

          {/* === FORM FIELD === */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-blue-500"
              value={nama}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") return setNama("");

                if (!/^[A-Za-zÀ-ÿ\s]+$/.test(v)) {
                  showAlert("error", "Nama hanya boleh huruf!");
                  return;
                }
                setNama(v);
              }}
              placeholder="Nama lengkap"
              required
            />
          </div>

          {/* === INSTANSI + EMAIL === */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Asal Instansi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={instansi}
                onChange={(e) => {
                  const v = e.target.value;

                  if (v === "") {
                    setInstansi("");
                    return;
                  }

                  if (!/^[A-Za-z0-9À-ÿ\s.,()-]+$/.test(v)) {
                    showAlert("error", "Karakter tidak valid!");
                    return;
                  }
                  setInstansi(v);
                }}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border rounded-lg p-2"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;

                  if (v.includes(" ")) {
                    showAlert("error", "Email tidak boleh ada spasi!");
                    return;
                  }

                  setEmail(v);
                }}
                required
              />
            </div>
          </div>

          {/* === NO TELP + ALAMAT === */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={noTelp}
                onChange={(e) => {
                  let v = e.target.value;

                  if (!v.startsWith("+62")) {
                    v = "+62" + v.replace(/\D/g, "");
                  }

                  if (!/^[+0-9]+$/.test(v)) return;

                  setNoTelp(v);
                }}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">
                Alamat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={alamat}
                onChange={(e) => {
                  const v = e.target.value;

                  if (!/^[A-Za-z0-9À-ÿ\s.,()/-]+$/.test(v)) {
                    showAlert("error", "Alamat tidak valid!");
                    return;
                  }
                  setAlamat(v);
                }}
                required
              />
            </div>
          </div>

          {/* === TUJUAN === */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Tujuan Kunjungan <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border rounded-lg p-2"
              value={tujuan}
              onChange={(e) => {
                const v = e.target.value;

                if (!/^[A-Za-z0-9À-ÿ\s.,()/-]+$/.test(v)) {
                  showAlert("error", "Tujuan tidak valid!");
                  return;
                }
                setTujuan(v);
              }}
              required
            />
          </div>

          {/* === KEPERLUAN === */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Keperluan <span className="text-red-500">*</span>
            </label>
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
          {/*            PRIVACY POLICY SECTION          */}
          {/* ========================================= */}
          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
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
          <p className="text-xs text-gray-500 -mt-2">
            Data Anda digunakan untuk pencatatan kunjungan, keamanan, dan administrasi perusahaan.
          </p>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
          >
            Kirim
          </button>

        </form>
      </div>
    </div>
  );
}

export default Appuser;
