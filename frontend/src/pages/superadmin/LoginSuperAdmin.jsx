import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuperAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/superadmin/login", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("superadmin_login", "true");
        navigate("/superadmin/dashboard");
      } else {
        alert("Username atau password salah");
      }
    } catch (err) {
      alert("Gagal login superadmin");
    }
  };

  return (
    <div>
      <h1>Login SuperAdmin</h1>
      <form onSubmit={handleLogin}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
