import { useNavigate } from "react-router-dom";

export default function AdminNonaktif() {
  const navigate = useNavigate();

  const logout = () => {
    // Bersihkan semua session admin
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("tenant_id");

    // Redirect ke halaman login universal
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Akun Admin Dinonaktifkan
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Akun Anda telah dinonaktifkan oleh Superadmin.
          <br />
          Anda tidak dapat mengakses sistem sebelum akun diaktifkan kembali.
        </p>

        <button
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
