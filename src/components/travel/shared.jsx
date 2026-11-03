"use client";

// 三欄入口和各洲故事頁共用的地圖工具、配色和卡片

import { useEffect, useState } from "react";
import Image from "next/image";

export const NAV_H = 72; // Navbar 高度
export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_ARRAY = [0.22, 1, 0.36, 1];

// 柔和的紙感配色：沒去過的國家只比背景深一點點；去過的是淡淡的陶土色，文章越多稍深一些
export const PALETTE = {
  neutral: "#ebe5da",
  stroke: "#f8f4ee",
  visitedStroke: "rgba(170,120,90,0.22)",
  travelLight: "#ecd9c8",
  travelDark: "#d9b49a",
  muted: "#f0e5da",
  focus: "#c4896b",
  ink: "#29251f",
};

const ANTARCTICA_ID = "010";
const FRANCE_ID = "250";

export const plural = (n, one, many) => (n === 1 ? one : many);

export function mixHex(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

// 法國的 MultiPolygon 包含南美、非洲的海外領土，分開才不會讓大片海域跟著法國一起縮放
function splitFranceOverseas(features) {
  const isMetropolitan = (polygon) => {
    const [lon, lat] = polygon[0][0];
    return lon > -10 && lon < 20 && lat > 35 && lat < 55;
  };
  return features.flatMap((f) => {
    if (String(f.id) !== FRANCE_ID || f.geometry?.type !== "MultiPolygon") return [f];
    const polygons = f.geometry.coordinates;
    return [
      { ...f, geometry: { type: "MultiPolygon", coordinates: polygons.filter(isMetropolitan) } },
      { type: "Feature", id: "250-overseas", properties: {}, geometry: { type: "MultiPolygon", coordinates: polygons.filter((p) => !isMetropolitan(p)) } },
    ];
  });
}

// 只取面積最大的那塊陸地（例如美國本土），縮放時才不會為了阿拉斯加把美國縮很小
export function mainland(d3, f) {
  if (f.geometry.type !== "MultiPolygon") return f;
  const largest = f.geometry.coordinates
    .map((coordinates) => ({ coordinates, area: d3.geoArea({ type: "Polygon", coordinates }) }))
    .sort((a, b) => b.area - a.area)[0];
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: largest.coordinates } };
}

// detail: "110m" 給入口的小輪廓，"50m" 給故事頁的大地圖
const geoCache = {};
export function loadGeo(detail = "50m") {
  geoCache[detail] ??= Promise.all([
    import("d3-geo"),
    import("topojson-client"),
    detail === "110m" ? import("world-atlas/countries-110m.json") : import("world-atlas/countries-50m.json"),
  ]).then(([d3, { feature }, atlas]) => {
    const world = atlas.default ?? atlas;
    const features = splitFranceOverseas(feature(world, world.objects.countries).features).filter(
      (f) => f.id !== ANTARCTICA_ID
    );
    return { d3, features };
  });
  return geoCache[detail];
}

export function useGeo(detail) {
  const [geo, setGeo] = useState(null);
  useEffect(() => {
    let cancelled = false;
    loadGeo(detail).then((data) => !cancelled && setGeo(data));
    return () => {
      cancelled = true;
    };
  }, [detail]);
  return geo;
}

// 把洲的經緯度範圍放進畫面：用四個角的 MultiPoint 來 fit，不用管多邊形的方向
export function extentFeature([[west, south], [east, north]]) {
  return { type: "MultiPoint", coordinates: [[west, south], [east, north], [west, north], [east, south]] };
}

// 把地圖上的範圍 bounds 放進畫面上的 box，回傳 CSS transform 用的 { k, x, y }
export function fitTransform([[x0, y0], [x1, y1]], [[bx0, by0], [bx1, by1]], maxZoom = 8) {
  const k = Math.max(1, Math.min(maxZoom, (bx1 - bx0) / Math.max(1, x1 - x0), (by1 - by0) / Math.max(1, y1 - y0)));
  return { k, x: (bx0 + bx1) / 2 - (k * (x0 + x1)) / 2, y: (by0 + by1) / 2 - (k * (y0 + y1)) / 2 };
}

