import { Download, Printer } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { companyInfo } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/formatters';

const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
};

export const ViewBillModal = ({ isOpen, onClose, bill }) => {
  if (!bill) return null;
  
  const serviceNames = {
    ERP_ON_CLOUD: 'ERP On Cloud',
    RMS: 'RMS',
    FAIRWOOD: 'Fairwood'
  };

  const handleDownloadPdf = () => {
    window.open(`http://localhost:3000/api/pdf/${bill._id}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Bill" size="xl">
      <div className="flex justify-end gap-3 mb-6">
        <Button variant="secondary" onClick={handlePrint}>
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button onClick={handleDownloadPdf}>
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="p-8 bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="text-center mb-8 pb-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{companyInfo.companyName}</h2>
          <p className="text-sm text-gray-600">{companyInfo.addressLine1}</p>
          <p className="text-sm text-gray-600">{companyInfo.addressLine2}</p>
          <p className="text-sm text-gray-600">{companyInfo.cityPincode}</p>
          <p className="text-sm text-gray-600 mt-2">
            GSTIN: {companyInfo.gstin} | CIN: {companyInfo.cin}
          </p>
          <p className="text-sm text-gray-600">
            Email: {companyInfo.email} | Website: {companyInfo.website}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 py-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
            <p className="text-sm text-gray-700"><strong>Company:</strong> {bill.client.companyName}</p>
            <p className="text-sm text-gray-700"><strong>Representative:</strong> {bill.client.representativeName}</p>
            <p className="text-sm text-gray-700"><strong>Phone:</strong> {bill.client.phone}</p>
            <p className="text-sm text-gray-700"><strong>Email:</strong> {bill.client.email}</p>
            {bill.client.gstNumber && (
              <p className="text-sm text-gray-700"><strong>GST:</strong> {bill.client.gstNumber}</p>
            )}
            {bill.client.address && (
              <p className="text-sm text-gray-700"><strong>Address:</strong> {bill.client.address}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">Invoice Details</p>
            <p className="text-sm text-gray-700"><strong>Invoice No:</strong> {bill.billNumber}</p>
            <p className="text-sm text-gray-700"><strong>Billing Date:</strong> {formatDate(bill.billingDate)}</p>
            <p className="text-sm text-gray-700"><strong>Renewal Date:</strong> {formatDate(bill.renewalDate)}</p>
            <p className="text-sm text-gray-700"><strong>Service:</strong> {serviceNames[bill.service]}</p>
          </div>
        </div>

        <div className="py-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Key</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {bill.specifications.map((spec, index) => (
                <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{spec.key}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{spec.value}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(bill.amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Amount in Words:</span>
            <span className="text-sm text-gray-700">
              {numberToWords(Math.floor(bill.amount))} Rupees {bill.amount % 1 > 0 ? `${Math.round((bill.amount % 1) * 100)} Paise` : 'Only'}
            </span>
          </div>
        </div>

        <div className="py-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
          <p className="text-sm text-gray-700"><strong>Account Holder:</strong> {companyInfo.bankAccountHolder}</p>
          <p className="text-sm text-gray-700"><strong>Bank Name:</strong> {companyInfo.bankName}</p>
          <p className="text-sm text-gray-700"><strong>Account Number:</strong> {companyInfo.bankAccountNumber}</p>
          <p className="text-sm text-gray-700"><strong>Branch:</strong> {companyInfo.bankBranch}</p>
          <p className="text-sm text-gray-700"><strong>IFSC:</strong> {companyInfo.bankIFSC}</p>
        </div>

        <div className="py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Declaration & Terms</h3>
          {companyInfo.declarationTerms.map((term, index) => (
            <p key={index} className="text-sm text-gray-700 mb-2">- {term}</p>
          ))}
          <p className="text-sm text-gray-700 mt-4">{companyInfo.governmentLaw}</p>
          <p className="text-sm text-gray-700">Jurisdiction: {companyInfo.jurisdiction}</p>
        </div>

        <div className="pt-8 text-right">
          <p className="text-sm text-gray-700">Authorized Signatory</p>
          <div className="mt-16 border-t border-gray-300 inline-block pt-2">
            <p className="text-sm font-medium text-gray-900">{companyInfo.companyName}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
