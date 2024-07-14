import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa"; // Import an icon from react-icons

const Dashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("Statistics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sideBarOptions = [
    { name: "Statistics", path: "/dashboard/stats" },
    { name: "Profile", path: "/dashboard/profile" },
    { name: "Logout", path: "/login" },
  ];

  const handleNavigation = (option) => {
    setActive(option.name);
    navigate(option.path);
    setSidebarOpen(false); // Close sidebar on navigation
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-slate-100 p-4 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:col-span-3 md:block`}
      >
        <ul>
          {sideBarOptions.map((option) => (
            <li
              key={option.name}
              className={`p-2 rounded-md cursor-pointer w-44 ${
                active === option.name ? "bg-slate-300" : "hover:bg-slate-300"
              }`}
              onClick={() => handleNavigation(option)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 md:col-span-9 p-4">
        <button
          className="md:hidden p-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
