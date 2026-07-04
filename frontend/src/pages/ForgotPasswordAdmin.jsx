import { useState } from "react";
import axios from "../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function ForgotPasswordAdmin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("/auth/admin/request-reset-password", {
      email,
    });

    setMessage(res.data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full" onSubmit={handleSubmit}>
        
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password Admin
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          Masukkan email yang digunakan admin untuk login. Kami akan mengirimkan link reset password.
        </p>

        <input
          type="email"
          placeholder="Email admin"
          required
          className="w-full border px-3 py-2 rounded-lg mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button 
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
        >
          Kirim Link Reset
        </button>

        {message && (
          <p className="text-gray-700 mt-4 text-center">{message}</p>
        )}

        <Link to="/login" className="block mt-4 text-center text-blue-600 underline">
          Kembali ke Login
        </Link>
      </form>
    </div>
  );
}
