"use client";

// 旅遊入口：三大洲並排，滑過的那一欄變寬、照片轉成彩色，點進去是那一洲的故事

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, EASE_ARRAY, NAV_H, PALETTE, extentFeature, plural, useGeo } from "@/components/travel/shared";

// 欄寬跟去過的國家數有關，但開根號讓只有一個國家的洲也不會太窄
const columnWeight = (continent) => 1 + Math.sqrt(continent.chapters.length);

// 輪廓用固定的 viewBox 畫一次就好：欄寬在動畫中一直變，若跟著容器尺寸重算 240 條路徑會很卡
const SIL_W = 600;
const SIL_H = 440;
const SIL_MASK = "radial-gradient(ellipse 72% 70% at 50% 50%, #000 55%, transparent 100%)";
const TINY_AREA = 40; // 小到看不見的國家（例如阿聯）另外畫一個圓點

function Silhouette({ geo, continent }) {
  const shapes = useMemo(() => {
    if (!geo) return null;
    const visitedIds = new Set(continent.chapters.map((country) => country.id));
    const projection = geo.d3.geoMercator().fitExtent([[10, 10], [SIL_W - 10, SIL_H - 10]], extentFeature(continent.extent));
    const pathOf = geo.d3.geoPath(projection);
    const paths = geo.features.map((f, index) => ({ key: `${f.id ?? "x"}-${index}`, d: pathOf(f), visited: visitedIds.has(f.id) }));
    const dots = geo.features
      .filter((f) => visitedIds.has(f.id) && pathOf.area(f) < TINY_AREA)
      .map((f) => ({ key: f.id, at: pathOf.centroid(f) }));
    return { paths, dots };
  }, [geo, continent]);

  if (!shapes) return null;
  return (
    <motion.svg
      viewBox={`0 0 ${SIL_W} ${SIL_H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      style={{ maskImage: SIL_MASK, WebkitMaskImage: SIL_MASK }}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 沒去過的只畫細線，去過的才填色，一眼分得出來 */}
      {shapes.paths.map(({ key, d, visited }) => (
        <path
          key={key}
          d={d}
          fill={visited ? PALETTE.travelDark : "none"}
          stroke={visited ? PALETTE.visitedStroke : "rgba(120,105,85,0.28)"}
          strokeWidth="0.7"
        />
      ))}
      {shapes.dots.map(({ key, at }) => (
        <g key={key}>
          <circle cx={at[0]} cy={at[1]} r="11" fill={PALETTE.travelDark} opacity="0.2" />
          <circle cx={at[0]} cy={at[1]} r="4.5" fill={PALETTE.travelDark} />
        </g>
      ))}
    </motion.svg>
  );
}

function ContinentColumn({ continent, index, geo, active, dimmed, onHover }) {
  const [first, last] = continent.years;
  const years = first ? (first === last ? first : `${first} – ${last}`) : "";
  return (
    <Link
      href={`/travel/continent/${continent.slug}`}
      onMouseEnter={() => onHover(continent.slug)}
      onFocus={() => onHover(continent.slug)}
      className="group relative flex min-h-[52vh] flex-col overflow-hidden border-[#786f63]/15 outline-none lg:min-h-0 lg:border-l lg:first:border-l-0"
      style={{
        flexGrow: columnWeight(continent) * (active ? 1.45 : 1),
        flexBasis: 0,
        transition: `flex-grow 700ms ${EASE}`,
      }}
    >
      {/* 平常只有紙和地圖；滑過時照片淡入、地圖退成淡淡的輪廓。只動 opacity 和 transform，不會卡 */}
      {continent.cover && (
        <Image
          src={continent.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={[
            "object-cover transition-[opacity,transform] duration-[900ms] ease-out",
            active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
          ].join(" ")}
        />
      )}
      <div
        className={[
          "absolute inset-0 bg-gradient-to-b transition-opacity duration-700",
          "from-[#f4efe6]/10 via-[#f4efe6]/55 via-60% to-[#f4efe6]",
          active ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div
        className={[
          "absolute inset-x-[8%] bottom-[36%] top-[6%] transition-opacity duration-700",
          active ? "opacity-0" : dimmed ? "opacity-50" : "opacity-100",
        ].join(" ")}
      >
        <Silhouette geo={geo} continent={continent} />
      </div>

      <div className="relative mt-auto px-6 pb-10 sm:px-10 lg:pb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-3 font-serif text-5xl font-normal tracking-[-0.025em] text-[#29251f] transition-colors duration-500 group-hover:text-[#456b9b] sm:text-6xl">
          {continent.name.en}
        </h2>
        <p className="mt-2 font-serif text-xl tracking-[0.14em] text-[#6b645a]">{continent.name.zh}</p>
        <p className="mt-5 font-serif text-[15px] italic text-[#6b645a]">
          {continent.chapters.length} {plural(continent.chapters.length, "country", "countries")} · {continent.postCount}{" "}
          {plural(continent.postCount, "story", "stories")}
          {years && ` · ${years}`}
        </p>
        <span className="mt-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-[#476c9d]">
          Explore
          <span aria-hidden className="h-px w-8 bg-current transition-all duration-500 group-hover:w-14" />
        </span>
      </div>
    </Link>
  );
}

export default function ContinentGate({ continents, summary }) {
  const geo = useGeo("110m");
  const [hovered, setHovered] = useState(null);
  const visible = continents.filter((continent) => continent.chapters.length > 0);

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#f4efe6] lg:h-[100dvh]" style={{ paddingTop: NAV_H }}>
      <motion.header
        className="px-5 pb-8 pt-10 text-center sm:pt-12"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: EASE_ARRAY }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968]">Personal Journal</p>
        <h1 className="mt-4 font-serif text-5xl font-normal tracking-[-0.025em] text-[#29251f] sm:text-6xl">Travel Journal</h1>
        <div className="mx-auto mt-6 h-px w-14 bg-[#786f63]/35" />
        <p className="mt-4 font-serif text-[15px] italic text-[#6b645a]">
          {summary.countries} {plural(summary.countries, "country", "countries")} · {summary.cities}{" "}
          {plural(summary.cities, "city", "cities")}
          {summary.since && ` · since ${summary.since}`}
        </p>
      </motion.header>

      <motion.nav
        aria-label="Continents"
        className="flex flex-1 flex-col border-t border-[#786f63]/15 lg:min-h-0 lg:flex-row"
        onMouseLeave={() => setHovered(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        {visible.map((continent, index) => (
          <ContinentColumn
            key={continent.slug}
            continent={continent}
            index={index}
            geo={geo}
            active={hovered === continent.slug}
            dimmed={hovered !== null && hovered !== continent.slug}
            onHover={setHovered}
          />
        ))}
      </motion.nav>
    </main>
  );
}
