import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar, X } from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { Pagination } from "../../components/ui/Pagination";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { CreateBillModal } from "../../features/bills/CreateBillModal";
import { BillActions } from "../../features/bills/BillActions";
import { getBills } from "../../api/bills.api";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { SERVICES } from "../../utils/constants";

export const Billing = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [renewalFilter, setRenewalFilter] = useState("");
  const [renewalStartDate, setRenewalStartDate] = useState("");
  const [renewalEndDate, setRenewalEndDate] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage } = usePagination();

  const { data, isLoading } = useQuery({
    queryKey: ["bills", { page, search: debouncedSearch, status, service, renewalFilter, renewalStartDate, renewalEndDate }],
    queryFn: () => getBills({ page, search: debouncedSearch, status, service, renewalFilter, renewalStartDate, renewalEndDate }),
    placeholderData: (previousData) => previousData,
  });

  const clearRenewalFilters = () => {
    setRenewalFilter("");
    setRenewalStartDate("");
    setRenewalEndDate("");
  };

  const serviceNames = {
    ERP_ON_CLOUD: "ERP On Cloud",
    RMS: "RMS",
    FAIRWOOD: "Fairwood",
  };

  const columns = [
    { key: "index", label: "#", render: (_, i) => (page - 1) * 10 + i + 1 },
    { key: "billNumber", label: "Bill No" },
    {
      key: "client",
      label: "Client",
      render: (row) => row.client.companyName || row.client.representativeName,
    },
    {
      key: "service",
      label: "Service",
      render: (row) => serviceNames[row.service],
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: "billingDate",
      label: "Billing Date",
      render: (row) => formatDate(row.billingDate),
    },
    {
      key: "renewalDate",
      label: "Renewal Date",
      render: (row) => (
        <span className="text-red-600">{formatDate(row.renewalDate)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => <BillActions bill={row} />,
    },
  ];

  return (
    <Layout pageTitle="Billing">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-64">
                  <SearchInput
                    placeholder="Search bills..."
                    onChange={setSearch}
                  />
                </div>
                <Select
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "draft", label: "Draft" },
                    { value: "pending_approval", label: "Pending Approval" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full md:w-48"
                />
                <Select
                  options={[{ value: "", label: "All Services" }, ...SERVICES]}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full md:w-48"
                />
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Bill
              </Button>
            </div>

            {/* Renewal Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Renewal Filter:</span>
              </div>
              <Select
                options={[
                  { value: "", label: "Select" },
                  { value: "today", label: "Today" },
                  { value: "this_week", label: "This Week" },
                  { value: "this_month", label: "This Month" },
                ]}
                value={renewalFilter}
                onChange={(e) => {
                  setRenewalFilter(e.target.value);
                  if (e.target.value) {
                    setRenewalStartDate("");
                    setRenewalEndDate("");
                  }
                }}
                className="w-full md:w-48"
              />
              <div className="text-sm text-gray-500">or</div>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={renewalStartDate}
                  onChange={(e) => {
                    setRenewalStartDate(e.target.value);
                    if (e.target.value) setRenewalFilter("");
                  }}
                  className="w-full md:w-40"
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={renewalEndDate}
                  onChange={(e) => {
                    setRenewalEndDate(e.target.value);
                    if (e.target.value) setRenewalFilter("");
                  }}
                  className="w-full md:w-40"
                />
              </div>
              {(renewalFilter || renewalStartDate || renewalEndDate) && (
                <Button variant="ghost" size="sm" onClick={clearRenewalFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <Table columns={columns} data={data?.bills} isLoading={isLoading} />
          {data?.totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <CreateBillModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Layout>
  );
};
