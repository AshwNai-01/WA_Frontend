import { FileText, MessageSquare } from "lucide-react";
import { getLeads, getMessages, updateLeadStatus, updateMessageStatus } from "./services/adminApi";
import StatusSelect from "./components/StatusSelect";
import { formatDate, formatDateTime } from "../../utils/formatDate";

// Everything that differs between the two dashboard tabs lives here.
// Each tab: its API calls, its statuses and the table columns (see components/DataTable.jsx).

const LEAD_STATUSES = ["new", "contacted", "closed"];
const MESSAGE_STATUSES = ["new", "replied", "closed"];

function ContactCell({ email, mobile }) {
  return (
    <div className="space-y-0.5">
      <a href={`tel:${mobile}`} className="block whitespace-nowrap text-gray-900 hover:text-plum">
        {mobile}
      </a>
      <a href={`mailto:${email}`} className="block break-all text-gray-500 hover:text-plum">
        {email}
      </a>
    </div>
  );
}

// Columns both tabs share
const receivedColumn = {
  header: "Received",
  cell: (row) => formatDateTime(row.createdAt),
  className: "whitespace-nowrap text-gray-500",
};
const nameColumn = { header: "Name", cell: (row) => row.name, className: "font-medium text-gray-900" };
const contactColumn = { header: "Contact", cell: (row) => <ContactCell email={row.email} mobile={row.mobile} /> };

// onSave(id, status) comes from the panel, so the column is built for it
const statusColumn = (statuses, onSave) => ({
  header: "Status",
  cell: (row) => (
    <StatusSelect id={row._id} value={row.status} options={statuses} onSave={onSave} label={`Status for ${row.name}`} />
  ),
});

export const ENQUIRY_TABS = {
  leads: {
    label: "Quote requests",
    icon: FileText,
    emptyText: "No quote requests yet",
    statuses: LEAD_STATUSES,
    fetch: getLeads,
    update: updateLeadStatus,
    columns: (onSave) => [
      receivedColumn,
      nameColumn,
      contactColumn,
      {
        header: "Looking for",
        cell: (lead) => (
          <>
            {lead.category?.name ?? "Any vendor"}
            <span className="block text-gray-500">{lead.city?.name ?? "Any city"}</span>
            {lead.vendor && <span className="block text-gray-500">Vendor: {lead.vendor.name}</span>}
          </>
        ),
      },
      { header: "Wedding date", cell: (lead) => formatDate(lead.weddingDate), className: "whitespace-nowrap" },
      { header: "Source", cell: (lead) => lead.source || "—", className: "text-gray-500" },
      statusColumn(LEAD_STATUSES, onSave),
    ],
  },

  messages: {
    label: "Contact messages",
    icon: MessageSquare,
    emptyText: "No contact messages yet",
    statuses: MESSAGE_STATUSES,
    fetch: getMessages,
    update: updateMessageStatus,
    columns: (onSave) => [
      receivedColumn,
      nameColumn,
      contactColumn,
      { header: "Type", cell: (message) => message.enquiryType, className: "capitalize" },
      {
        header: "Message",
        className: "max-w-sm",
        cell: (message) => (
          <p className="line-clamp-3 whitespace-pre-line" title={message.note}>
            {message.note}
          </p>
        ),
      },
      statusColumn(MESSAGE_STATUSES, onSave),
    ],
  },
};
