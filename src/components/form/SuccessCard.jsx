import { CheckCircle2 } from "lucide-react";

// Shown in place of a form after it was sent. Put follow-up buttons inside as children.
export default function SuccessCard({ title, text, children }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5"
      role="status"
    >
      <CheckCircle2 size={48} className="text-green-600" />
      <h2 className="mt-3 text-3xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{text}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  );
}
