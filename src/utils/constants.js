export const SERVICES = [
  { value: 'ERP_ON_CLOUD', label: 'ERP On Cloud' },
  { value: 'RMS', label: 'RMS' },
  { value: 'FAIRWOOD', label: 'Fairwood' }
];

export const DEFAULT_SPECS = {
  ERP_ON_CLOUD: ['Username', 'Last three digit of IP', 'Quantity', 'Amount', 'Billing date', 'Renewal date'],
  RMS: ['Username', 'Last three digit of IP', 'Quantity', 'Amount', 'Billing date', 'Renewal date'],
  FAIRWOOD: ['Quantity', 'Amount', 'Billing date', 'Renewal date']
};

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  sales: 'Sales',
  accountant: 'Accountant'
};

export const ROLE_COLORS = {
  superadmin: 'bg-purple-100 text-purple-700',
  sales: 'bg-blue-100 text-blue-700',
  accountant: 'bg-green-100 text-green-700'
};

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  pending_approval: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

export const STATUS_LABELS = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected'
};

export const companyInfo = {
  companyName: "PayTel Terminal Pvt Ltd.(Delhi)",
  addressLine1: "A-212, 1st Floor, Phase-3",
  addressLine2: "Okhla Industrial Area",
  cityPincode: "New Delhi-110020",
  gstin: "07AAMCP1524F1ZK",
  stateName: "Delhi",
  stateCode: "07",
  cin: "U74999DL2020PTC367460",
  email: "customercare@cloudedata.com",
  website: "www.cloudedata.com",
  bankAccountHolder: "PAYTEL TERMINAL PRIVATE LIMITED",
  bankName: "ICIC Bank",
  bankAccountNumber: "002105029512",
  bankBranch: "Defence Colony, Delhi-110020",
  bankIFSC: "ICIC0006300",
  declarationTerms: [
    "Support Other Than Cloud Services will not be Provided.",
    "For Software related query, Kindly Contact to the respected Software Company only.",
  ],
  governmentLaw: "This Agreement shall be governed by the laws of India, and any disputes shall fall under the exclusive jurisdiction of the courts at New Delhi.",
  jurisdiction: "DELHI",
};
