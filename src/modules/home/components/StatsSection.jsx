import useFetch from "../../../hooks/useFetch";
import { getVendors } from "../../vendors/services/vendorApi";
import { COMPANY_STATS } from "../../../utils/constants";
import SectionHeading from "../../common/components/SectionHeading";

// "Trusted Across Rajasthan": fixed business figures plus live vendor and city counts
export default function StatsSection({ cityCount }) {
  // limit=1: we only need pagination.total, not the vendors themselves
  const { pagination } = useFetch(() => getVendors({ limit: 1 }), []);

  const stats = [
    { value: COMPANY_STATS.yearsExperience, label: "Years of Experience" },
    { value: COMPANY_STATS.eventsPlanned, label: "Weddings & Events Planned" },
    { value: pagination?.total ?? "—", label: "Verified Vendors" },
    { value: cityCount || "—", label: "Cities We Cover" },
    { value: COMPANY_STATS.happyClients, label: "Happy Clients" },
  ];

  return (
    <section
      className="bg-linear-to-br from-[#fbe7dc] via-cream to-[#e3f4ec] py-16 md:py-20"
      aria-labelledby="stats-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading id="stats-heading" title="Trusted Across Rajasthan">
          A decade of royal weddings, verified vendors and celebrations delivered with confidence.
        </SectionHeading>

        <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              // Odd one out on 2-column phones: span both columns so it sits centered.
              // dt must come before dd in HTML; flex-col-reverse shows the number on top.
              className={`flex flex-col-reverse rounded-2xl bg-white/70 p-5 text-center shadow-sm ring-1 ring-white backdrop-blur ${
                i === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <dt className="mt-1 text-sm text-gray-600">{s.label}</dt>
              <dd className="font-body text-3xl font-bold text-gray-900 md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
