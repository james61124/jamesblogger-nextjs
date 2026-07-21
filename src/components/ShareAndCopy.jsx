"use client";

import { useState } from "react";
import { Check, Clipboard, Facebook, Linkedin, Share2 } from "lucide-react";

export default function ShareAndCopy() {
  const [copied, setCopied] = useState(false);
  const currentUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  const sharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: currentUrl() });
      } catch {}
      return;
    }
    copyLink();
  };

  const openShare = (url) =>
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=560");

  const pill =
    "inline-flex h-11 items-center gap-2 rounded-full border border-[#746b5e]/18 bg-white/20 px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#61594f] transition-all hover:-translate-y-0.5 hover:border-[#746b5e]/35 hover:bg-white/45";

  const icon =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#746b5e]/18 bg-white/20 text-[#61594f] transition-all hover:-translate-y-0.5 hover:border-[#746b5e]/35 hover:bg-white/45";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button type="button" onClick={sharePage} className={pill}>
        <Share2 size={15} strokeWidth={1.7} /> Share
      </button>

      <button type="button" onClick={copyLink} className={pill}>
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
        {copied ? "Copied" : "Copy link"}
      </button>

      <button
        type="button"
        className={icon}
        aria-label="Share on LinkedIn"
        onClick={() =>
          openShare(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl())}`
          )
        }
      >
        <Linkedin size={15} />
      </button>

      <button
        type="button"
        className={icon}
        aria-label="Share on Facebook"
        onClick={() =>
          openShare(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`
          )
        }
      >
        <Facebook size={15} />
      </button>
    </div>
  );
}
