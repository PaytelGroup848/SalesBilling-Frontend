import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Edit, Download, Trash2 } from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { Pagination } from "../../components/ui/Pagination";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { ViewBillModal } from "../../features/bills/ViewBillModal";
import { EditBillModal } from "../../features/bills/EditBillModal";
import { getBills, deleteBill } from "../../api/bills.api";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { SERVICES } from "../../utils/constants";
import toast from "react-hot-toast";

export const AllBills = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [deletingBill, setDeletingBill] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage } = usePagination();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bills", { page, search: debouncedSearch, status, service }],
    queryFn: () => getBills({ page, search: debouncedSearch, status, service }),
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBill(id),
    onSuccess: () => {
      toast.success("Bill deleted successfully!");
      queryClient.invalidateQueries(["bills"]);
      setIsDeleteConfirmOpen(false);
      setDeletingBill(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete bill");
    },
  });

  const handleDownloadPdf = (billId) => {
    window.open(`http://localhost:3000/api/pdf/${billId}`, "_blank");
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
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={row.status} />,
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (row) => row.createdBy?.name,
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
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setViewingBill(row);
              setIsViewModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingBill(row);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadPdf(row._id)}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDeletingBill(row);
              setIsDeleteConfirmOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout pageTitle="All Bills">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-64">
              <SearchInput placeholder="Search bills..." onChange={setSearch} />
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

      <ViewBillModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingBill(null);
        }}
        bill={viewingBill}
      />

      <EditBillModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBill(null);
        }}
        bill={editingBill}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setDeletingBill(null);
        }}
        onConfirm={() => deleteMutation.mutate(deletingBill._id)}
        title="Delete Bill"
        message={`Are you sure you want to delete bill "${deletingBill?.billNumber}"?`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </Layout>
  );
};
