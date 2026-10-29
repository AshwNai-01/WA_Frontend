import { Inbox } from "lucide-react";
import useFetch from "../../../hooks/useFetch";
import DataTable from "../../../components/DataTable";
import LoadError from "../../../components/LoadError";
import Pagination from "../../../components/Pagination";

const PAGE_SIZE = 10;

function EmptyMessage({ text }) {
  return (
    <>
      <Inbox size={36} className="mx-auto text-gray-300" />
      <p className="mt-2 font-medium text-gray-900">{text}</p>
      <p className="text-sm text-gray-500">New submissions from the website will appear here.</p>
    </>
  );
}

// One tab's list: count, table and pagination.
// The dashboard remounts it (key) when the tab changes, so it never shows the other tab's rows.
export default function EnquiryPanel({ tab, status, page, onPageChange, onStatusChanged }) {
  const { data: rows, pagination, loading, error, refetch } = useFetch(
    () => tab.fetch({ status, page, limit: PAGE_SIZE }),
    [status, page]
  );

  // After saving, reload this page (the row may no longer match the status filter)
  // and let the dashboard refresh its "new" badges
  const saveStatus = async (id, nextStatus) => {
    await tab.update(id, nextStatus);
    refetch();
    onStatusChanged();
  };

  if (error) {
    return (
      <div className="mt-6">
        <LoadError title="Couldn't load enquiries" message={error} onRetry={refetch} />
      </div>
    );
  }

  const total = pagination?.total;

  return (
    <>
      <p className="mt-4 text-sm text-gray-600" aria-live="polite">
        {pagination ? `${total} ${total === 1 ? "entry" : "entries"}` : " "}
      </p>

      <div className="mt-2">
        {loading && !rows ? (
          <div className="h-64 animate-pulse rounded-2xl bg-white ring-1 ring-black/5" aria-hidden="true" />
        ) : (
          <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
            <DataTable
              columns={tab.columns(saveStatus)}
              rows={rows}
              empty={<EmptyMessage text={status ? "Nothing with this status" : tab.emptyText} />}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={pagination?.totalPages} onChange={onPageChange} />
      </div>
    </>
  );
}
