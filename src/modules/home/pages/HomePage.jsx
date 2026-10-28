import { useOutletContext } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import PremierVendors from "../components/PremierVendors";
import TopCategories from "../components/TopCategories";
import PlanByCity from "../components/PlanByCity";
import PerfectPlaces from "../components/PerfectPlaces";

// Categories and cities are fetched once in MainLayout and shared here.
// Sections that show loading/error states get the whole fetch result;
// the others only need the list.
export default function HomePage() {
  const { categories, cities } = useOutletContext();
  const categoryList = categories.data ?? [];
  const cityList = cities.data ?? [];

  return (
    <>
      <HeroSection categories={categoryList} cities={cityList} />
      <StatsSection cityCount={cityList.length} />
      <PremierVendors categories={categoryList} cities={cityList} />
      <TopCategories categories={categories} />
      <PlanByCity cities={cities} />
      <PerfectPlaces cities={cities} />
    </>
  );
}
