import bcrypt from "bcryptjs";

const hash = ""// hash kamu
const coba = ""// ganti ini dengan password yang mau kamu tes

const cocok = await bcrypt.compare(coba, hash);
console.log(cocok ? "✅ Password cocok" : "❌ Tidak cocok");
