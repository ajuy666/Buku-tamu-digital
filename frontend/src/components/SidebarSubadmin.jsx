import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaCogs,
  FaBars,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";
import { useState } from "react";

export default function SidebarSubadmin({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id } = useParams();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    setTimeout(() => navigate("/login"), 300);
  };

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 
          bg-gradient-to-b from-blue-900 to-blue-800 text-white
          shadow-2xl transition-all duration-300 flex flex-col
          ${isOpen ? "w-64" : "w-20"}
          h-screen 
          overflow-y-auto 
          overflow-x-hidden     /* 🚀 FIX PENTING: HILANGKAN SCROLL KANAN */
          z-50
        `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-blue-700">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-blue-800 transition-all"
          >
            <FaBars size={20} />
          </button>

          <h1
            className={`
              text-lg font-bold whitespace-nowrap transition-all duration-300
              ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
            `}
          >
            Subadmin
          </h1>
        </div>

        {/* MENU */}
        <nav className="flex flex-col mt-4 space-y-1">

          <SidebarSubLink
            to={`/tenant/${tenant_id}/subadmin/dashboard`}
            icon={<FaChartBar />}
            label="Dashboard"
            isOpen={isOpen}
            active={location.pathname.includes("/subadmin/dashboard")}
          />

          <SidebarSubLink
            to={`/tenant/${tenant_id}/subadmin/data-tamu`}
            icon={<FaUsers />}
            label="Data Tamu"
            isOpen={isOpen}
            active={location.pathname.includes("/subadmin/data-tamu")}
          />

          <SidebarSubLink
            to={`/tenant/${tenant_id}/subadmin/profil-perusahaan`}
            icon={<FaBuilding />}
            label="Profil Perusahaan"
            isOpen={isOpen}
            active={location.pathname.includes("/subadmin/profil-perusahaan")}
          />

          <SidebarSubLink
            to={`/tenant/${tenant_id}/subadmin/pengaturan`}
            icon={<FaCogs />}
            label="Pengaturan"
            isOpen={isOpen}
            active={location.pathname.includes("/subadmin/pengaturan")}
          />
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto px-5 pb-6 flex justify-center">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`
              flex items-center gap-2 transition-all duration-300 shadow-lg
              rounded-lg bg-gradient-to-r from-red-600 to-red-500
              ${isOpen ? "w-full px-4 py-3" : "w-12 h-12 justify-center"}
            `}
          >
            <FaSignOutAlt size={20} />
            {isOpen && <span className="opacity-100">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MODAL LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-80 text-center animate-fadeIn">
            <h3 className="text-gray-800 font-semibold text-lg mb-3">
              Keluar dari akun subadmin?
            </h3>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SidebarSubLink({ to, icon, label, isOpen, active }) {
  return (
    <Link
      to={to}
      className={`
        px-5 py-3 flex items-center gap-3 rounded-md transition-all duration-200
        ${
          active
            ? "bg-blue-700 shadow-lg border-l-4 border-yellow-400 font-semibold"
            : "hover:bg-blue-800"
        }
      `}
    >
      <div className="text-xl">{icon}</div>

      <span
        className={`
          transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 hidden"}
        `}
      >
        {label}
      </span>
    </Link>
  );
}
