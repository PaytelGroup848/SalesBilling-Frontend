import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Edit, Download, Send, Mail, X, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import { ViewBillModal } from './ViewBillModal';
import { EditBillModal } from './EditBillModal';
import { submitBill, approveBill, rejectBill, sendBillEmail } from '../../api/bills.api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const BillActions = ({ bill, onView, onEdit }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const submitMutation = useMutation({
    mutationFn: () => submitBill(bill._id),
    onSuccess: () => {
      toast.success('Bill submitted for approval');
      queryClient.invalidateQueries(['bills']);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to submit bill')
  });

  const approveMutation = useMutation({
    mutationFn: () => approveBill(bill._id),
    onSuccess: () => {
      toast.success('Bill approved');
      queryClient.invalidateQueries(['bills']);
      setIsApproveConfirmOpen(false);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to approve bill')
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectBill(bill._id, { reason: rejectReason }),
    onSuccess: () => {
      toast.success('Bill rejected');
      queryClient.invalidateQueries(['bills']);
      setIsRejectModalOpen(false);
      setRejectReason('');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to reject bill')
  });

  const sendEmailMutation = useMutation({
    mutationFn: () => sendBillEmail(bill._id),
    onSuccess: () => {
      toast.success('Email sent successfully');
      queryClient.invalidateQueries(['bills']);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to send email')
  });

  const handleDownloadPdf = () => {
    window.open(`http://localhost:3000/api/pdf/${bill._id}`, '_blank');
  };

  const canEdit = (user.role === 'sales' && ['draft', 'rejected'].includes(bill.status)) || 
                  user.role === 'superadmin' || 
                  user.role === 'accountant';

  const canSubmit = user.role === 'sales' && bill.status === 'draft';
  const canApproveReject = user.role === 'accountant' && bill.status === 'pending_approval';
  const canSendEmail = user.role === 'sales' && bill.status === 'approved' && !bill.emailSentAt;

  return (
    <>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setIsViewModalOpen(true)}>
          <Eye className="w-4 h-4" />
        </Button>
        {canEdit && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={handleDownloadPdf}>
          <Download className="w-4 h-4" />
        </Button>
        {canSubmit && (
          <Button variant="ghost" size="sm" onClick={() => submitMutation.mutate()}>
            <Send className="w-4 h-4" />
          </Button>
        )}
        {canSendEmail && (
          <Button variant="ghost" size="sm" onClick={() => sendEmailMutation.mutate()}>
            <Mail className="w-4 h-4" />
          </Button>
        )}
        {canApproveReject && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsApproveConfirmOpen(true)}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsRejectModalOpen(true)}>
              <X className="w-4 h-4 text-red-600" />
            </Button>
          </>
        )}
      </div>

      <ViewBillModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bill={bill}
      />

      <EditBillModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bill={bill}
      />

      <ConfirmDialog
        isOpen={isApproveConfirmOpen}
        onClose={() => setIsApproveConfirmOpen(false)}
        onConfirm={() => approveMutation.mutate()}
        title="Approve Bill"
        message="Are you sure you want to approve this bill?"
        confirmText="Approve"
        isLoading={approveMutation.isPending}
      />

      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Bill" size="sm">
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
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)} disabled={rejectMutation.isPending}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={rejectMutation.isPending || !rejectReason.trim()}>
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
