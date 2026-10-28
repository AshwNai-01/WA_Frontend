import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Inbox, MessageSquare, FileText } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import useAuth from "../../auth/hooks/useAuth";
import { getLeads, getMessages, updateLeadStatus, updateMessageStatus } from "../services/adminApi";
import StatusSelect from "../components/StatusSelect";
import Pagination from "../../common/components/Pagination";
import LoadError from "../../common/components/LoadError";

const PAGE_SIZE = 10;
const LEAD_STATUSES = ["new", "contacted", "closed"];
const MESSAGE_STATUSES = ["new", "replied", "closed"];

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const formatDate = (value) => (value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)) : "—");

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500";
const td = "px-4 py-3 align-top text-sm text-gray-700";

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

function EmptyRow({ colSpan, filtered }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-14 text-center">
        <Inbox size={36} className="mx-auto text-gray-300" />
        <p className="mt-2 font-medium text-gray-900">{filtered ? "Nothing with this status" : "No enquiries yet"}</p>
        <p className="text-sm text-gray-500">New submissions from the website will appear here.</p>
      </td>
    </tr>
  );
}

function LeadsTable({ rows, status, onSave }) {
  return (
    <table className="min-w-[900px] w-full divide-y divide-gray-100">
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Name</th>
          <th className={th}>Contact</th>
          <th className={th}>Looking for</th>
          <th className={th}>Wedding date</th>
          <th className={th}>Source</th>
          <th className={th}>Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {rows.length === 0 && <EmptyRow colSpan={7} filtered={Boolean(status)} />}
        {rows.map((l) => (
          <tr key={l._id} className="hover:bg-gray-50/60">
            <td className={`${td} whitespace-nowrap text-gray-500`}>{formatDateTime(l.createdAt)}</td>
            <td className={`${td} font-medium text-gray-900`}>{l.name}</td>
            <td className={td}>
              <ContactCell email={l.email} mobile={l.mobile} />
            </td>
            <td className={td}>
              {l.category?.name ?? "Any vendor"}
              <span className="block text-gray-500">{l.city?.name ?? "Any city"}</span>
              {l.vendor && <span className="block text-gray-500">Vendor: {l.vendor.name}</span>}
            </td>
            <td className={`${td} whitespace-nowrap`}>{formatDate(l.weddingDate)}</td>
            <td className={`${td} text-gray-500`}>{l.source || "—"}</td>
            <td className={td}>
              <StatusSelect id={l._id} value={l.status} options={LEAD_STATUSES} onSave={onSave} label={`Status for ${l.name}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MessagesTable({ rows, status, onSave }) {
  return (
    <table className="min-w-[860px] w-full divide-y divide-gray-100">
      <thead className="bg-gray-50">
        <tr>
          <th className={th}>Received</th>
          <th className={th}>Name</th>
          <th className={th}>Contact</th>
          <th className={th}>Type</th>
          <th className={th}>Message</th>
          <th className={th}>Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {rows.length === 0 && <EmptyRow colSpan={6} filtered={Boolean(status)} />}
        {rows.map((m) => (
          <tr key={m._id} className="hover:bg-gray-50/60">
            <td className={`${td} whitespace-nowrap text-gray-500`}>{formatDateTime(m.createdAt)}</td>
            <td className={`${td} font-medium text-gray-900`}>{m.name}</td>
            <td className={td}>
              <ContactCell email={m.email} mobile={m.mobile} />
            </td>
            <td className={`${td} capitalize`}>{m.enquiryType}</td>
            <td className={`${td} max-w-sm`}>
              <p className="line-clamp-3 whitespace-pre-line" title={m.note}>
                {m.note}
              </p>
            </td>
            <td className={td}>
              <StatusSelect id={m._id} value={m.status} options={MESSAGE_STATUSES} onSave={onSave} label={`Status for ${m.name}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TABS = {
  leads: { label: "Quote requests", icon: FileText, statuses: LEAD_STATUSES, fetch: getLeads, update: updateLeadStatus, Table: LeadsTable },
  messages: { label: "Contact messages", icon: MessageSquare, statuses: MESSAGE_STATUSES, fetch: getMessages, update: updateMessageStatus, Table: MessagesTable },
};

// One tab's list. Remounted (key) when the tab changes, so it never shows
// the other tab's rows while loading.
function EnquiryPanel({ tab, status, page, onPageChange }) {
  const { data: rows, pagination, loading, error, refetch } = useFetch(
    () => tab.fetch({ status, page, limit: PAGE_SIZE }),
    [status, page]
  );

  // Save, then reload the page of results (a row may leave the current status filter)
  const saveStatus = async (id, nextStatus) => {
    await tab.update(id, nextStatus);
    refetch();
  };

  const { Table } = tab;

  return (
    <>
      <p className="mt-4 text-sm text-gray-600" aria-live="polite">
        {pagination && !error ? `${pagination.total} ${pagination.total === 1 ? "entry" : "entries"}` : " "}
      </p>

      <div className="mt-2">
        {error ? (
          <LoadError title="Couldn't load enquiries" message={error} onRetry={refetch} />
        ) : loading && !rows ? (
          <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" aria-hidden="true" />
        ) : (
          // Wide tables scroll sideways inside this box on small screens, not the whole page
          <div className={`overflow-x-auto rounded-2xl ring-1 ring-black/5 transition-opacity ${loading ? "opacity-60" : ""}`}>
            <Table rows={rows} status={status} onSave={saveStatus} />
          </div>
        )}
      </div>

      {!error && (
        <div className="mt-6">
          <Pagination page={page} totalPages={pagination?.totalPages} onChange={onPageChange} />
        </div>
      )}
    </>
  );
}

// /admin?tab=messages&status=new&page=2 (state in the URL so refresh keeps your place)
export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabKey = searchParams.get("tab") === "messages" ? "messages" : "leads";
  const tab = TABS[tabKey];
  const status = tab.statuses.includes(searchParams.get("status")) ? searchParams.get("status") : "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  useEffect(() => {
    const previous = document.title;
    document.title = "Dashboard | Cosmical Events";
    return () => {
      document.title = previous;
    };
  }, []);

  // Empty values are dropped so URLs stay short; "leads" is the default tab
  const setParams = (next) => setSearchParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)));
  const tabParam = tabKey === "leads" ? "" : tabKey;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Signed in as {user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/5" role="tablist" aria-label="Enquiry type">
          {Object.entries(TABS).map(([key, t]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={key === tabKey}
              onClick={() => setParams({ tab: key === "leads" ? "" : key })}
              // Tabs reset the status filter and page: the two tabs use different statuses
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
                key === tabKey ? "bg-plum text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          Status
          <select
            value={status}
            onChange={(e) => setParams({ tab: tabParam, status: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm capitalize outline-none focus:ring-2 focus:ring-plum/20"
          >
            <option value="">All</option>
            {tab.statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <EnquiryPanel
        key={tabKey}
        tab={tab}
        status={status}
        page={page}
        onPageChange={(p) => setParams({ tab: tabParam, status, page: p > 1 ? String(p) : "" })}
      />
    </section>
  );
}