export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { width, height } = entry.contentRect;
        setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref]);
  return size;
}

const SEASONS = [
  { months: [3, 4, 5], en: "Spring", zh: "春" },
  { months: [6, 7, 8], en: "Summer", zh: "夏" },
  { months: [9, 10, 11], en: "Autumn", zh: "秋" },
  { months: [12, 1, 2], en: "Winter", zh: "冬" },
];

function seasonOf(date) {
  const month = Number(date.slice(5, 7));
  return SEASONS.find((season) => season.months.includes(month)) || null;
}

// 國家第一次去的日期（文章裡最早的）
export function firstDate(country) {
  return country.posts.map((post) => post.date).filter(Boolean).sort()[0] || "";
}

// 城市依第一次去的時間排序並編號，地圖圖釘、路線和時間軸共用這個順序
export function orderCities(country) {
  const dateOf = new Map(country.posts.map((post) => [post.path, post.date]));
  const typeOf = new Map(country.posts.map((post) => [post.path, post.type]));
  return country.cities
    .map((city) => ({
      ...city,
      first: city.posts.map((path) => dateOf.get(path) || "").filter(Boolean).sort()[0] || "",
      // 只有照片集、還沒有文章的城市，地圖上畫空心圖釘
      photosOnly: city.posts.every((path) => typeOf.get(path) === "photos"),
    }))
    .sort((a, b) => a.first.localeCompare(b.first))
    .map((city, index) => ({ ...city, number: index + 1 }));
}

// 時間軸：新的在前，同一年同一季的文章放在一起
export function groupByTrip(posts) {
  const groups = [];
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    const season = seasonOf(post.date);
    const key = `${year}-${season?.en ?? ""}`;
    const last = groups[groups.length - 1];
    if (last?.key === key) last.posts.push(post);
    else groups.push({ key, year, season, posts: [post] });
  }
  return groups;
}

// 兩點之間畫一條微彎的弧線，看起來像手繪的路線
export function routePath(points) {
  return points
    .map((point, index) => {
      if (index === 0) return `M${point.x},${point.y}`;
      const prev = points[index - 1];
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      const bend = 0.18;
      const cx = (prev.x + point.x) / 2 - dy * bend;
      const cy = (prev.y + point.y) / 2 + dx * bend;
      return `Q${cx},${cy} ${point.x},${point.y}`;
    })
    .join(" ");
}

export function PassportStamp({ country }) {
  const year = firstDate(country).slice(0, 4);
  return (
    <div className="rounded-[5px] border-[1.5px] border-[#9a5a3e]/85 bg-[#f8f3ea]/92 p-[3px] shadow-[0_6px_20px_-10px_rgba(70,40,20,0.35)] backdrop-blur-sm">
      <div className="whitespace-nowrap rounded-[3px] border border-dashed border-[#9a5a3e]/50 px-4 py-1.5 text-center text-[#9a5a3e]">
        <p className="text-[8.5px] font-semibold uppercase tracking-[0.34em]">{year ? `Arrived · ${year}` : "Arrived"}</p>
        <p className="mt-0.5 font-serif text-[17px] uppercase leading-tight tracking-[0.14em]">{country.name.en}</p>
        <p className="mt-0.5 text-[10px] tracking-[0.24em] text-[#9a5a3e]/80">
          {country.name.zh} · {country.postCount} {plural(country.postCount, "story", "stories")}
        </p>
      </div>
    </div>
  );
}

