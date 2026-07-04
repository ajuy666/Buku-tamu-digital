# Buku Tamu Digital - Multi-Tenant

Proyek ini merupakan aplikasi **Buku Tamu Digital Multi-Tenant** yang dikembangkan selama masa program magang 6 bulan sebagai **Software Engineer / Fullstack Developer** di **PT LSKK (Lembaga Sistem Komunikasi Kabel)**. 

Aplikasi ini dirancang untuk dapat digunakan oleh banyak instansi atau organisasi sekaligus (*multi-tenant*) secara mandiri, efisien, terisolasi, dan aman.

## 🚀 Fitur Utama
* **Arsitektur Multi-Tenant**: Mendukung banyak organisasi atau instansi dalam satu sistem terpusat secara terisolasi dan aman.
* **Manajemen Data Tamu**: Pencatatan riwayat kunjungan tamu secara *real-time*, cepat, dan efisien.
* **Dashboard Admin**: Panel kendali komprehensif bagi admin tenant untuk memantau aktivitas kunjungan dan mengelola data.
* **Antarmuka Responsif**: Desain aplikasi yang ramah pengguna, dioptimalkan baik untuk akses web maupun mobile.

## 🛠️ Teknologi yang Digunakan
Proyek ini dibangun menggunakan ekosistem teknologi (*tech stack*) berikut:
* **Front-End**: React JS / Tailwind CSS
* **Back-End**: Node JS / Express JS
* **Database & BaaS**: Supabase (PostgreSQL)

## 📂 Konfigurasi Environment
Aplikasi ini memerlukan konfigurasi environment variable yang dapat dilihat strukturnya pada file `backend/.env.example`. Anda perlu menyalin file tersebut menjadi `.env` dan mengisi kredensial database Anda sendiri sebelum menjalankan aplikasi.

---

## 📦 Panduan Instalasi dan Menjalankan Proyek

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda sebelum memulai langkah di bawah ini.

### 1. Clone Repositori
### 2. Setup Backend
* cd backend
* npm install
* Duplikat file .env.example menjadi .env dan isi dengan kredensial database/Supabase Anda sendiri
* cp .env.example .env
* npm start
### 3. Setup Frontend
* cd frontend
* npm install
* npm start
