import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

// =============================================================
// 🔐 INTERCEPTOR — Inject Token & Tenant ID SECARA OTOMATIS
// =============================================================
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const tenantId = localStorage.getItem("tenant_id");

    // ==============================
    // ❗ ROUTE YANG HARUS DIABAIKAN
    // ==============================
    const ignoreRoutes = [
      "/auth/admin/request-reset-password",
      "/auth/admin/validate-reset-token",
      "/auth/admin/reset-password",
    ];

    // jika URL mengandung salah satu route ignore → skip Authorization
    const shouldSkip = ignoreRoutes.some((url) => config.url.includes(url));

    // ==============================
    // 🔐 Jika TIDAK SKIP → kirim token
    // ==============================
    if (!shouldSkip) {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      if (tenantId) config.headers["X-Tenant-ID"] = tenantId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================================================
// 🔥 INTERCEPTOR ERROR — AUTO LOGOUT UNTUK SUBADMIN & ADMIN
// =============================================================
instance.interceptors.response.use(
  (response) => response,

  (error) => {
    const data = error?.response?.data;

    if (!data) return Promise.reject(error);

    // ======================================
    // 🚨 SUBADMIN NONAKTIF
    // ======================================
    if (data.error === "SUBADMIN_NONAKTIF") {
      localStorage.removeItem("token");
      localStorage.removeItem("tenant_id");
      window.location.href = "/subadmin-nonaktif";
      return;
    }

    // ======================================
    // 🚨 PERUSAHAAN NONAKTIF (Seperti Admin)
    // ======================================
    if (data.error === "PERUSAHAAN_NONAKTIF") {
      localStorage.removeItem("token");
      localStorage.removeItem("tenant_id");
      window.location.href = "/perusahaan-nonaktif";
      return;
    }

    // ======================================
    // 🚨 TOKEN INVALID / EXPIRED
    // ======================================
    if (
      data.error === "TOKEN_INVALID" ||
      data.message === "Token tidak valid" ||
      data.message === "Token tidak ditemukan"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tenant_id");
      window.location.href = "/login";
      return;
    }

    return Promise.reject(error);
  }
);

export default instance;
