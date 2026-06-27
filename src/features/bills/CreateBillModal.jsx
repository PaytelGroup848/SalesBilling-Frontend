import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { getClients } from '../../api/clients.api';
import { createBill } from '../../api/bills.api';
import { DEFAULT_SPECS, SERVICES } from '../../utils/constants';
import toast from 'react-hot-toast';

export const CreateBillModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState('');
  const [service, setService] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [specifications, setSpecifications] = useState([]);
  const [billingDate, setBillingDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [amount, setAmount] = useState('');

  const { data: clientsData } = useQuery({
    queryKey: ['clients', { search: clientSearch }],
    queryFn: () => getClients({ search: clientSearch, limit: 50 }),
    enabled: isOpen
  });

  useEffect(() => {
    if (service && DEFAULT_SPECS[service]) {
      setSpecifications(
        DEFAULT_SPECS[service].map(key => ({ key, value: '' }))
      );
    }
  }, [service]);

  const mutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      toast.success('Bill created successfully!');
      queryClient.invalidateQueries(['bills']);
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create bill');
    }
  });

  const resetForm = () => {
    setStep(1);
    setClientId('');
    setService('');
    setClientSearch('');
    setSpecifications([]);
    setBillingDate('');
    setRenewalDate('');
    setAmount('');
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      clientId,
      service,
      specifications,
      billingDate,
      renewalDate,
      amount: parseFloat(amount)
    });
  };

  const selectedClient = clientsData?.clients?.find(c => c._id === clientId);
  const selectedService = SERVICES.find(s => s.value === service);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Bill" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client
              </label>
              <div className="space-y-2">
                <Input
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                />
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                  {clientsData?.clients?.map(client => (
                    <button
                      key={client._id}
                      type="button"
                      onClick={() => setClientId(client._id)}
                      className={`
                        w-full text-left px-4 py-2 text-sm border-b border-gray-100 last:border-0
                        ${client._id === clientId
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="font-medium">{client.companyName}</div>
                      <div className="text-xs text-gray-500">{client.representativeName} - {client.phone}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SERVICES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setService(s.value)}
                    className={`
                      p-4 border-2 rounded-lg text-center transition-colors
                      ${service === s.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!clientId || !service}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Client:</span>
                  <span className="ml-2 font-medium">{selectedClient?.companyName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Service:</span>
                  <span className="ml-2 font-medium">{selectedService?.label}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpec(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={addSpec}>
                  <Plus className="w-4 h-4" />
                  Add Row
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Billing Date"
                type="date"
                value={billingDate}
                onChange={(e) => setBillingDate(e.target.value)}
                required
              />
              <Input
                label="Renewal Date"
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                required
              />
              <Input
                label="Amount"
                type="number"
                prefix="₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Creating...' : 'Create Bill'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
