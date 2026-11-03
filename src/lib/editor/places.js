// 編輯器新增國家和城市：寫進 src/data/travel-places.json，旅遊地圖和時間軸都從這裡讀。

import fs from "fs/promises";
import path from "path";
import atlas from "world-atlas/countries-50m.json";
import { CONTINENTS } from "@/lib/travel";
import { SLUG_PATTERN } from "@/lib/editor/articles";

const FILE = path.join(process.cwd(), "src", "data", "travel-places.json");

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function readPlaces() {
  return JSON.parse(await fs.readFile(FILE, "utf-8"));
}

async function writePlaces(places) {
  await fs.writeFile(FILE, `${JSON.stringify(places, null, 2)}\n`);
  return places;
}

// 地圖上畫得出來的國家（world-atlas 的名字和代碼），新增國家時從這裡挑
export function atlasCountries() {
  return atlas.objects.countries.geometries
    .filter((country) => country.id)
    .map((country) => ({ id: country.id, name: country.properties.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function addCountry({ id, zh, continent }) {
  const match = atlasCountries().find((country) => country.id === id);
  if (!match) throw new Error("地圖上找不到這個國家");
  if (!CONTINENTS.some((item) => item.slug === continent)) throw new Error("請選擇洲");
  if (!String(zh || "").trim()) throw new Error("請填中文名稱");
  const places = await readPlaces();
  if (places.countries.some((country) => country.id === id)) throw new Error(`${match.name} 已經在清單裡了`);
  const slug = slugify(match.name);
  places.countries.push({ slug, continent, id, name: { zh: zh.trim(), en: match.name } });
  await writePlaces(places);
  return { ...places, added: slug };
}

// 座標可以直接貼 Google 地圖右鍵複製的「48.137, 11.575」
export function parseCoordinates(text) {
  const numbers = String(text || "").match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  if (!numbers || numbers.length < 2) return null;
  const [lat, lon] = numbers;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat: Math.round(lat * 1000) / 1000, lon: Math.round(lon * 1000) / 1000 };
}

export async function addCity({ country, zh, en, coordinates, slug }) {
  const places = await readPlaces();
  if (!places.countries.some((item) => item.slug === country)) throw new Error("請先選國家");
  if (!String(zh || "").trim() || !String(en || "").trim()) throw new Error("請填中文和英文名稱");
  const point = parseCoordinates(coordinates);
  if (!point) throw new Error("座標格式看不懂，請貼像「48.137, 11.575」這樣的緯度、經度");
  const citySlug = slug?.trim() || slugify(en);
  if (!SLUG_PATTERN.test(citySlug)) throw new Error("城市代號只能用小寫英文、數字和連字號");
  if (places.cities.some((city) => city.slug === citySlug)) throw new Error(`已經有 ${citySlug} 了`);
  places.cities.push({ slug: citySlug, country, name: { zh: zh.trim(), en: en.trim() }, ...point });
  await writePlaces(places);
  return { ...places, added: citySlug };
}
