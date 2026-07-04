import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
    autoClose: true,
  });

  const showPopup = (type, message, autoClose = true) => {
    setPopup({ show: true, type, message, autoClose });

    if (!autoClose) return;

    setTimeout(() => {
      setPopup({
        show: false,
        type: "",
        message: "",
        autoClose: true,
      });
    }, 1500);
  };

  const closePopup = () => {
    setPopup({
      show: false,
      type: "",
      message: "",
      autoClose: true,
    });
  };

  // ================================
  // 🔥 HANDLE LOGIN untuk 3 ROLE
  // ================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/login", { username, password });

      console.log("🔐 LOGIN RESPONSE:", res.data);

      localStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ================================================
      // 🟣 SUPERADMIN
      // ================================================
      if (res.data.role === "superadmin") {
        localStorage.setItem("superadmin_login", true);
        localStorage.setItem("superadmin", JSON.stringify(res.data.user));

        showPopup("success", "Login Superadmin Berhasil!");

        return setTimeout(() => {
          navigate("/superadmin/dashboard");
        }, 1000);
      }

      // ================================================
      // 🔵 ADMIN
      // ================================================
      if (res.data.role === "admin") {
        const admin = res.data.user;

        localStorage.setItem("admin", JSON.stringify(admin));
        localStorage.setItem("tenant_id", admin.tenant_id);

        showPopup("success", "Login Admin Berhasil!");

        return setTimeout(() => {
          navigate(`/tenant/${admin.tenant_id}/admin/dashboard`);
        }, 800);
      }

      // ================================================
      // 🟢 SUBADMIN — FINAL FIX
      // ================================================
      if (res.data.role === "subadmin") {
        const sub = res.data.user;

        // Data wajib disimpan
        localStorage.setItem("subadmin", JSON.stringify(sub));
        localStorage.setItem("tenant_id", sub.tenant_id);
        localStorage.setItem("token", res.data.token);

        // ⭐ Tambahan penting
        localStorage.setItem("status_subadmin", sub.status);
        localStorage.setItem("status_perusahaan", res.data.status_perusahaan);

        // ⭐ STANDARKAN VALUE AGAR TIDAK SALAH COMPARING
        const statusSub = (sub.status || "").toLowerCase();                // active / inactive
        const statusPerusahaan = (res.data.status_perusahaan || "").toLowerCase(); // aktif / nonaktif

        console.log("CEK STATUS:", { statusSub, statusPerusahaan });

        // 💥 Jika subadmin atau perusahaan TIDAK aktif → redirect
        if (statusSub !== "active" || statusPerusahaan !== "aktif") {
          return navigate(`/tenant/${sub.tenant_id}/subadmin/dashboard`);
        }

        // 💚 Status aman → masuk dashboard
        showPopup("success", "Login Subadmin Berhasil!");

        return setTimeout(() => {
          navigate(`/tenant/${sub.tenant_id}/subadmin-nonaktif`);
        }, 800);
      }


      // ROLE GAK DIKENALI
      showPopup("error", "Role tidak dikenali!");

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);

      const msg = err.response?.data?.error || "Login gagal!";
      showPopup("error", msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">

      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

          <div
            className={`
              relative px-12 py-10 rounded-2xl shadow-2xl text-white text-center animate-popup-bounce
              ${
                popup.type === "success"
                  ? "bg-green-500"
                  : popup.type === "error"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
            `}
          >
            <h2 className="text-3xl font-bold mb-2">
              {popup.type === "success"
                ? "Berhasil!"
                : popup.type === "error"
                ? "Gagal!"
                : "Perhatian!"}
            </h2>

            <p className="text-lg whitespace-pre-line">{popup.message}</p>

            {!popup.autoClose && (
              <button
                onClick={closePopup}
                className="mt-5 px-8 py-2 bg-white text-gray-800 rounded-full font-semibold shadow hover:bg-gray-200 transition"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

      {/* CARD LOGIN */}
      <div className="bg-white w-full max-w-5xl max-h-[720px] rounded-2xl shadow-xl overflow-hidden flex">

        <div className="w-1/2 p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log in</h2>
          <p className="text-gray-500 text-sm mb-6">Masuk menggunakan akun Anda</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition"
            >
              LOG IN
            </button>

            <p
              onClick={() => navigate("/forgot-password-admin")}
              className="text-sm text-green-600 mt-3 cursor-pointer hover:underline"
            >
              Lupa password admin?
            </p>
          </form>
        </div>

        <div className="w-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white p-14 flex flex-col justify-center items-center relative">
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <img src="/lskk.jpg" className="h-12 w-12 rounded-full shadow-md" />
            <span className="font-semibold">PT LSKK</span>
          </div>

          <h1 className="text-4xl font-bold mb-3">Selamat Datang!</h1>
          <p className="text-xl opacity-90 mb-4">Buku Tamu Digital</p>
        </div>
      </div>

      <style>
        {`
          @keyframes popupBounce {
            0% { opacity: 0; transform: scale(0.5); }
            60% { opacity: 1; transform: scale(1.18); }
            100% { transform: scale(1); }
          }
          .animate-popup-bounce {
            animation: popupBounce .35s ease-out;
          }
        `}
      </style>
    </div>
  );
}
