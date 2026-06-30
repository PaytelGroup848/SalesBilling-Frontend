import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export const Sidebar = () => {
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
    <div className="w-60 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">Sales Billing</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
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
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
