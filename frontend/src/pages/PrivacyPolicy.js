export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600 rounded-xl shadow-md">
            <span className="text-3xl">🔒</span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-blue-700">
              Kebijakan Privasi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Buku Tamu Digital • PT Langgeng Sejahtera Kreasi Komputasi
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <p className="text-gray-700 leading-relaxed mb-4">
          Aplikasi <strong>Buku Tamu Digital</strong> dibangun untuk mempermudah
          proses pencatatan kunjungan di lingkungan perusahaan/instansi.
          Kebijakan privasi ini menjelaskan bagaimana kami mengelola dan
          melindungi informasi pribadi yang Anda berikan saat mengisi formulir
          kunjungan.
        </p>

        <h2 className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          📌 Informasi yang Kami Kumpulkan
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          Kami mengumpulkan data seperti:
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
          <li>Nama lengkap</li>
          <li>Nomor telepon</li>
          <li>Email</li>
          <li>Instansi/perusahaan</li>
          <li>Alamat</li>
          <li>Tujuan kunjungan dan keperluan</li>
          <li>Waktu dan tanggal kunjungan</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          🔐 Bagaimana Data Digunakan
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Data yang Anda berikan digunakan untuk:
        </p>
        <ul className="list-disc ml-6 text-gray-700 space-y-1 mb-4">
          <li>Pencatatan kunjungan tamu</li>
          <li>Keamanan dan administrasi internal</li>
          <li>Rekap laporan kunjungan perusahaan</li>
          <li>Dokumentasi internal untuk kepentingan operasional</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          🛡️ Keamanan Data
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Kami menjaga informasi Anda menggunakan sistem keamanan modern,
          termasuk penyimpanan terenkripsi dan pembatasan akses. Meskipun begitu,
          tidak ada sistem yang 100% aman, namun kami berkomitmen menjaga
          kerahasiaan data Anda sebaik mungkin.
        </p>

        <h2 className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          🤝 Pembagian Data
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Data kunjungan <strong>tidak akan dibagikan kepada pihak ketiga</strong> 
          untuk tujuan komersial. Data hanya dapat dibagikan apabila diminta secara 
          sah oleh pihak berwenang.
        </p>

        <h2 className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          📄 Persetujuan
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Dengan mengisi formulir kunjungan, Anda menyatakan telah membaca dan
          menyetujui kebijakan privasi ini.
        </p>

        {/* FOOTER */}
        <div className="mt-10 border-t pt-4 text-sm text-gray-500">
          Terakhir diperbarui: {new Date().toLocaleDateString()}  
          <br />
          © {new Date().getFullYear()} Buku Tamu Digital — PT LSKK
        </div>
      </div>
    </div>
  );
}