// 照片集的封面：一大兩小的拼貼
function PhotoMosaic({ photos, title, eager }) {
  return (
    <div className="absolute inset-0 grid grid-cols-[2fr_1fr] grid-rows-2 gap-[3px] bg-[#f4efe6]">
      {photos.slice(0, 3).map((src, index) => (
        <div key={src} className={["relative overflow-hidden", index === 0 ? "row-span-2" : ""].join(" ")}>
          <Image
            src={src}
            alt={index === 0 ? title : ""}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={index === 0 ? "(min-width: 1024px) 15vw, 66vw" : "(min-width: 1024px) 8vw, 33vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        </div>
      ))}
    </div>
  );
}

export function CityNumber({ number }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold tracking-normal text-white tabular-nums"
      style={{ backgroundColor: PALETTE.focus }}
    >
      {number}
    </span>
  );
}

// 時間軸上的一篇文章：字體和配色跟 Life / Travel 文章列表一致，寬螢幕時照片在左、文字在右
export function PostCard({ post, cityNumbers, highlighted, eager }) {
  const cities = post.citySlugs
    .map((slug, index) => ({ slug, name: post.cityNames[index], number: cityNumbers.get(slug) }))
    .filter((city) => city.name);
  return (
    <a href={`/travel/articles/${post.path}`} id={`post-${post.path}`} className="group relative block scroll-mt-28">
      <span
        aria-hidden
        className={[
          "absolute -inset-4 -z-10 bg-white/55 shadow-[0_14px_36px_-16px_rgba(60,45,30,0.3)] transition-opacity duration-500",
          highlighted ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <article className="grid gap-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-7">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd5c8]">
          {post.type === "photos" && post.preview.length >= 3 ? (
            <PhotoMosaic photos={post.preview} title={post.title} eager={eager} />
          ) : post.image || post.preview[0] ? (
            <Image
              src={post.image || post.preview[0]}
              alt={post.title}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
          ) : (
            <div className="absolute inset-3 flex items-center justify-center border border-dashed border-[#bfb3a2]">
              <span className="font-serif text-lg italic text-[#9a8f80]">To be continued…</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.035]" />
        </div>
        <div className="min-w-0 sm:py-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#817769] tabular-nums">
            {post.date}
            {post.type === "photos" && <span className="ml-3 text-[#c4896b]">Photos · {post.photoCount}</span>}
          </p>
          <h3 className="mt-2.5 font-serif text-[1.45rem] font-normal leading-[1.25] tracking-[-0.018em] text-[#29251f] transition-colors duration-300 group-hover:text-[#456b9b]">
            {post.title}
          </h3>
          {post.type !== "photos" && post.description && (
            <p className="mt-2.5 line-clamp-3 font-serif text-[15px] leading-7 text-[#6b645a]">{post.description}</p>
          )}
          {cities.length > 0 && (
            <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
              {cities.map((city) => (
                <li key={city.slug} className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#476c9d]">
                  {city.number && <CityNumber number={city.number} />}
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </a>
  );
}

// 一個國家的時間軸
export function Timeline({ posts, cityNumbers, highlightedPath, eagerCount = 0 }) {
  let index = 0;
  return (
    <ol className="space-y-12">
      {groupByTrip(posts).map((trip) => (
        <li key={trip.key}>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-[1.5rem] leading-none tracking-[-0.01em] text-[#29251f] tabular-nums">{trip.year}</span>
            {trip.season && (
              <span className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#817769]">
                {trip.season.en} · {trip.season.zh}
              </span>
            )}
            <span aria-hidden className="h-px flex-1 translate-y-[-4px] bg-[#786f63]/20" />
          </div>
          <ol className="ml-1 mt-7 space-y-12 border-l border-[#786f63]/25 pl-7">
            {trip.posts.map((post) => (
              <li key={post.path} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[32px] top-1.5 h-[9px] w-[9px] rounded-full border-2 bg-[#f4efe6]"
                  style={{ borderColor: PALETTE.focus }}
                />
                <PostCard post={post} cityNumbers={cityNumbers} eager={index++ < eagerCount} highlighted={post.path === highlightedPath} />
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
