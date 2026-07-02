import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Building2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    if (user.role === "superadmin") {
      return [
        { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/admin/users", icon: Users, label: "Team Members" },
        { to: "/admin/clients", icon: Building2, label: "All Clients" },
        { to: "/admin/bills", icon: FileText, label: "All Bills" },
      ];
    }
    if (user.role === "sales") {
      return [
        { to: "/sales/clients", icon: Users, label: "Clients" },
        { to: "/sales/billing", icon: FileText, label: "Billing" },
      ];
    }
    if (user.role === "accountant") {
      return [{ to: "/accountant/billing", icon: FileText, label: "Billing" }];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 h-full w-60 bg-white border-r border-gray-200
          flex flex-col z-40 transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex flex-col items-center ">
            <img
              src="/Cloudedata.svg"
              alt="Cloudedata"
              className="h-15 w-auto"
            />
          </div>
          <button
            onClick={onClose}
            className="md:hidden cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};
