import { notFound } from "next/navigation";
import ContinentStory from "@/components/travel/ContinentStory";
import { CONTINENTS, getContinentStories } from "@/lib/travel";

export default async function ContinentPage({ params }) {
  const { category, continentSlug } = await params;
  if (category !== "travel") notFound();

  const stories = getContinentStories().filter((story) => story.chapters.length > 0);
  const continent = stories.find((story) => story.slug === continentSlug);
  if (!continent) notFound();

  const others = stories.filter((story) => story.slug !== continentSlug).map(({ slug, name }) => ({ slug, name }));
  return <ContinentStory continent={continent} others={others} />;
}

// 父層 [category] 會對每個分類各呼叫一次，只有 travel 有洲的頁面
export async function generateStaticParams({ params }) {
  if (params.category !== "travel") return [];
  return CONTINENTS.map((continent) => ({ continentSlug: continent.slug }));
}
