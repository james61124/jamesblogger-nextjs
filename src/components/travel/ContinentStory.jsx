"use client";

// 各洲的故事頁：左邊固定一張這一洲的地圖，右邊每個國家是一章。
// 捲到哪一章，地圖就飛到那個國家、畫出城市路線；點地圖上的國家則捲到那一章。

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  EASE,
  EASE_ARRAY,
  NAV_H,
  PALETTE,
  PassportStamp,
  Timeline,
  extentFeature,
  firstDate,
  fitTransform,
  mainland,
  mixHex,
  orderCities,
  plural,
  routePath,
  useElementSize,
  useGeo,
} from "@/components/travel/shared";

const MAP_PAD = 56;
const STAMP_ROOM = 96; // 護照章大約的高度；國家上方放不下就改蓋在下方

const CountryLayer = memo(function CountryLayer({ shapes, activeSlug, onEnter, onLeave, onSelect }) {
  return shapes.map(({ key, d, fill, country, revealDelay }) => {
    if (!country) return <path key={key} d={d} fill={PALETTE.neutral} />;
    const active = country.slug === activeSlug;
    return (
      <path
        key={key}
        d={d}
        style={{ animationDelay: `${revealDelay}ms` }}
        fill={active ? PALETTE.focus : activeSlug ? PALETTE.muted : fill}
        stroke={PALETTE.visitedStroke}
        className="story-country"
        role="link"
        tabIndex={0}
        aria-label={`${country.name.zh} ${country.name.en}`}
        onMouseEnter={() => onEnter(country)}
        onMouseLeave={onLeave}
        onClick={() => onSelect(country.slug)}
        onKeyDown={(event) => event.key === "Enter" && onSelect(country.slug)}
      />
    );
  });
});

