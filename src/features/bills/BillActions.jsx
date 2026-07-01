import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Edit,
  Download,
  Send,
  Mail,
  X,
  Check,
  Info,
  AlertCircle,
  Clock,
  User,
  FileText,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { ViewBillModal } from "./ViewBillModal";
import { EditBillModal } from "./EditBillModal";
import {
  submitBill,
  approveBill,
  rejectBill,
  sendBillEmail,
} from "../../api/bills.api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const BillActions = ({ bill, onView, onEdit }) => {
  console.log("this is my bill", bill);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [isRejectionInfoOpen, setIsRejectionInfoOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: () => submitBill(bill._id),
    onSuccess: () => {
      toast.success("Bill submitted for approval");
      queryClient.invalidateQueries(["bills"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to submit bill"),
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => approveBill(bill._id),
    onSuccess: () => {
      toast.success("Bill approved");
      queryClient.invalidateQueries(["bills"]);
      setIsApproveConfirmOpen(false);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to approve bill"),
  });

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: () => rejectBill(bill._id, { reason: rejectReason }),
    onSuccess: () => {
      toast.success("Bill rejected");
      queryClient.invalidateQueries(["bills"]);
      setIsRejectModalOpen(false);
      setRejectReason("");
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to reject bill"),
  });

  // Send Email Mutation
  const sendEmailMutation = useMutation({
    mutationFn: () => sendBillEmail(bill._id),
    onSuccess: () => {
      toast.success("Email sent successfully");
      queryClient.invalidateQueries(["bills"]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to send email"),
  });

  const handleDownloadPdf = () => {
    window.open(
      `https://billing.fairwoodit.com/api/pdf/${bill._id}` ||
        `http://localhost:3000/api/pdf/${bill._id}`,
      "_blank",
    );
  };

  const canEdit =
    (user.role === "sales" && ["draft", "rejected"].includes(bill.status)) ||
    user.role === "superadmin" ||
    (user.role === "accountant" && ["pending_approval"].includes(bill.status));

  const canSubmit = user.role === "sales" && bill.status === "draft";
  const canApproveReject =
    user.role === "accountant" && bill.status === "pending_approval";
  const canSendEmail =
    user.role === "sales" && bill.status === "approved" && !bill.emailSentAt;

  // Check if bill is rejected
  const isRejected = bill.status === "rejected";

  // Loading states
  const isLoading =
    submitMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    sendEmailMutation.isPending;

  return (
    <>
      <div className="flex items-center gap-1">
        {/* View Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsViewModalOpen(true)}
          disabled={isLoading}
        >
          <Eye className="w-4 h-4 text-blue-500" />
        </Button>

        {/* Edit Button */}

        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            disabled={isLoading}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}

        {/* Download Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownloadPdf}
          disabled={isLoading}
        >
          <Download className="w-4 h-4 text-green-500" />
        </Button>

        {/* Rejection Info Button */}
        {isRejected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRejectionInfoOpen(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isLoading}
          >
            <XCircle className="w-4 h-4" />
          </Button>
        )}

        {/* Submit Button */}
        {canSubmit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => submitMutation.mutate()}
            className="border border-[#b1b1fa]"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send
                <Send className="w-4 h-4 text-[#4F39F6]" />
              </>
            )}
          </Button>
        )}

        {/* Send Email Button */}
        {canSendEmail && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sendEmailMutation.mutate()}
            disabled={sendEmailMutation.isPending}
            className="border border-amber-200 bg-amber-50 hover:bg-amber-100"
          >
            {sendEmailMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span className="text-amber-500">Send</span>
                <Mail className="w-4.5 h-4.5 text-amber-500 " />
              </>
            )}
          </Button>
        )}

        {/* Approve/Reject Buttons */}
        {canApproveReject && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsApproveConfirmOpen(true)}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              ) : (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRejectModalOpen(true)}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              ) : (
                <X className="w-4 h-4 text-red-600" />
              )}
            </Button>
          </>
        )}
      </div>

      {/* View Bill Modal */}
      <ViewBillModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bill={bill}
      />

      {/* Edit Bill Modal */}
      <EditBillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bill={bill}
      />

      {/* Approve Confirm Dialog */}
      <ConfirmDialog
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={() => approveMutation.mutate()}
        title="Approve Bill"
        message="Are you sure you want to approve this bill?"
        confirmText={approveMutation.isPending ? "Approving..." : "Approve"}
        isLoading={approveMutation.isPending}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Bill"
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (rejectReason.trim()) {
              rejectMutation.mutate();
            }
          }}
          className="space-y-4"
        >
          <Input
            label="Reason for Rejection"
            as="textarea"
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this bill"
            required
            disabled={rejectMutation.isPending}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="submit"
              disabled={rejectMutation.isPending || !rejectReason.trim()}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Rejection Info Modal */}
      <Modal
        isOpen={isRejectionInfoOpen}
        onClose={() => setIsRejectionInfoOpen(false)}
        title="Rejection Details"
        size="md"
      >
        <div className="space-y-6">
          {/* Rejection Reason */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Rejection Reason
                </h4>
                <p className="text-sm text-red-700">
                  {bill.rejectionReason || "No reason provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Rejected By */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium">Rejected By</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {bill.rejectedBy?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-500">
                {bill.rejectedBy?.email || ""}
              </p>
            </div>

            {/* Rejected At */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium">Rejected At</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {bill.rejectedAt
                  ? new Date(bill.rejectedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                {bill.rejectedAt
                  ? new Date(bill.rejectedAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : ""}
              </p>
            </div>
          </div>

          {/* Bill Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-medium">Bill Information</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Bill Number:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bill.billNumber}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Amount:</span>
                <span className="ml-2 font-medium text-gray-900">
                  ₹{bill.amount}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Client:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bill.client?.companyName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Service:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {bill.service || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setIsRejectionInfoOpen(false)}
              disabled={isLoading}
            >
              Close
            </Button>
            {canEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  setIsRejectionInfoOpen(false);
                  setIsEditModalOpen(true);
                }}
                disabled={isLoading}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Bill
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
