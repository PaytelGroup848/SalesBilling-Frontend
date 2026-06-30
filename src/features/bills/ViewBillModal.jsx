import { Download } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

// ─── Constants (same as pdfGenerator.js) ───────────────────────────────────
const companyInfo = {
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
  bankName: "ICICI Bank",
  bankAccountNumber: "002105029512",
  bankBranch: "Defence Colony, Delhi-110020",
  bankIFSC: "ICICI0006300",
  jurisdiction: "DELHI",
};

const SERVICE_HSN = {
  ERP_ON_CLOUD: "998315",
  RMS: "998315",
  FAIRWOOD: "998314",
};

const SERVICE_NAMES = {
  ERP_ON_CLOUD: "ERP On Cloud",
  RMS: "RMS (Restaurant Management System)",
  FAIRWOOD: "Fairwood",
};

const GST_RATE = 18;

// ─── Helpers ────────────────────────────────────────────────────────────────
const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (num < 20) return ones[num];
  if (num < 100)
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000)
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 ? " " + numberToWords(num % 100000) : "")
    );
  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore" +
    (num % 10000000 ? " " + numberToWords(num % 10000000) : "")
  );
};

const amountInWords = (amount) => {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = numberToWords(rupees) + " Rupees";
  if (paise > 0) words += " and " + numberToWords(paise) + " Paise";
  return words + " Only";
};

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate2D = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatDateShort = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── Shared cell style ──────────────────────────────────────────────────────
const td = (extra = {}) => ({
  border: "1px solid #aaa",
  padding: "5px 6px",
  fontSize: 11,
  ...extra,
});

const EXCLUDED_KEYS = [
  "quantity",
  "amount",
  "billing date",
  "renewal date",
  "billingdate",
  "renewaldate",
];