function ContinentMap({ continent, active, orderedCities, onSelect, onOverview, onCity }) {
  const box = useRef(null);
  const size = useElementSize(box);
  const geo = useGeo("50m");
  const [hovered, setHovered] = useState(null);
  const countries = continent.chapters;
  const byId = useMemo(() => new Map(countries.map((c) => [c.id, c])), [countries]);

  const map = useMemo(() => {
    if (!geo || !size.width || !size.height) return null;
    const { d3, features } = geo;
    const projection = d3
      .geoMercator()
      .fitExtent([[24, 24], [size.width - 24, size.height - 24]], extentFeature(continent.extent));
    const pathOf = d3.geoPath(projection);
    const maxPosts = Math.max(1, ...countries.map((c) => c.postCount));
    const step = Math.min(160, 900 / Math.max(1, countries.length));

    const shapes = features.map((f, index) => {
      const country = byId.get(f.id) || null;
      const fill = country
        ? mixHex(PALETTE.travelLight, PALETTE.travelDark, maxPosts === 1 ? 1 : (country.postCount - 1) / (maxPosts - 1))
        : PALETTE.neutral;
      // 章節已經照第一次去的時間排好，載入時就照這個順序一個一個亮起來
      const revealDelay = country ? 250 + countries.indexOf(country) * step : 0;
      return { key: `${f.id ?? "x"}-${index}`, d: pathOf(f), fill, country, revealDelay };
    });
    const mainBounds = new Map(
      features.filter((f) => byId.has(f.id)).map((f) => [byId.get(f.id).slug, pathOf.bounds(mainland(d3, f))])
    );
    return { projection, shapes, mainBounds };
  }, [geo, size.width, size.height, continent.extent, countries, byId]);

  // 沒有章節在畫面上時看整個洲，有的話飛到那個國家
  const view = useMemo(() => {
    const bounds = active && map?.mainBounds.get(active.slug);
    if (!bounds) return { k: 1, x: 0, y: 0 };
    return fitTransform(bounds, [[MAP_PAD, MAP_PAD], [size.width - MAP_PAD, size.height - MAP_PAD]], 6);
  }, [active, map, size]);

  const markers = useMemo(() => {
    if (!map || !active) return [];
    return orderedCities.map((city) => {
      const [px, py] = map.projection([city.lon, city.lat]);
      return { ...city, x: px * view.k + view.x, y: py * view.k + view.y };
    });
  }, [map, active, orderedCities, view]);

  const hoverLabel = useMemo(() => {
    const bounds = hovered && map?.mainBounds.get(hovered.slug);
    if (!bounds) return null;
    const [[x0, y0], [x1, y1]] = bounds;
    const top = y0 * view.k + view.y;
    const below = top < STAMP_ROOM;
    const x = Math.min(size.width - 110, Math.max(110, ((x0 + x1) / 2) * view.k + view.x));
    return { x, y: below ? y1 * view.k + view.y + 12 : top - 12, below };
  }, [hovered, map, view, size.width]);

  const onEnter = useCallback((country) => setHovered(country), []);
  const onLeave = useCallback(() => setHovered(null), []);

  return (
    <div ref={box} className="relative h-full w-full overflow-hidden">
      {map && (
        <svg viewBox={`0 0 ${size.width} ${size.height}`} className="block h-full w-full" role="img" aria-label={`${continent.name.zh}地圖`}>
          <style>{`
            .story-map path { vector-effect: non-scaling-stroke; }
            .story-country { cursor: pointer; outline: none; transition: fill 450ms ${EASE}; animation: story-reveal 900ms ${EASE} backwards; }
            .story-country:hover { transition-duration: 180ms; }
            .story-country:hover, .story-country:focus-visible { fill: ${PALETTE.focus}; }
            @keyframes story-reveal { from { fill: ${PALETTE.neutral}; } }
          `}</style>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <g
              className="story-map"
              stroke={PALETTE.stroke}
              strokeWidth="0.75"
              style={{
                transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
                transformOrigin: "0 0",
                transition: `transform 900ms ${EASE}`,
                willChange: "transform",
              }}
            >
              <CountryLayer shapes={map.shapes} activeSlug={active?.slug} onEnter={onEnter} onLeave={onLeave} onSelect={onSelect} />
            </g>
          </motion.g>

          {/* 旅行路線：依造訪順序把城市連起來，地圖飛到定位後慢慢畫出來 */}
          <AnimatePresence>
            {markers.length > 1 && (
              <motion.path
                key={`route-${active.slug}`}
                d={routePath(markers)}
                fill="none"
                stroke={PALETTE.focus}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.75"
                className="pointer-events-none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1, transition: { delay: 0.85, duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {markers.map((city) => (
              <motion.g
                key={`${active.slug}-${city.slug}`}
                className="cursor-pointer"
                role="link"
                aria-label={`${city.name.zh} ${city.name.en}`}
                onClick={() => onCity(city)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.35 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <circle cx={city.x} cy={city.y} r="15" fill={PALETTE.focus} opacity="0.12" />
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="9"
                  fill={city.photosOnly ? "#f8f3ea" : PALETTE.focus}
                  stroke={city.photosOnly ? PALETTE.focus : "#fff"}
                  strokeWidth="1.5"
                />
                <text
                  x={city.x}
                  y={city.y + 3.5}
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  fill={city.photosOnly ? PALETTE.focus : "#fff"}
                  className="tabular-nums"
                >
                  {city.number}
                </text>
                <text
                  x={city.x + 15}
                  y={city.y + 4}
                  fontSize="13"
                  fill={PALETTE.ink}
                  stroke="rgba(246,241,232,0.9)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  className="font-serif"
                >
                  {city.name.zh} {city.name.en}
                  {city.photosOnly && " · Photos"}
                </text>
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      )}

      {/* 紙張紋理 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.12) 0.65px, transparent 0)", backgroundSize: "6px 6px" }}
      />

      <AnimatePresence>
        {hoverLabel && hovered && (
          <motion.div
            key={hovered.slug}
            className="pointer-events-none absolute z-20"
            style={{ left: hoverLabel.x, top: hoverLabel.y, x: "-50%", y: hoverLabel.below ? 0 : "-100%" }}
            initial={{ opacity: 0, scale: 1.25, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: EASE_ARRAY }}
          >
            <PassportStamp country={hovered} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 地圖右下角的章節列：現在讀到哪一章，點刻度可以跳過去 */}
      <div className="absolute bottom-5 right-6 flex flex-col items-end gap-2.5 [text-shadow:0_0_6px_#f4efe6]">
        <AnimatePresence mode="wait">
          <motion.p
            key={active?.slug ?? "all"}
            className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#817769]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {active && countries.length > 1 ? (
              <>
                <button type="button" onClick={onOverview} className="transition-colors duration-200 hover:text-[#29251f]">
                  ← {continent.name.en}
                </button>
                <span className="mx-2 text-[#bfb3a2]">/</span>
                {String(countries.indexOf(active) + 1).padStart(2, "0")} · {active.name.en}
              </>
            ) : (
              `${continent.name.en} · ${continent.name.zh}`
            )}
          </motion.p>
        </AnimatePresence>
        {countries.length > 1 && (
          <ol className="flex items-center gap-1.5">
            {/* 第一格回到整個洲的全覽 */}
            <li>
              <button
                type="button"
                onClick={onOverview}
                aria-label={`${continent.name.en} overview`}
                title={`${continent.name.en} ${continent.name.zh}`}
                className="mr-1.5 flex h-6 items-center"
              >
                <span
                  className="block h-2 w-2 rounded-full border transition-colors duration-500"
                  style={{
                    borderColor: active ? "rgba(120,105,85,0.45)" : PALETTE.focus,
                    backgroundColor: active ? "transparent" : PALETTE.focus,
                  }}
                />
              </button>
            </li>
            {countries.map((country, index) => {
              const current = country.slug === active?.slug;
              return (
                <li key={country.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(country.slug)}
                    aria-label={`Chapter ${index + 1}: ${country.name.en}`}
                    aria-current={current ? "step" : undefined}
                    title={`${country.name.en} ${country.name.zh}`}
                    className="group flex h-6 items-center"
                  >
                    <span
                      className="block h-[2px] rounded-full transition-all duration-500"
                      style={{
                        width: current ? 28 : 14,
                        backgroundColor: current ? PALETTE.focus : "rgba(120,105,85,0.3)",
                        transitionTimingFunction: EASE,
                      }}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function Chapter({ country, number, cityNumbers, eager, highlightedPath }) {
  const [first] = firstDate(country).split("-");
  return (
    <section id={country.slug} data-chapter={country.slug} className="scroll-mt-24">
      <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968]">
        <span aria-hidden className="h-px w-8 bg-[#786f63]/40" />
        Chapter {String(number).padStart(2, "0")}
      </p>
      <h2 className="mt-3 font-serif text-[2.25rem] font-normal leading-[1.1] tracking-[-0.02em] text-[#29251f] sm:text-5xl">
        {country.name.en}
      </h2>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <p className="font-serif text-xl tracking-[0.14em] text-[#6b645a]">{country.name.zh}</p>
        <p className="font-serif text-[15px] italic text-[#817769]">
          {country.cities.length} {plural(country.cities.length, "city", "cities")} · {country.postCount}{" "}
          {plural(country.postCount, "story", "stories")}
          {first && ` · since ${first}`}
        </p>
      </div>
      <div className="mt-8">
        <Timeline posts={country.posts} cityNumbers={cityNumbers} highlightedPath={highlightedPath} eagerCount={eager ? 1 : 0} />
      </div>
    </section>
  );
}

export default function ContinentStory({ continent, others }) {
  const [activeSlug, setActiveSlug] = useState(null);
  const chapters = continent.chapters;
  const active = chapters.find((country) => country.slug === activeSlug) || null;

  const cityOrder = useMemo(() => new Map(chapters.map((country) => [country.slug, orderCities(country)])), [chapters]);

  // 點國家或城市跳過去時，先鎖定那一章；跳完之後就算下一章已經進到判斷線，
  // 地圖也停在剛剛點的國家，直到使用者自己再捲動才解鎖
  const lock = useRef(null);
  const visibleChapters = useRef(new Set());

  const syncActive = useCallback(() => {
    if (lock.current) return;
    const current = chapters.find((country) => visibleChapters.current.has(country.slug));
    setActiveSlug(current?.slug ?? null);
  }, [chapters]);

  useEffect(() => {
    const release = () => {
      if (!lock.current) return;
      lock.current = null;
      syncActive();
    };
    const onKey = (event) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) release();
    };
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", onKey);
    };
  }, [syncActive]);

  // 畫面中間那條線碰到哪一章，哪一章就是目前的章節
  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-chapter]")];
    const visible = visibleChapters.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.dataset.chapter);
          else visible.delete(entry.target.dataset.chapter);
        }
        syncActive();
      },
      // 手機版上方被地圖佔掉，判斷線往下移到可讀區域的中間
      { rootMargin: window.matchMedia("(min-width: 1024px)").matches ? "-45% 0px -54% 0px" : "-68% 0px -31% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [syncActive]);

  // 剛進來還沒往下捲時先看整個洲，捲動之後地圖才跟著章節走
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 只有一個國家的洲，一進來就停在那個國家
  const mapActive = (scrolled && active) || (chapters.length === 1 ? chapters[0] : null);
  const mapCities = (mapActive && cityOrder.get(mapActive.slug)) || [];

  const mapBox = useRef(null);
  const [highlightedPath, setHighlightedPath] = useState(null);

  const lockTo = useCallback((slug) => {
    lock.current = { slug };
    setActiveSlug(slug);
  }, []);

  const goToOverview = useCallback(() => {
    lock.current = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // 手機版地圖固定在上方，捲動時要扣掉 Navbar 加地圖的高度，內容才不會被地圖蓋住
  const scrollToElement = useCallback((el) => {
    if (!el) return;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const offset = wide ? NAV_H + 32 : (mapBox.current?.getBoundingClientRect().bottom ?? NAV_H) + 24;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  }, []);

  const goToChapter = useCallback(
    (slug) => {
      lockTo(slug);
      scrollToElement(document.getElementById(slug));
    },
    [lockTo, scrollToElement]
  );

  // 點城市圖釘：捲到那個城市最早的一篇文章，卡片短暫浮起
  const goToCity = useCallback(
    (city) => {
      const path = city.posts[0];
      if (!path) return;
      if (mapActive) lockTo(mapActive.slug);
      scrollToElement(document.getElementById(`post-${path}`));
      setHighlightedPath(path);
      setTimeout(() => setHighlightedPath((current) => (current === path ? null : current)), 1800);
    },
    [lockTo, mapActive, scrollToElement]
  );

  return (
    <main className="relative bg-[#f4efe6]" style={{ paddingTop: NAV_H }}>
      <div className="lg:grid lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)]">
        {/* 地圖：寬螢幕固定在左邊，手機固定在上方 */}
        <div
          ref={mapBox}
          className="sticky z-10 h-[36vh] border-b border-[#786f63]/15 bg-[#f4efe6] lg:h-[calc(100dvh-72px)] lg:border-b-0 lg:border-r"
          style={{ top: NAV_H }}
        >
          <ContinentMap continent={continent} active={mapActive} orderedCities={mapCities} onSelect={goToChapter} onOverview={goToOverview} onCity={goToCity} />
        </div>

        <div className="px-5 pb-28 sm:px-10 lg:px-14 xl:px-20">
          {/* 洲的標題壓成一小條，第一章在第一個畫面就看得到 */}
          <motion.header
            className="border-b border-[#786f63]/15 pb-7 pt-10 sm:pt-12"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_ARRAY }}
          >
            <Link
              href="/travel"
              className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#817769] transition-colors duration-200 hover:text-[#29251f]"
            >
              <span aria-hidden className="h-px w-8 bg-current transition-all duration-300 group-hover:w-5" />
              All Continents
            </Link>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1 className="font-serif text-4xl font-normal tracking-[-0.025em] text-[#29251f] sm:text-[2.75rem]">{continent.name.en}</h1>
              <p className="font-serif text-xl tracking-[0.16em] text-[#6b645a]">{continent.name.zh}</p>
              <p className="font-serif text-[15px] italic text-[#817769] sm:ml-auto">
                {chapters.length} {plural(chapters.length, "country", "countries")} · {continent.cityCount}{" "}
                {plural(continent.cityCount, "city", "cities")} · {continent.postCount} {plural(continent.postCount, "story", "stories")}
              </p>
            </div>
          </motion.header>

          <div className="mt-12 space-y-28">
            {chapters.map((country, index) => (
              <Chapter
                key={country.slug}
                country={country}
                number={index + 1}
                cityNumbers={new Map((cityOrder.get(country.slug) || []).map((city) => [city.slug, city.number]))}
                eager={index === 0}
                highlightedPath={highlightedPath}
              />
            ))}
          </div>

          {/* 結尾：其他洲 */}
          {others.length > 0 && (
            <nav aria-label="Other continents" className="mt-36 border-t border-[#786f63]/20 pt-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#857968]">Continue the journey</p>
              <ul className="mt-6 flex flex-wrap gap-x-12 gap-y-6">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link href={`/travel/continent/${other.slug}`} className="group inline-flex items-baseline gap-3">
                      <span className="font-serif text-3xl text-[#29251f] transition-colors duration-300 group-hover:text-[#456b9b]">{other.name.en}</span>
                      <span className="font-serif text-base text-[#9a8f80]">{other.name.zh}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
