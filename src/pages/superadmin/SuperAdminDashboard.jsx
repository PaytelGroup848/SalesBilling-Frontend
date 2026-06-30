import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { getUsers } from "../../api/users.api";
import { getClients } from "../../api/clients.api";
import { getBills } from "../../api/bills.api";

const StatCard = ({ icon: Icon, label, value, color = "indigo" }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export const SuperAdminDashboard = () => {
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ limit: 100 }),
  });

  const { data: clientsData } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients({ limit: 100 }),
  });

  const { data: billsData } = useQuery({
    queryKey: ["bills"],
    queryFn: () => getBills({ limit: 100 }),
  });

  const approvedBills =
    billsData?.bills?.filter((b) => b.status === "approved").length || 0;
  const pendingBills =
    billsData?.bills?.filter((b) => b.status === "pending_approval").length ||
    0;
  const rejectedBills =
    billsData?.bills?.filter((b) => b.status === "rejected").length || 0;

  return (
    <Layout pageTitle="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Team Members"
          value={usersData?.total || 0}
          color="blue"
        />
        <StatCard
          icon={LayoutDashboard}
          label="Total Clients"
          value={clientsData?.total || 0}
          color="indigo"
        />
        <StatCard
          icon={FileText}
          label="Total Bills"
          value={billsData?.total || 0}
          color="indigo"
        />
        <StatCard
          icon={CheckCircle}
          label="Approved Bills"
          value={approvedBills}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Pending Approval"
          value={pendingBills}
          color="yellow"
        />
        <StatCard
          icon={XCircle}
          label="Rejected Bills"
          value={rejectedBills}
          color="red"
        />
      </div>
    </Layout>
  );
};
