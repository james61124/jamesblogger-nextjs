"use client";

// 旅遊文章的國家和城市欄位。清單裡沒有的話可以直接在這裡新增，會寫進 src/data/travel-places.json。

import { useEffect, useState } from "react";
import { api } from "./api";
import { Field, inputClass } from "./ui";

const CONTINENT_OPTIONS = [
  { slug: "europe", label: "歐洲" },
  { slug: "asia", label: "亞洲" },
  { slug: "americas", label: "美洲" },
];

const smallButton = "text-xs text-[#456b9b] hover:text-[#29251f]";

function AddCountry({ onAdded, onCancel }) {
  const [atlas, setAtlas] = useState(null);
  const [form, setForm] = useState({ id: "", zh: "", continent: "europe" });
  const [error, setError] = useState("");

  useEffect(() => {
    api("places")
      .then((data) => setAtlas(data.atlas))
      .catch((err) => setError(err.message));
  }, []);

  const submit = async () => {
    setError("");
    try {
      onAdded(await api("places", { method: "POST", body: { kind: "country", ...form } }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-2 space-y-2 border border-[#786f63]/20 bg-white/40 p-3">
      <select value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className={inputClass}>
        <option value="">選擇地圖上的國家</option>
        {(atlas || []).map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <input value={form.zh} onChange={(e) => setForm({ ...form, zh: e.target.value })} placeholder="中文名稱，例如：法國" className={inputClass} />
        <select value={form.continent} onChange={(e) => setForm({ ...form, continent: e.target.value })} className={`${inputClass} w-28`}>
          {CONTINENT_OPTIONS.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-4">
        <button type="button" onClick={submit} className="bg-[#29251f] px-3 py-1.5 text-xs text-[#f4efe6]">
          新增國家
        </button>
        <button type="button" onClick={onCancel} className={smallButton}>
          取消
        </button>
      </div>
    </div>
  );
}

function AddCity({ country, onAdded, onCancel }) {
  const [form, setForm] = useState({ zh: "", en: "", coordinates: "" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      onAdded(await api("places", { method: "POST", body: { kind: "city", country, ...form } }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-2 space-y-2 border border-[#786f63]/20 bg-white/40 p-3">
      <div className="flex gap-2">
        <input value={form.zh} onChange={(e) => setForm({ ...form, zh: e.target.value })} placeholder="中文，例如：巴黎" className={inputClass} />
        <input value={form.en} onChange={(e) => setForm({ ...form, en: e.target.value })} placeholder="英文，例如：Paris" className={inputClass} />
      </div>
      <input
        value={form.coordinates}
        onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
        placeholder="座標：在 Google 地圖對城市按右鍵，點第一行數字就會複製"
        className={inputClass}
      />
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-4">
        <button type="button" onClick={submit} className="bg-[#29251f] px-3 py-1.5 text-xs text-[#f4efe6]">
          新增城市
        </button>
        <button type="button" onClick={onCancel} className={smallButton}>
          取消
        </button>
      </div>
    </div>
  );
}

export default function PlaceFields({ places, onPlaces, country, citySlugs, onCountry, onToggleCity }) {
  const [adding, setAdding] = useState(null);
  const countryCities = places.cities.filter((city) => city.country === country);

  const added = (kind) => (result) => {
    onPlaces({ countries: result.countries, cities: result.cities });
    if (kind === "country") onCountry(result.added);
    else onToggleCity(result.added);
    setAdding(null);
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <Field label="國家">
          <select value={country || ""} onChange={(e) => onCountry(e.target.value)} className={inputClass}>
            <option value="">選擇國家</option>
            {places.countries.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name.zh} {c.name.en}
              </option>
            ))}
          </select>
        </Field>
        {adding === "country" ? (
          <AddCountry onAdded={added("country")} onCancel={() => setAdding(null)} />
        ) : (
          <button type="button" onClick={() => setAdding("country")} className={`${smallButton} mt-1.5`}>
            ＋ 新增國家
          </button>
        )}
      </div>
      <div>
        <Field label="城市">
          <div className="flex min-h-[42px] flex-wrap gap-3 pt-1">
            {!country && <span className="text-sm text-[#9a8f80]">先選國家</span>}
            {countryCities.map((city) => (
              <label key={city.slug} className="flex items-center gap-1.5 text-sm text-[#504a43]">
                <input type="checkbox" checked={citySlugs.includes(city.slug)} onChange={() => onToggleCity(city.slug)} />
                {city.name.zh}
              </label>
            ))}
          </div>
        </Field>
        {country &&
          (adding === "city" ? (
            <AddCity country={country} onAdded={added("city")} onCancel={() => setAdding(null)} />
          ) : (
            <button type="button" onClick={() => setAdding("city")} className={`${smallButton} mt-1.5`}>
              ＋ 新增城市
            </button>
          ))}
      </div>
    </div>
  );
}
