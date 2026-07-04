import { useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 relative">

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        <FaBars size={18} />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Page */}
      <main
        className={`
          flex-1 p-4 transition-all duration-300
          ${isSidebarOpen ? "ml-64" : "ml-20"}
          md:ml-64
        `}
      >
        {children}
      </main>
    </div>
  );
}
