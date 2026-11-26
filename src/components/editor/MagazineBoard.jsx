"use client";

// 雜誌排版的編輯畫面：照網站的雜誌排版畫出來（每段一張主圖、其他照片瀑布流），直接在上面調。
//
// - 點照片選取：設為主圖、往前 / 往後移、刪除、寫圖說
// - 拖曳照片到另一張的上半部或下半部，插到它前面或後面；拖到主圖上就換成主圖
// - 主圖上直接改分段標題；每段可以加文字、在段落後面加新分段
// - 右上角切換電腦 / 手機，看兩種寬度排出來的樣子
//
// 排法和網站共用 src/lib/photoLayout.js 的 magazineChapters / masonryColumns。

import { magazineChapters, masonryColumns, heroRatio } from "@/lib/photoLayout";

const chip = "px-2 py-1 text-[11px] leading-none transition-colors";
const tool = `${chip} border border-[#786f63]/30 bg-white/70 hover:bg-white`;
const addButton = "bg-[#f4efe6] px-2 py-0.5 text-[11px] text-[#456b9b] ring-1 ring-[#456b9b]/40 hover:bg-white";

function Thumb({ item }) {
  return item.kind === "video" ? (
    <video src={item.src} className="pointer-events-none h-full w-full object-cover" muted playsInline />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.src} alt="" loading="lazy" draggable={false} className="pointer-events-none h-full w-full object-cover" />
  );
}

function Tools({ item, isHero, onHero, onAction }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
      {isHero ? (
        item.size === "full" && (
          <button type="button" title="改回一般照片，主圖改用這段第一張橫的照片" onClick={() => onHero(false)} className={tool}>
            取消主圖
          </button>
        )
      ) : (
        <button type="button" title="這段最上面的大圖改用這張" onClick={() => onHero(true)} className={tool}>
          ★ 設為主圖
        </button>
      )}
      <button type="button" title="往前移（←）" onClick={() => onAction("left")} className={tool}>
        ←
      </button>
      <button type="button" title="往後移（→）" onClick={() => onAction("right")} className={tool}>
        →
      </button>
      <button type="button" title="移到照片庫（Delete）" onClick={() => onAction("remove")} className={`${chip} ml-auto text-red-700 hover:bg-red-50`}>
        刪除
      </button>
    </div>
  );
}

function Caption({ item, onChange, light = false }) {
  if (item.kind === "video") return null;
  return (
    <input
      value={item.caption}
      onChange={(event) => onChange({ ...item, caption: event.target.value })}
      onClick={(event) => event.stopPropagation()}
      placeholder="圖說"
      className={[
        "w-full border-0 border-b border-transparent bg-transparent px-0 py-1 text-[12px] outline-none hover:border-current/20 focus:border-[#456b9b]",
        light ? "text-white placeholder:text-white/50" : "mt-1 text-[#817769] placeholder:text-[#c2b8aa]",
      ].join(" ")}
    />
  );
}

