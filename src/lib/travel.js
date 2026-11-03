import fs from "fs";
import path from "path";
import { parseFrontmatter } from "@/lib/markdown";
import places from "@/data/travel-places.json";

// 旅遊入口的三大洲。extent 是地圖要顯示的範圍 [[西, 南], [東, 北]]；
// cover 是入口的封面照，沒寫的話用該洲最新一篇文章的封面
export const CONTINENTS = [
  { slug: "europe", name: { zh: "歐洲", en: "Europe" }, extent: [[-24, 35], [32, 67]] },
  { slug: "asia", name: { zh: "亞洲", en: "Asia" }, extent: [[26, -8], [146, 54]] },
  {
    slug: "americas",
    name: { zh: "美洲", en: "Americas" },
    extent: [[-128, -40], [-45, 58]],
    cover: "https://pub-503a3f28f35c423785d131f4a589a3f0.r2.dev/images/travel/dc-20260620/capitol-2.webp",
  },
];

// 去過的國家和城市存在 src/data/travel-places.json，編輯器可以直接新增。
// 國家的 id 是 world-atlas 用的 ISO 3166-1 數字代碼，continent 對應上面的 slug；
// 城市的 country 對應國家 slug，lat/lon 用來在地圖上標點。
export const COUNTRIES = places.countries;
export const CITIES = places.cities;

const TRAVEL_DIR = path.join(process.cwd(), "public", "article", "travel");

function clean(value) {
  return typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : value;
}

function splitList(value) {
  return value ? String(value).split(",").map((item) => item.trim()).filter(Boolean) : [];
}

// 讀所有遊記的 frontmatter，用 country / cities 欄位分類
export function getTravelPosts() {
  return fs
    .readdirSync(TRAVEL_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { metadata, body } = parseFrontmatter(fs.readFileSync(path.join(TRAVEL_DIR, file), "utf-8"));
      const meta = Object.fromEntries(Object.entries(metadata).map(([k, v]) => [k, clean(v)]));
      return {
        path: path.parse(file).name,
        title: meta.title || path.parse(file).name,
        date: meta.date || "",
        image: meta.image || "",
        description: meta.description || "",
        country: meta.country || "",
        cities: splitList(meta.cities),
        type: meta.type === "photos" ? "photos" : "article",
        // 照片集的卡片用前幾張照片拼貼
        photos: [...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]),
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getCountry(slug) {
  return COUNTRIES.find((country) => country.slug === slug) || null;
}

// 每個國家的文章數，給地圖上色和國家列表用；沒有文章的國家不會出現
export function getVisitedCountries(posts = getTravelPosts()) {
  return COUNTRIES.map((country) => {
    const countryPosts = posts.filter((post) => post.country === country.slug);
    const cities = CITIES.filter((city) => city.country === country.slug);
    return {
      ...country,
      postCount: countryPosts.length,
      cityCount: cities.filter((city) => countryPosts.some((post) => post.cities.includes(city.slug))).length,
      latestImage: countryPosts[0]?.image || "",
    };
  }).filter((country) => country.postCount > 0);
}

// 地圖用的完整資料：每個去過的國家、它的城市（地圖標記），和文章（側欄卡片，新的在前）
export function getExplorerCountries(posts = getTravelPosts()) {
  return getVisitedCountries(posts).map((country) => {
    const { groups } = getCountryCities(country.slug, posts);
    return {
      ...country,
      cities: groups.map(({ slug, name, lat, lon, posts: cityPosts }) => ({
        slug,
        name,
        lat,
        lon,
        posts: cityPosts.map((post) => post.path),
      })),
      posts: posts
        .filter((post) => post.country === country.slug)
        .map(({ path, title, date, image, description, cities, type, photos }) => ({
          path,
          title,
          date,
          image,
          description,
          citySlugs: cities,
          type,
          photoCount: photos.length,
          preview: photos.slice(0, 3),
          cityNames: cities.map((slug) => CITIES.find((city) => city.slug === slug)?.name.en).filter(Boolean),
        })),
    };
  });
}

// 國家頁：依城市分組，沒標城市的文章放在最後
export function getCountryCities(countrySlug, posts = getTravelPosts()) {
  const countryPosts = posts.filter((post) => post.country === countrySlug);
  const groups = CITIES.filter((city) => city.country === countrySlug)
    .map((city) => ({ ...city, posts: countryPosts.filter((post) => post.cities.includes(city.slug)) }))
    .filter((city) => city.posts.length > 0);

  const unassigned = countryPosts.filter((post) => !groups.some((city) => city.posts.includes(post)));
  return { groups, unassigned };
}

export function getContinent(slug) {
  return CONTINENTS.find((continent) => continent.slug === slug) || null;
}

const firstDate = (country) => country.posts.map((post) => post.date).filter(Boolean).sort()[0] || "";

// 每一洲的故事：國家依第一次去的時間排成章節，加上封面照、年份範圍和統計
export function getContinentStories(posts = getTravelPosts()) {
  const countries = getExplorerCountries(posts);
  return CONTINENTS.map((continent) => {
    const chapters = countries
      .filter((country) => country.continent === continent.slug)
      .sort((a, b) => firstDate(a).localeCompare(firstDate(b)));
    const continentPosts = chapters.flatMap((country) => country.posts).sort((a, b) => b.date.localeCompare(a.date));
    const years = continentPosts.map((post) => post.date.slice(0, 4)).filter(Boolean).sort();
    return {
      ...continent,
      chapters,
      postCount: continentPosts.length,
      cityCount: chapters.reduce((sum, country) => sum + country.cities.length, 0),
      years: years.length ? [years[0], years[years.length - 1]] : [],
      cover: continent.cover || continentPosts.find((post) => post.image)?.image || "",
    };
  });
}
