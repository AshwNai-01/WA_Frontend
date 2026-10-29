import { useSearchParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import usePageTitle from "../../../hooks/usePageTitle";
import { useAuth } from "../../auth/AuthContext";
import { getLeads, getMessages } from "../services/adminApi";
import { ENQUIRY_TABS } from "../enquiryTabs";
import EnquiryPanel from "../components/EnquiryPanel";

function TabButton({ tab, selected, newCount, onClick }) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none ${
        selected ? "bg-plum text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} /> {tab.label}
      {newCount > 0 && (
        <span
          className={`min-w-5 rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none ${
            selected ? "bg-white text-plum" : "bg-plum text-white"
          }`}
          aria-label={`${newCount} new`}
        >
          {newCount}
        </span>
      )}
    </button>
  );
}

// /admin?tab=messages&status=new&page=2
// Tab, filter and page live in the URL, so a refresh keeps your place.
export default function AdminDashboard() {
  usePageTitle("Dashboard");
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabKey = searchParams.get("tab") === "messages" ? "messages" : "leads";
  const tab = ENQUIRY_TABS[tabKey];
  const status = tab.statuses.includes(searchParams.get("status")) ? searchParams.get("status") : "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  // "new" count per tab, shown as a badge so nothing waits unseen on the other tab.
  // limit=1: only pagination.total is needed.
  const newLeads = useFetch(() => getLeads({ status: "new", limit: 1 }), []);
  const newMessages = useFetch(() => getMessages({ status: "new", limit: 1 }), []);
  const newCounts = { leads: newLeads.pagination?.total ?? 0, messages: newMessages.pagination?.total ?? 0 };
  const refreshCounts = () => {
    newLeads.refetch();
    newMessages.refetch();
  };

  // "leads" is the default tab, and empty values are left out, so URLs stay short
  const setParams = ({ tab: nextTab = tabKey, status: nextStatus = "", page: nextPage = 1 }) => {
    const params = {};
    if (nextTab !== "leads") params.tab = nextTab;
    if (nextStatus) params.status = nextStatus;
    if (nextPage > 1) params.page = String(nextPage);
    setSearchParams(params);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="text-4xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-600">Signed in as {user.email}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-white p-1 ring-1 ring-black/5" role="tablist" aria-label="Enquiry type">
          {Object.entries(ENQUIRY_TABS).map(([key, t]) => (
            <TabButton
              key={key}
              tab={t}
              selected={key === tabKey}
              newCount={newCounts[key]}
              // A new tab starts unfiltered on page 1: the two tabs use different statuses
              onClick={() => setParams({ tab: key })}
            />
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          Status
          <select
            value={status}
            onChange={(e) => setParams({ status: e.target.value })}
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
        onPageChange={(p) => setParams({ status, page: p })}
        onStatusChanged={refreshCounts}
      />
    </section>
  );
}