export default function MagazineBoard({ items, columns, selectedId, onSelect, dragProps, drop, dragId, onChange, onAction, onSetHero, onDropOnHero, insertBefore, newSectionItem, newTextItem, remove }) {
  const chapters = magazineChapters(items);
  const selectedClass = (id) =>
    selectedId === id ? "outline outline-[3px] outline-offset-2 outline-[#c4896b]" : "hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[#786f63]/40";

  let number = 0;
  return chapters.map((chapter, index) => {
    if (chapter.title || chapter.section) number += 1;
    const { hero, section } = chapter;
    const end = chapters[index + 1]?.section ?? null; // 插在這段最後 = 插在下一段的分段前面
    const firstBlock = chapter.blocks[0];
    const afterHero = firstBlock ? (firstBlock.type === "grid" ? firstBlock.photos[0] : firstBlock.item) : end;

    const titleInput = section && (
      <div className="group flex items-end gap-3" onClick={(event) => event.stopPropagation()}>
        <input
          value={section.title}
          onChange={(event) => onChange({ ...section, title: event.target.value })}
          placeholder="分段標題"
          className={["min-w-0 flex-1 border-0 bg-transparent font-serif text-[26px] leading-tight outline-none", hero ? "text-white placeholder:text-white/50" : "text-[#29251f] placeholder:text-[#c2b8aa]"].join(" ")}
        />
        <button type="button" onClick={() => remove(section.id)} className={["pb-1 text-xs opacity-0 hover:text-red-500 group-hover:opacity-100", hero ? "text-white/70" : "text-[#9a8f80]"].join(" ")}>
          刪除分段
        </button>
      </div>
    );

    return (
      <section key={section?.id ?? `intro-${index}`} className={index === 0 ? "" : "mt-14"}>
        {hero ? (
          <div>
            <div
              onClick={(event) => {
                event.stopPropagation();
                onSelect(hero.id);
              }}
              onDragOver={(event) => {
                if (dragId && dragId !== hero.id) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDropOnHero(hero, event);
              }}
              className={["relative cursor-pointer overflow-hidden rounded-[3px] bg-[#ddd5c8]", selectedClass(hero.id), dragId && dragId !== hero.id ? "ring-2 ring-dashed ring-[#456b9b]/50" : ""].join(" ")}
              style={{ aspectRatio: String(heroRatio(hero)) }}
            >
              <Thumb item={hero} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-4 pt-20">
                {section && <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-white/75">{String(number).padStart(2, "0")}</p>}
                {titleInput}
                <Caption item={hero} onChange={onChange} light />
              </div>
              <span className="absolute left-2 top-2 bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{hero.size === "full" ? "主圖" : "主圖（自動）"}</span>
            </div>
            {selectedId === hero.id && <Tools item={hero} isHero onHero={(on) => onSetHero(hero, on)} onAction={onAction(hero.id)} />}
          </div>
        ) : (
          section && (
            <header className="mb-2">
              <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-[#a0806a]">{String(number).padStart(2, "0")}</p>
              {titleInput}
            </header>
          )
        )}

        <div className="flex h-7 items-center justify-center gap-2 opacity-0 transition-opacity hover:opacity-100">
          <button type="button" onClick={() => insertBefore(afterHero, newTextItem())} className={addButton}>
            ＋ 文字
          </button>
        </div>

        {chapter.blocks.map((block) => {
          if (block.type === "text") {
            const text = block.item;
            return (
              <div key={text.id} className="group relative mx-auto my-4 max-w-[34rem]" onClick={(event) => event.stopPropagation()}>
                <textarea
                  value={text.text}
                  onChange={(event) => onChange({ ...text, text: event.target.value })}
                  rows={Math.max(2, text.text.split("\n").length + 1)}
                  placeholder="寫一段當時的故事…"
                  className="w-full resize-y border border-dashed border-[#786f63]/30 bg-white/40 p-3 font-serif text-[16px] leading-7 text-[#3f3a33] outline-none placeholder:text-[#c2b8aa] focus:border-[#456b9b] focus:bg-white"
                />
                <button type="button" onClick={() => remove(text.id)} className="absolute -right-16 top-2 text-xs text-[#9a8f80] opacity-0 hover:text-red-700 group-hover:opacity-100">
                  刪除文字
                </button>
              </div>
            );
          }
          const count = block.photos.length === 1 ? 1 : Math.min(columns, block.photos.length);
          return (
            <div key={block.photos[0].id} className={["flex items-start gap-2", count === 1 ? "mx-auto max-w-md" : ""].join(" ")}>
              {masonryColumns(block.photos, count).map((column, columnIndex) => (
                <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-2">
                  {column.map((item) => {
                    const side = drop?.id === item.id && dragId !== item.id ? drop.side : null;
                    return (
                      <figure key={item.id} className="m-0">
                        <div
                          {...dragProps(item, "y")}
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelect(item.id);
                          }}
                          className={["relative cursor-grab overflow-hidden rounded-[3px] bg-[#ddd5c8] active:cursor-grabbing", selectedClass(item.id)].join(" ")}
                          style={{ aspectRatio: String(item.ratio) }}
                        >
                          <Thumb item={item} />
                          {side && <span className={["absolute inset-x-0 h-1 bg-[#456b9b]", side === "before" ? "top-0" : "bottom-0"].join(" ")} />}
                        </div>
                        {selectedId === item.id && <Tools item={item} isHero={false} onHero={(on) => onSetHero(item, on)} onAction={onAction(item.id)} />}
                        <Caption item={item} onChange={onChange} />
                      </figure>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

        <div className="mt-3 flex h-7 items-center justify-center gap-2 opacity-0 transition-opacity hover:opacity-100">
          <button type="button" onClick={() => insertBefore(end, newTextItem())} className={addButton}>
            ＋ 文字
          </button>
          <button type="button" onClick={() => insertBefore(end, newSectionItem())} className={addButton}>
            ＋ 新分段
          </button>
        </div>
      </section>
    );
  });
}
