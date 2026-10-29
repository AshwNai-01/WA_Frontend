// Indian date formats for tables: "29 Oct 2026" and "29 Oct 2026, 3:45 pm"
const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export const formatDate = (value) => (value ? dateFormat.format(new Date(value)) : "—");

export const formatDateTime = (value) => (value ? dateTimeFormat.format(new Date(value)) : "—");
