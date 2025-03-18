"use client";

import { useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaCopy, FaCheck } from "react-icons/fa";

export default function ShareAndCopy({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const socialLinks = [
    { platform: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, icon: <FaFacebook />, color: "hover:bg-blue-600" },
    { platform: "Twitter", url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, icon: <FaTwitter />, color: "hover:bg-blue-400" },
    { platform: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, icon: <FaLinkedin />, color: "hover:bg-blue-700" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      {socialLinks.map(({ platform, url, icon, color }) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-lg ${color} bg-gray-800 text-white`}
          aria-label={`Share on ${platform}`}
        >
          {icon}
        </a>
      ))}

      <button
        onClick={copyToClipboard}
        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gray-800 text-white hover:bg-green-500 transition-all duration-300 shadow-lg"
        aria-label="Copy to clipboard"
      >
        {copied ? <FaCheck /> : <FaCopy />}
      </button>
    </div>
  );
}
