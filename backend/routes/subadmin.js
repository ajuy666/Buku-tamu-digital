// ====================================================================
// 📘 SUBADMIN ROUTES — FINAL FIXED VERSION (POOL INJECTION)
// ====================================================================
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";


export default function (pool) {
  const router = express.Router();

  // ====================================================================
  // 🔐 MIDDLEWARE: VERIFY SUBADMIN + CEK STATUS SUBADMIN + CEK PERUSAHAAN
  // ====================================================================
  const verifySubadmin = async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      if (!header.startsWith("Bearer "))
        return res.status(401).json({ error: "TOKEN_INVALID", message: "Token tidak ditemukan" });

      const token = header.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecret123"
      );

      req.subadmin_id = decoded.id;
      req.tenant_id = decoded.tenant_id;

      // 1. CEK STATUS SUBADMIN
      const cekSubadmin = await pool.query(
        `SELECT status FROM subadmin WHERE id = $1`,
        [req.subadmin_id]
      );

      if (!cekSubadmin.rows.length)
        return res.status(404).json({ error: "SUBADMIN_NOT_FOUND", message: "Subadmin tidak ditemukan" });

      if (cekSubadmin.rows[0].status !== "active")
        return res.status(403).json({
          error: "SUBADMIN_NONAKTIF",
          message: "Akun subadmin NONAKTIF. Akses ditolak."
        });

      // 2. CEK STATUS PERUSAHAAN
      const perusahaan = await pool.query(
        `SELECT status_sewa FROM perusahaan WHERE id = $1`,
        [req.tenant_id]
      );

      if (!perusahaan.rows.length)
        return res.status(404).json({ error: "PERUSAHAAN_NOT_FOUND", message: "Perusahaan tidak ditemukan" });

      if (perusahaan.rows[0].status_sewa !== "aktif")
        return res.status(403).json({
          error: "PERUSAHAAN_NONAKTIF",
          message: "Perusahaan NONAKTIF. Akses ditolak."
        });

      next();
    } catch (err) {
      console.error("verifySubadmin error:", err);
      return res.status(401).json({ error: "TOKEN_INVALID", message: "Token tidak valid" });
    }
  };

  // ====================================================================
  // 🔐 LOGIN SUBADMIN (DISESUAIKAN UNTUK FRONTEND KAMU)
  // ====================================================================
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const result = await pool.query(
        `SELECT * FROM public.subadmin WHERE username = $1`,
        [username]
      );

      if (!result.rows.length)
        return res.status(401).json({ error: "USERNAME_INVALID", message: "Username tidak ditemukan" });

      const user = result.rows[0];

      if (user.status !== "active")
        return res.status(403).json({
          error: "SUBADMIN_NONAKTIF",
          message: "Akun subadmin NONAKTIF"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "PASSWORD_SALAH", message: "Password salah" });

      const perusahaan = await pool.query(
        `SELECT status_sewa FROM perusahaan WHERE id = $1`,
        [user.tenant_id]
      );

      if (!perusahaan.rows.length)
        return res.status(404).json({ error: "PERUSAHAAN_NOT_FOUND", message: "Perusahaan tidak ditemukan" });

      const status_perusahaan = perusahaan.rows[0].status_sewa;

      if (status_perusahaan !== "aktif")
        return res.status(403).json({
          error: "PERUSAHAAN_NONAKTIF",
          message: "Perusahaan sedang NONAKTIF. Tidak dapat login."
        });

      const token = jwt.sign(
        {
          id: user.id,
          role: "subadmin",
          tenant_id: user.tenant_id,
        },
        process.env.JWT_SECRET || "supersecret123",
        { expiresIn: "7d" }
      );

      return res.json({
        error: null,
        message: "Login berhasil",
        role: "subadmin",
        token,
        status_perusahaan,
        user: {
          id: user.id,
          username: user.username,
          nama: user.nama_lengkap || user.nama,
          tenant_id: user.tenant_id,
          status: user.status
        }
      });
    } catch (err) {
      console.error("Error login subadmin:", err);
      res.status(500).json({ error: "SERVER_ERROR", message: "Server error" });
    }
  });

  // ====================================================================
  // 📌 PROFIL PERUSAHAAN
  // ====================================================================
  router.get("/profil-perusahaan", verifySubadmin, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT nama_perusahaan, alamat, logo_url, deskripsi 
         FROM perusahaan WHERE id = $1`,
        [req.tenant_id]
      );

      if (!result.rows.length)
        return res.status(404).json({ message: "Perusahaan tidak ditemukan" });

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Profil perusahaan error:", err);
      res.status(500).json({ message: "Gagal memuat profil perusahaan" });
    }
  });

  // ====================================================================
  // 📌 PENGATURAN TAMPILAN
  // ====================================================================
  router.get("/pengaturan-tampilan", verifySubadmin, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT logo_url, teks_samping_logo, subjudul, judul_utama, deskripsi, copyright_text
         FROM pengaturan_tampilan WHERE tenant_id = $1 LIMIT 1`,
        [req.tenant_id]
      );

      if (!result.rows.length)
        return res.json({
          logo_url: "",
          teks_samping_logo: "",
          subjudul: "",
          judul_utama: "",
          deskripsi: "",
          copyright_text: "",
        });

      res.json(result.rows[0]);
    } catch (err) {
      console.error("Pengaturan subadmin error:", err);
      res.status(500).json({ message: "Gagal memuat pengaturan tampilan" });
    }
  });

  // ====================================================================
  // 📌 DASHBOARD
  // ====================================================================
  router.get("/dashboard", verifySubadmin, async (req, res) => {
    try {
      const tenant_id = req.tenant_id;

      const today = new Date().toISOString().split("T")[0];

      const todayQuery = await pool.query(
        `SELECT COUNT(*) AS total FROM public.tamu
         WHERE tenant_id = $1 AND DATE(created_at) = $2`,
        [tenant_id, today]
      );

      const weekQuery = await pool.query(
        `SELECT COUNT(*) AS total FROM public.tamu
         WHERE tenant_id = $1 AND created_at >= NOW() - INTERVAL '7 DAYS'`,
        [tenant_id]
      );

      const monthQuery = await pool.query(
        `SELECT COUNT(*) AS total FROM public.tamu
         WHERE tenant_id = $1
         AND DATE_PART('month', created_at) = DATE_PART('month', NOW())
         AND DATE_PART('year', created_at) = DATE_PART('year', NOW())`,
        [tenant_id]
      );

      const totalAllQuery = await pool.query(
        `SELECT COUNT(*) AS total FROM public.tamu WHERE tenant_id = $1`,
        [tenant_id]
      );

      const recentGuests = await pool.query(
        `SELECT nama, instansi, email, no_telp, tujuan_kunjungan, created_at
         FROM public.tamu
         WHERE tenant_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [tenant_id]
      );

      return res.json({
        total_today: Number(todayQuery.rows[0].total),
        total_week: Number(weekQuery.rows[0].total),
        total_month: Number(monthQuery.rows[0].total),
        total_all: Number(totalAllQuery.rows[0].total),
        recent_guests: recentGuests.rows,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      res.status(500).json({ message: "Gagal load dashboard" });
    }
  });

  // ====================================================================
  // 📌 DATA TAMU
  // ====================================================================
  router.get("/tamu", verifySubadmin, async (req, res) => {
    try {
      const tenant_id = req.tenant_id;

      const { keyword = "", start = "", end = "" } = req.query;

      let query = `
        SELECT id, nama, instansi, email, no_telp, alamat, tujuan_kunjungan, created_at
        FROM public.tamu
        WHERE tenant_id = $1
      `;
      const params = [tenant_id];

      if (keyword) {
        params.push(`%${keyword}%`);
        query += ` AND (nama ILIKE $${params.length}
                  OR instansi ILIKE $${params.length}
                  OR tujuan_kunjungan ILIKE $${params.length})`;
      }

      if (start) {
        params.push(start);
        query += ` AND DATE(created_at) >= $${params.length}`;
      }

      if (end) {
        params.push(end);
        query += ` AND DATE(created_at) <= $${params.length}`;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await pool.query(query, params);

      return res.json(result.rows);
    } catch (err) {
      console.error("Error tamu list:", err);
      res.status(500).json({ message: "Gagal memuat data tamu" });
    }
  });

  // ====================================================================
  // 🔥 CEK STATUS SUBADMIN & PERUSAHAAN (WAJIB UNTUK FRONTEND MU)
  // ====================================================================
  router.get("/cek-status", async (req, res) => {
    try {
      const header = req.headers.authorization || "";
      if (!header.startsWith("Bearer "))
        return res.status(401).json({
          status_subadmin: "nonaktif",
          status_perusahaan: "nonaktif"
        });

      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret123");

      const subadmin_id = decoded.id;
      const tenant_id = decoded.tenant_id;

      // Cek SUBADMIN
      const sub = await pool.query(
        `SELECT status FROM subadmin WHERE id = $1`,
        [subadmin_id]
      );

      const status_subadmin = sub.rows.length ? sub.rows[0].status : "nonaktif";

      // Cek PERUSAHAAN
      const perusahaan = await pool.query(
        `SELECT status_sewa FROM perusahaan WHERE id = $1`,
        [tenant_id]
      );

      const status_perusahaan = perusahaan.rows.length
        ? perusahaan.rows[0].status_sewa
        : "nonaktif";

      return res.json({
        status_subadmin,
        status_perusahaan
      });

    } catch (err) {
      return res.json({
        status_subadmin: "nonaktif",
        status_perusahaan: "nonaktif"
      });
    }
  });

router.get("/export/pdf", verifySubadmin, async (req, res) => {
  try {
    const { keyword = "", start = "", end = "" } = req.query;

    // 🔍 ambil nama perusahaan untuk judul PDF
    const perusahaan = await pool.query(
      "SELECT nama_perusahaan FROM perusahaan WHERE id = $1",
      [req.tenant_id]
    );

    const namaPerusahaan = perusahaan.rows[0]?.nama_perusahaan || "Perusahaan";

    let query = `
      SELECT nama, no_telp, instansi, email, alamat, tujuan_kunjungan, tanggal
      FROM tamu
      WHERE tenant_id = $1
    `;

    const params = [req.tenant_id];

    if (keyword) {
      params.push(`%${keyword}%`);
      query += `
        AND (
          nama ILIKE $2 OR 
          instansi ILIKE $2 OR 
          tujuan_kunjungan ILIKE $2
        )
      `;
    }

    if (start && end) {
      params.push(start, end);
      query += `
        AND tanggal BETWEEN $${params.length - 1} AND $${params.length}
      `;
    }

    query += " ORDER BY tanggal DESC";

    const result = await pool.query(query, params);

    // ===================================
    // PDF
    // ===================================
    const doc = new PDFDocument({
      margin: 30,
      size: "A4"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=data_tamu_subadmin.pdf`
    );

    doc.pipe(res);

    // ===================================
    // JUDUL PDF
    // ===================================
    doc.fontSize(16).text(`LAPORAN DATA TAMU - ${namaPerusahaan}`, {
      align: "center"
    });
    doc.moveDown(1);

    // ===================================
    // SETUP KOLOM
    // ===================================
    const col = {
      nama: 70,
      no_telp: 65,
      instansi: 70,
      email: 90,
      alamat: 100,
      tujuan: 70,
      tanggal: 60,
    };

    const startX = 30;
    let y = 100;

    doc.fontSize(9);

    // ===================================
    // DRAW CELL DENGAN TEXT WRAP
    // ===================================
    function drawCell(text, x, width, height, align = "left") {
      doc.rect(x, y, width, height).stroke();
      doc.text(text, x + 3, y + 3, {
        width: width - 6,
        align,
      });
    }

    const headerHeight = 22;

    drawCell("Nama", startX, col.nama, headerHeight);
    drawCell("No. Telp", startX + col.nama, col.no_telp, headerHeight);
    drawCell("Instansi", startX + col.nama + col.no_telp, col.instansi, headerHeight);
    drawCell("Email", startX + col.nama + col.no_telp + col.instansi, col.email, headerHeight);
    drawCell("Alamat", startX + col.nama + col.no_telp + col.instansi + col.email, col.alamat, headerHeight);
    drawCell("Tujuan", startX + col.nama + col.no_telp + col.instansi + col.email + col.alamat, col.tujuan, headerHeight);
    drawCell("Tanggal", startX + col.nama + col.no_telp + col.instansi + col.email + col.alamat + col.tujuan, col.tanggal, headerHeight);

    y += headerHeight;

    // ===================================
    // DATA TABEL
    // ===================================
    result.rows.forEach((row) => {
      const rowHeight = 35; // lebih rapi daripada 25

      if (y + rowHeight > 780) {
        doc.addPage();
        y = 40;
      }

      drawCell(row.nama || "-", startX, col.nama, rowHeight);
      drawCell(row.no_telp || "-", startX + col.nama, col.no_telp, rowHeight);
      drawCell(row.instansi || "-", startX + col.nama + col.no_telp, col.instansi, rowHeight);
      drawCell(row.email || "-", startX + col.nama + col.no_telp + col.instansi, col.email, rowHeight);
      drawCell(row.alamat || "-", startX + col.nama + col.no_telp + col.instansi + col.email, col.alamat, rowHeight);
      drawCell(
        row.tujuan_kunjungan || "-",
        startX + col.nama + col.no_telp + col.instansi + col.email + col.alamat,
        col.tujuan,
        rowHeight
      );

      const formattedDate = row.tanggal
        ? new Date(row.tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "-";

      drawCell(
        formattedDate,
        startX + col.nama + col.no_telp + col.instansi + col.email + col.alamat + col.tujuan,
        col.tanggal,
        rowHeight,
        "center"
      );

      y += rowHeight;
    });

    doc.end();

  } catch (err) {
    console.error("EXPORT SUBADMIN PDF ERROR:", err);
    res.status(500).json({ error: "Gagal membuat PDF" });
  }
});

  return router;
}
