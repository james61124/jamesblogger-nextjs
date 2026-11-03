import ContinentGate from "@/components/travel/ContinentGate";
import { getContinentStories } from "@/lib/travel";

// 旅遊入口：三大洲並排，各自點進去是那一洲的故事
export default function TravelHome() {
  const continents = getContinentStories();
  const chapters = continents.flatMap((continent) => continent.chapters);
  const years = continents.flatMap((continent) => continent.years).sort();

  return (
    <ContinentGate
      continents={continents}
      summary={{
        countries: chapters.length,
        cities: continents.reduce((sum, continent) => sum + continent.cityCount, 0),
        since: years[0] || "",
      }}
    />
  );
}
