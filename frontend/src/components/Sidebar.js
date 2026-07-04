import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaBuilding,
  FaUserCog,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant_id } = useParams();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile && isOpen) {
        toggleSidebar(false); // tutup sidebar saat mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, toggleSidebar]);

  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    setTimeout(() => navigate("/login"), 300);
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-lg
          transition-all duration-300 flex flex-col sidebar
          ${isMobile ? "w-20" : isOpen ? "w-64" : "w-20"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-blue-700">
          <button
            onClick={() => toggleSidebar(!isOpen)}
            className="p-2 rounded-md hover:bg-blue-800 transition-all"
          >
            <FaBars size={20} />
          </button>

          <h1
            className={`text-lg font-bold whitespace-nowrap label transition-all duration-300
              ${isOpen && !isMobile ? "opacity-100" : "opacity-0 hidden"}
            `}
          >
            Buku Tamu Admin
          </h1>
        </div>

        {/* MENU */}
        <nav className="flex flex-col mt-4 space-y-1">
          <SidebarLink
            to={`/tenant/${tenant_id}/admin/dashboard`}
            icon={<FaChartBar />}
            label="Dashboard"
            open={isOpen && !isMobile}
            active={location.pathname.includes("/admin/dashboard")}
          />

          <SidebarLink
            to={`/tenant/${tenant_id}/admin/data-tamu`}
            icon={<FaUsers />}
            label="Data Tamu"
            open={isOpen && !isMobile}
            active={location.pathname.includes("/admin/data-tamu")}
          />

          <SidebarLink
            to={`/tenant/${tenant_id}/admin/profil`}
            icon={<FaBuilding />}
            label="Profil Perusahaan"
            open={isOpen && !isMobile}
            active={location.pathname.includes("/admin/profil")}
          />

          <SidebarLink
            to={`/tenant/${tenant_id}/admin/kelola-subadmin`}
            icon={<FaUsers />}
            label="Kelola Subadmin"
            open={isOpen && !isMobile}
            active={location.pathname.includes("/admin/kelola-subadmin")}
          />

          <SidebarLink
            to={`/tenant/${tenant_id}/admin/pengaturan`}
            icon={<FaUserCog />}
            label="Pengaturan Admin"
            open={isOpen && !isMobile}
            active={location.pathname.includes("/admin/pengaturan")}
          />
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="mt-auto px-5 pb-6 flex justify-center">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`
              flex items-center gap-2 rounded-lg shadow-lg bg-red-600 hover:bg-red-700
              ${isOpen && !isMobile ? "px-4 py-3 w-full" : "w-12 h-12 justify-center"}
            `}
          >
            <FaSignOutAlt size={20} />
            {isOpen && !isMobile && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-80 text-center animate-fadeIn">
            <h3 className="text-gray-800 font-semibold text-lg mb-3">Keluar dari akun admin?</h3>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
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

function SidebarLink({ to, icon, label, open, active }) {
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

      <span className={`label transition-all ${open ? "opacity-100" : "opacity-0 hidden"}`}>
        {label}
      </span>
    </Link>
  );
}
