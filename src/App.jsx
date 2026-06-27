import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { Spinner } from "./components/ui/Spinner.jsx";
import { Login } from "./pages/auth/Login.jsx";
import { Clients } from "./pages/sales/Clients.jsx";
import { Billing } from "./pages/sales/Billing.jsx";
import { AccountantBilling } from "./pages/accountant/AccountantBilling.jsx";
import { SuperAdminDashboard } from "./pages/superadmin/SuperAdminDashboard.jsx";
import { Users } from "./pages/superadmin/Users.jsx";
import { AllBills } from "./pages/superadmin/AllBills.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'superadmin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'sales') {
      return <Navigate to="/sales/clients" replace />;
    } else if (user.role === 'accountant') {
      return <Navigate to="/accountant/billing" replace />;
    }
  }

  return children;
};

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === 'sales' && <Navigate to="/sales/clients" replace />}
          {user?.role === 'accountant' && <Navigate to="/accountant/billing" replace />}
          {user?.role === 'superadmin' && <Navigate to="/admin/dashboard" replace />}
        </ProtectedRoute>
      } />
      <Route path="/sales/clients" element={
        <ProtectedRoute allowedRoles={['sales', 'superadmin']}>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/sales/billing" element={
        <ProtectedRoute allowedRoles={['sales', 'superadmin']}>
          <Billing />
        </ProtectedRoute>
      } />
      <Route path="/accountant/billing" element={
        <ProtectedRoute allowedRoles={['accountant', 'superadmin']}>
          <AccountantBilling />
        </ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SuperAdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['superadmin']}>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/bills" element={
        <ProtectedRoute allowedRoles={['superadmin']}>
          <AllBills />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