// ─── Component ───────────────────────────────────────────────────────────────
export const ViewBillModal = ({ isOpen, onClose, bill }) => {
  if (!bill) return null;

  const baseAmount = parseFloat(bill.amount) || 0;
  const gstAmount = parseFloat(((baseAmount * GST_RATE) / 100).toFixed(2));
  const totalAmount = parseFloat((baseAmount + gstAmount).toFixed(2));
  const roundedTotal = Math.round(totalAmount);
  const roundOff = roundedTotal - totalAmount;

  const hsnCode = SERVICE_HSN[bill.service] || "998315";
  const serviceName = SERVICE_NAMES[bill.service] || bill.service;
  const client = bill.client;

  const qSpec = bill.specifications?.find(
    (s) => s.key.toLowerCase() === "quantity",
  );
  const qtyLabel = qSpec ? `${qSpec.value} No.` : "1 No.";

  const filteredSpecs =
    bill.specifications?.filter(
      (s) => !EXCLUDED_KEYS.includes(s.key.toLowerCase().replace(/\s/g, "")),
    ) || [];

  const handleDownloadPdf = () => {
    window.open(`http://localhost:3000/api/pdf/${bill._id}`, "_blank");
  };

  const fillerTd = {
    borderLeft: "1px solid #aaa",
    borderRight: "1px solid #aaa",
    padding: 0,
    height: 18,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tax Invoice" size="xl">
      {/* ── Toolbar ── */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleDownloadPdf}>
          <Download className="w-4 h-4 mr-1" />
          Download PDF
        </Button>
      </div>

      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 11,
          color: "#1e293b",
          background: "#fff",
          padding: "20px 24px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
        }}
      >
        {/* Header: Logo + Title */}
        <div
          style={{
            position: "relative",
            marginBottom: 8,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/Cloudedata.svg"
            alt="Logo"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 40,
              width: "auto",
            }}
          />
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#1e293b",
            }}
          >
            Tax Invoice
          </div>
        </div>

        {/* {bill.status === "approved" && (
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              right: "25px",
              transform: "rotate(-20deg)",
              zIndex: 10,
              pointerEvents: "none",
              border: "5px solid #16a34a",
              borderRadius: 12,
              padding: "10px 28px",
              textAlign: "center",
              opacity: 0.2,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#16a34a",
                letterSpacing: 4,
                lineHeight: 1,
              }}
            >
              PAID
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#16a34a",
                letterSpacing: 1,
              }}
            >
              APPROVED
            </div>
          </div>
        )} */}

        {/* ── Top Grid: Company + Invoice Meta ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            border: "1px solid #ccc",
          }}
        >
          {/* Left: Company info */}
          <div
            style={{
              padding: "8px 10px",
              fontSize: 10.5,
              lineHeight: 1.55,
              borderRight: "1px solid #ccc",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
              {companyInfo.companyName}
            </div>
            <div>
              {companyInfo.addressLine1}, {companyInfo.addressLine2}
            </div>
            <div>{companyInfo.cityPincode}</div>
            <div>
              GSTIN: <strong>{companyInfo.gstin}</strong>
            </div>
            <div>
              State: {companyInfo.stateName} | Code: {companyInfo.stateCode}
            </div>
            <div>CIN: {companyInfo.cin}</div>
            <div>Email: {companyInfo.email}</div>
            <div>Website: {companyInfo.website}</div>
          </div>
          {/* Right: Invoice meta */}
          <div
            style={{ padding: "8px 10px", fontSize: 10.5, lineHeight: 1.55 }}
          >
            {[
              ["Invoice No.", bill.billNumber],
              ["Billing Date", formatDateShort(bill.billingDate)],
              ["Renewal Date", formatDateShort(bill.renewalDate)],
              ["Service", serviceName],
            ].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 6 }}>
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{ fontSize: 11.5, fontWeight: 700, color: "#1e293b" }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bill To ── */}
        <div
          style={{
            border: "1px solid #ccc",
            borderTop: "none",
            padding: "4px 6px",
            fontSize: 10.5,
            lineHeight: 1.4,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#64748b",
              letterSpacing: 0.4,
              marginBottom: 4,
            }}
          >
            Bill To
          </div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {client?.companyName}
          </div>
          <div>
            Representative: <strong>{client?.representativeName}</strong>
          </div>
          {client?.phone && <div>Phone: {client.phone}</div>}
          {client?.email && <div>Email: {client.email}</div>}
          {client?.gstNumber && (
            <div>
              GSTIN: <strong>{client.gstNumber}</strong>
            </div>
          )}
          {client?.address && <div>Address: {client.address}</div>}
        </div>

        {/* ── Tally-Style Items Table ── */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 8,
            fontSize: 11,
          }}
        >
          <thead>
            <tr style={{ background: "#F1F5F9" }}>
              {[
                { label: "Sl\nNo.", w: "5%", align: "center" },
                {
                  label: "Description of\nServices",
                  w: "36%",
                  align: "center",
                },
                { label: "GST\nRate", w: "7%", align: "center" },
                { label: "Quantity", w: "10%", align: "center" },
                { label: "Rate", w: "12%", align: "right" },
                { label: "per", w: "6%", align: "center" },
                { label: "Amount", w: "14%", align: "right" },
              ].map(({ label, w, align }) => (
                <th
                  key={label}
                  style={{
                    border: "1px solid #aaa",
                    padding: "5px 6px",
                    textAlign: align,
                    width: w,
                    fontSize: 10,
                    whiteSpace: "pre-line",
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Main service row */}
            <tr>
              <td style={{ ...td(), textAlign: "center" }}>1</td>
              <td style={{ ...td() }}>
                <div style={{ fontWeight: 700 }}>{serviceName}</div>
                <div style={{ fontSize: 10, color: "#555" }}>
                  From {formatDate2D(bill.billingDate)} to{" "}
                  {formatDate2D(bill.renewalDate)}
                </div>
              </td>
              <td style={{ ...td(), textAlign: "center" }}>{GST_RATE}%</td>
              <td style={{ ...td(), textAlign: "center" }}>{qtyLabel}</td>
              <td style={{ ...td(), textAlign: "right" }}>
                {formatINR(baseAmount)}
              </td>
              <td style={{ ...td(), textAlign: "center" }}>No.</td>
              <td style={{ ...td(), textAlign: "right", fontWeight: 700 }}>
                {formatINR(baseAmount)}
              </td>
            </tr>

            {/* Spec sub-rows */}
            {filteredSpecs.map((s, i) => (
              <tr key={i} style={{ background: "#fafafa" }}>
                <td
                  style={{
                    borderLeft: "1px solid #aaa",
                    borderRight: "1px solid #aaa",
                    padding: "3px 6px",
                  }}
                />
                <td
                  style={{
                    borderRight: "1px solid #aaa",
                    padding: "3px 6px 3px 18px",
                    fontSize: 10.5,
                    color: "#333",
                  }}
                >
                  {s.key}
                  {s.value ? ` - ${s.value}` : ""}
                </td>
                {[...Array(5)].map((_, j) => (
                  <td key={j} style={{ borderRight: "1px solid #aaa" }} />
                ))}
              </tr>
            ))}

            {/* Filler rows */}
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <tr key={`f${i}`} style={{ height: 18 }}>
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                  <td style={fillerTd} />
                </tr>
              ))}

            {/* IGST row */}
            <tr>
              <td
                style={{
                  borderLeft: "1px solid #aaa",
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                  padding: "5px 6px",
                }}
              />
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 10.5,
                  color: "#333",
                }}
              >
                IGST Output-{GST_RATE}% ({companyInfo.stateName})
              </td>
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                }}
              />
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                }}
              />
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                  padding: "5px 6px",
                  textAlign: "center",
                  fontSize: 10.5,
                }}
              >
                {GST_RATE}
              </td>
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                  padding: "5px 6px",
                  textAlign: "center",
                  fontSize: 10.5,
                }}
              >
                %
              </td>
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  borderTop: "1px solid #aaa",
                  padding: "5px 6px",
                  textAlign: "right",
                  fontSize: 10.5,
                }}
              >
                {formatINR(gstAmount)}
              </td>
            </tr>

            {/* Round Off row */}
            <tr>
              <td
                style={{
                  borderLeft: "1px solid #aaa",
                  borderRight: "1px solid #aaa",
                }}
              />
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  padding: "3px 6px",
                  textAlign: "right",
                  fontSize: 10.5,
                  color: "#333",
                }}
              >
                Round Off
              </td>
              <td style={{ borderRight: "1px solid #aaa" }} />
              <td style={{ borderRight: "1px solid #aaa" }} />
              <td style={{ borderRight: "1px solid #aaa" }} />
              <td style={{ borderRight: "1px solid #aaa" }} />
              <td
                style={{
                  borderRight: "1px solid #aaa",
                  padding: "3px 6px",
                  textAlign: "right",
                  fontSize: 10.5,
                }}
              >
                {(roundOff >= 0 ? "+" : "") + formatINR(roundOff)}
              </td>
            </tr>

            {/* Total row */}
            <tr style={{ background: "#F1F5F9" }}>
              <td style={{ border: "1px solid #aaa", padding: 6 }} />
              <td
                style={{
                  border: "1px solid #aaa",
                  padding: 6,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Total
              </td>
              <td style={{ border: "1px solid #aaa" }} />
              <td
                style={{
                  border: "1px solid #aaa",
                  padding: 6,
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                {qtyLabel}
              </td>
              <td style={{ border: "1px solid #aaa" }} />
              <td style={{ border: "1px solid #aaa" }} />
              <td
                style={{
                  border: "1px solid #aaa",
                  padding: 6,
                  textAlign: "right",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                ₹ {formatINR(roundedTotal)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount in Words — Tally strip */}
        <div
          style={{
            border: "1px solid #aaa",
            borderTop: "none",
            display: "flex",
            justifyContent: "space-between",
            padding: "5px 8px",
            fontSize: 10.5,
            background: "#F1F5F9",
          }}
        >
          <span>
            <strong>Amount Chargeable (in words):</strong> &nbsp; INR{" "}
            {amountInWords(roundedTotal)}
          </span>
          <span style={{ color: "#555", fontStyle: "italic" }}>
            E. &amp; O.E.
          </span>
        </div>

        {/* GST Tax Breakup Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 8,
            fontSize: 10.5,
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {[
                "HSN/SAC",
                "Taxable Value (₹)",
                "IGST Rate",
                "IGST Amount (₹)",
                "Total Amount (₹)",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    border: "1px solid #ccc",
                    padding: "6px 10px",
                    fontSize: 9.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                {hsnCode}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                {formatINR(baseAmount)}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                {GST_RATE}%
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                {formatINR(gstAmount)}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                <strong>{formatINR(totalAmount)}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount Breakup Box */}
        <div style={{ border: "1px solid #ccc", borderTop: "none" }}>
          {[
            {
              label: "Taxable Amount (Before GST)",
              val: `₹ ${formatINR(baseAmount)}`,
              bold: false,
            },
            {
              label: `IGST @ ${GST_RATE}%`,
              val: `₹ ${formatINR(gstAmount)}`,
              bold: false,
            },
          ].map(({ label, val }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                fontSize: 11,
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <span>{label}</span>
              <span>{val}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "6px 10px",
              fontSize: 12,
              fontWeight: 700,
              background: "#EBEBEB",
              color: "#000",
            }}
          >
            <span>Total Amount Payable</span>
            <span>₹ {formatINR(roundedTotal)}</span>
          </div>
        </div>

        {/* Bank Details */}
        <div
          style={{
            marginTop: 8,
            border: "1px solid #aaa",
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#64748b",
              letterSpacing: 0.4,
              marginBottom: 6,
            }}
          >
            Company's Bank Details
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 20px",
              fontSize: 10.5,
            }}
          >
            {[
              ["Account Holder", companyInfo.bankAccountHolder],
              ["Account No.", companyInfo.bankAccountNumber],
              ["Bank Name", companyInfo.bankName],
              ["Branch", companyInfo.bankBranch],
              ["IFSC Code", companyInfo.bankIFSC],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "#64748b", fontSize: 10, minWidth: 100 }}>
                  {k}
                </span>
                <span style={{ fontWeight: 600, color: "#1e293b" }}>: {v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms heading + Scope (same as Page1termsHTML in pdfGenerator) */}
        <div
          style={{
            marginTop: 10,
            borderBottom: "1px solid #D5D5D5",
            paddingBottom: 4,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#1e293b",
          }}
        >
          Terms &amp; Conditions
        </div>
        <div style={{ fontSize: 10, color: "#64748b", margin: "4px 0 8px" }}>
          Invoice No: <strong>{bill.billNumber}</strong> &nbsp;|&nbsp;{" "}
          {companyInfo.companyName} &nbsp;|&nbsp; {companyInfo.website}
        </div>
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: 5,
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Scope of Services
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={{ fontSize: 10.5, color: "#334155", lineHeight: 1.6 }}>
              Cloudedata shall provide secure, cloud-hosted access to its
              Accounting ERP solution, including storage and management of the
              Client's accounting data on its dedicated servers.
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 10,
            paddingTop: 8,
            borderTop: "1px solid #e2e8f0",
            fontSize: 9.5,
            color: "#94a3b8",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          <strong>SUBJECT TO {companyInfo.jurisdiction} JURISDICTION</strong>{" "}
          &nbsp;|&nbsp; This is a System Generated Invoice &nbsp;|&nbsp; Page 1
          of 2
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PAGE 2 — TERMS & CONDITIONS
      ══════════════════════════════════════════════════ */}
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 11,
          color: "#1e293b",
          background: "#fff",
          padding: "20px 24px",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            color: "#1e293b",
            marginBottom: 2,
            paddingBottom: 4,
            borderBottom: "1px solid #D5D5D5",
            marginTop: 7,
          }}
        >
          Terms &amp; Conditions
        </div>
        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 12 }}>
          Invoice No: <strong>{bill.billNumber}</strong> &nbsp;|&nbsp;{" "}
          {companyInfo.companyName} &nbsp;|&nbsp; {companyInfo.website}
        </div>

        {[
          {
            title: "Data Responsibility & Security",
            points: [
              "Cloudedata takes full responsibility for uptime, access, and safeguarding of the Client's ERP data. In the event of a cyber-attack or malicious intrusion, Cloudedata shall restore the most recent verified backup to resume operations. Cloudedata shall not be liable beyond the point of the last backup.",
            ],
          },
          {
            title: "Client Conduct & Liability",
            points: [
              "The Client agrees to maintain responsible, lawful, and respectful usage of the provided services. The Client shall be solely liable for any misconduct, abuse, or inappropriate behavior—whether verbal, written, or digital—by themselves or their authorized users toward Cloudedata's personnel or systems. Cloudedata reserves the right to suspend or terminate services in such cases.",
            ],
          },
          {
            title: "Data Access & Client Control",
            points: [
              "Cloudedata shall have no right to access, view, or alter any of the Client's data stored on the cloud platform or within the designated folders assigned to the Client. The Client shall have full and independent control over their data, including the ability to copy, paste, and delete any files or folders within their allocated space. Cloudedata does not interfere with or modify client data under any circumstances.",
            ],
          },
          {
            title: "Malicious File Policy",
            points: [
              "Uploading or executing any malicious, harmful, or unauthorized files is strictly prohibited. If such actions result in data loss, damage, or service interruption, the Client shall be fully liable for the total loss, and Cloudedata may recover the full cost of the damage.",
            ],
          },
          {
            title: "Backup Policy",
            points: [
              "Data is backed up at regular intervals (e.g., daily). In the event of data loss, the latest backup will be restored within 6–24 hours.",
            ],
          },
          {
            title: "Server Maintenance & Downtime",
            points: [
              "Cloudedata reserves the right to initiate emergency server maintenance at any time in case of a critical issue. The Client will be given at least one (1) hour's prior notice.",
            ],
          },
          {
            title: "Support Availability",
            points: [
              "Support is available only during working hours (Monday to Saturday, 10:00 AM – 7:30 PM IST). No after-hours, weekend, or holiday support is provided. All support will be provided strictly on a ticket basis via the official support portal or designated support email.",
            ],
          },
          {
            title: "No Refund Policy",
            points: [
              "All fees paid to Cloudedata are non-refundable under any circumstances, including but not limited to cancellation, discontinuation, dissatisfaction, or downtime caused by third-party or client-side issues.",
            ],
          },
          {
            title: "Fees & Payment",
            points: [
              "The Client agrees to pay the billing amount as mentioned in the invoice according to the selected Plan and Billing Period.",
            ],
          },
          {
            title: "Term, Renewal & Termination",
            points: [
              "This Agreement shall be automatically renewed with each service renewal unless either party provides 30 days' written notice. Upon termination, data will be made available for export for 2–3 days.",
            ],
          },
          {
            title: "Governing Law & Jurisdiction",
            points: [
              "This Agreement shall be governed by the laws of India, and any disputes shall fall under the exclusive jurisdiction of the courts at New Delhi.",
              "By digitally signing this Agreement, the Client confirms having read, understood, and agreed to all the terms and conditions above.",
            ],
          },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 5,
                textTransform: "uppercase",
                letterSpacing: 0.3,
              }}
            >
              {section.title}
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {section.points.map((p, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 10.5,
                    color: "#334155",
                    lineHeight: 1.6,
                    marginBottom: 3,
                  }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Page 2 Footer */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 10,
            borderTop: "1px solid #e2e8f0",
            fontSize: 9.5,
            color: "#64748b",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <strong>{companyInfo.companyName}</strong>
          <br />
          {companyInfo.addressLine1}, {companyInfo.addressLine2},{" "}
          {companyInfo.cityPincode}
          <br />
          Email: {companyInfo.email} &nbsp;|&nbsp; Website:{" "}
          {companyInfo.website}
          <br />
          GSTIN: {companyInfo.gstin} &nbsp;|&nbsp; CIN: {companyInfo.cin}
          <br />
          <br />
          <strong>
            SUBJECT TO {companyInfo.jurisdiction} JURISDICTION
          </strong>{" "}
          &nbsp;|&nbsp; Page 2 of 2
        </div>
      </div>
    </Modal>
  );
};
