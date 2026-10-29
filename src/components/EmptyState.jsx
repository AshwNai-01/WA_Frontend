import { SearchX } from "lucide-react";

// "Nothing here" box. Put action buttons inside as children.
export default function EmptyState({ icon: Icon = SearchX, title, text, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-4 py-14 text-center ring-1 ring-black/5">
      <Icon size={40} className="text-plum/60" />
      <p className="mt-3 text-lg font-medium text-gray-900">{title}</p>
      {text && <p className="mt-1 text-sm text-gray-600">{text}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
