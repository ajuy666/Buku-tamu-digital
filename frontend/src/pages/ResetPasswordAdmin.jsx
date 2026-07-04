import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPasswordAdmin() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  // VALIDASI TOKEN
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await axios.get(`/auth/admin/validate-reset-token`, {
          params: { token },
        });

        if (res.data.valid) setValid(true);
      } catch (err) {
        setValid(false);
      }
    };
    checkToken();
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/auth/admin/reset-password`, {
        token,
        password,
      });

      setMsg(res.data.message);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg("Gagal mengubah password");
    }
  };

  // TOKEN INVALID
  if (!valid)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-600 font-semibold">
          Token tidak valid atau sudah kadaluarsa.
        </h1>
      </div>
    );

  // FORM RESET PASSWORD
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        onSubmit={handleReset}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Buat Password Baru
        </h2>

        <input
          type="password"
          placeholder="Password baru"
          required
          className="w-full border px-3 py-2 rounded-lg mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
        >
          Reset Password
        </button>

        {msg && <p className="text-gray-700 text-center mt-4">{msg}</p>}
      </form>
    </div>
  );
}
