// Table built from a list of columns:
//   const columns = [
//     { header: "Name", cell: (row) => row.name, className: "font-medium" },
//     { header: "City", cell: (row) => row.city?.name ?? "—" },
//   ];
//   <DataTable columns={columns} rows={rows} empty={<p>No rows</p>} />
// Wide tables scroll sideways inside their box on small screens.
export default function DataTable({ columns, rows, empty }) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5">
      <table className="w-full min-w-[860px] divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center">
                {empty}
              </td>
            </tr>
          )}

          {rows.map((row) => (
            <tr key={row._id} className="hover:bg-gray-50/60">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 align-top text-sm text-gray-700 ${col.className ?? ""}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
