import { notFound, redirect } from "next/navigation";
import { getCountry } from "@/lib/travel";

// 舊的國家網址導到那一洲的故事頁，直接捲到那一章
export default async function CountryPage({ params }) {
  const { category, countrySlug } = await params;
  const country = category === "travel" ? getCountry(countrySlug) : null;
  if (!country) notFound();
  redirect(`/travel/continent/${country.continent}#${country.slug}`);
}
