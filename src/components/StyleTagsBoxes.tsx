import React, { useState } from "react";
import { SongData } from "../types";
import {
  formatSunoStyleTags,
  formatYollyAiStyleTags,
  formatSongGeneratorIoStyleTags,
  formatAiMusicSoStyleTags,
  formatUniversalMusicTags,
} from "../utils";
import { Copy, Check, Sparkles, Radio, Layers, Flame, Wand2, Disc3 } from "lucide-react";

interface StyleTagsBoxesProps {
  songData: SongData;
}

type PlatformKey = "suno" | "yolly" | "songgenerator" | "aimusic" | "all";

export const StyleTagsBoxes: React.FC<StyleTagsBoxesProps> = ({ songData }) => {
  const [selectedView, setSelectedView] = useState<PlatformKey>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sunoTags = formatSunoStyleTags(songData);
  const yollyTags = formatYollyAiStyleTags(songData);
  const songGenTags = formatSongGeneratorIoStyleTags(songData);
  const aimusicTags = formatAiMusicSoStyleTags(songData);
  const universalTags = formatUniversalMusicTags(songData);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const platforms = [
    {
      id: "aimusic",
      name: "aimusic.so",
      badge: "aimusic.so (≤120 Karakter)",
      maxLimit: 120,
      description: "Kolom 'Style of Music' pada aimusic.so — Ringkas, padat, lengkap & maksimal 120 karakter",
      tags: aimusicTags,
      icon: Disc3,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      tagColor: "bg-emerald-50 text-emerald-950 border-emerald-200",
    },
    {
      id: "suno",
      name: "Suno AI",
      badge: "Suno v3.5 / v4",
      maxLimit: 900,
      description: "Kolom 'Style of Music' pada Custom Mode Suno AI",
      tags: sunoTags,
      icon: Flame,
      color: "from-orange-500/10 to-amber-500/10 text-orange-700 border-orange-200",
      btnColor: "bg-orange-600 hover:bg-orange-700 text-white",
      tagColor: "bg-orange-50 text-orange-950 border-orange-200",
    },
    {
      id: "yolly",
      name: "Yolly AI",
      badge: "Yolly Music AI",
      maxLimit: 900,
      description: "Kolom 'Prompt Style / Vibe & Sound' pada Yolly AI",
      tags: yollyTags,
      icon: Sparkles,
      color: "from-purple-500/10 to-pink-500/10 text-purple-700 border-purple-200",
      btnColor: "bg-purple-600 hover:bg-purple-700 text-white",
      tagColor: "bg-purple-50 text-purple-950 border-purple-200",
    },
    {
      id: "songgenerator",
      name: "SongGenerator.io",
      badge: "SongGenerator io",
      maxLimit: 900,
      description: "Kolom 'Music Style / Prompt Description' di SongGenerator.io",
      tags: songGenTags,
      icon: Radio,
      color: "from-blue-500/10 to-cyan-500/10 text-blue-700 border-blue-200",
      btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
      tagColor: "bg-blue-50 text-blue-950 border-blue-200",
    },
  ];

  return (
    <div className="space-y-5" id="style-tags-container">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 size={18} className="text-amber-600" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-800 tracking-tight">
              Style of Music Tags Generator
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide border border-emerald-200">
              aimusic.so ≤ 120 | Platform Lain ≤ 900
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Diformat khusus untuk aimusic.so (≤ 120 karakter), Suno AI, Yolly AI, dan SongGenerator.io dengan birama, tempo, nada dasar, aransemen, &amp; vokal.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs font-semibold overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSelectedView("all")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedView === "all"
                ? "bg-white text-neutral-900 shadow-xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Layers size={13} />
            <span>Semua Platform</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedView("aimusic")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedView === "aimusic"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            aimusic.so (120 ch)
          </button>
          <button
            type="button"
            onClick={() => setSelectedView("suno")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedView === "suno"
                ? "bg-white text-neutral-900 shadow-xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Suno
          </button>
          <button
            type="button"
            onClick={() => setSelectedView("yolly")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedView === "yolly"
                ? "bg-white text-neutral-900 shadow-xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Yolly
          </button>
          <button
            type="button"
            onClick={() => setSelectedView("songgenerator")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedView === "songgenerator"
                ? "bg-white text-neutral-900 shadow-xs font-bold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            SongGen
          </button>
        </div>
      </div>

      {/* Grid of Platform Style Cards */}
      <div className="grid grid-cols-1 gap-4">
        {platforms
          .filter((p) => selectedView === "all" || selectedView === p.id)
          .map((platform) => {
            const Icon = platform.icon;
            const charCount = platform.tags.length;
            const isCopied = copiedKey === platform.id;

            return (
              <div
                key={platform.id}
                id={`card-style-${platform.id}`}
                className="p-4 sm:p-5 rounded-2xl border border-neutral-200/90 bg-white shadow-xs hover:shadow-sm transition-all space-y-3"
              >
                {/* Platform Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-2 rounded-xl border ${platform.color} flex items-center justify-center`}>
                      <Icon size={16} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900">
                          {platform.name}
                        </h4>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded">
                          {platform.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                  </div>

                  {/* Character Counter & Copy Action */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="font-mono text-xs font-bold text-neutral-700">
                          {charCount}
                        </span>
                        <span className="text-[11px] text-neutral-400">/ {platform.maxLimit} karakter</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        ✓ Di bawah {platform.maxLimit} karakter
                      </span>
                    </div>

                    <button
                      type="button"
                      id={`btn-copy-${platform.id}`}
                      onClick={() => handleCopy(platform.tags, platform.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : platform.btnColor
                      }`}
                    >
                      {isCopied ? <Check size={14} className="stroke-[2.5]" /> : <Copy size={14} />}
                      <span>{isCopied ? "Tersalin!" : "Salin Tags"}</span>
                    </button>
                  </div>
                </div>

                {/* Tags Display Area */}
                <div
                  onClick={() => handleCopy(platform.tags, platform.id)}
                  title="Klik untuk menyalin"
                  className={`p-3.5 rounded-xl border font-mono text-xs text-neutral-800 break-words leading-relaxed cursor-pointer transition-all hover:border-neutral-400 select-all ${platform.tagColor}`}
                >
                  {platform.tags}
                </div>

                {/* Quick Info & Platform Destination Hint */}
                <div className="flex flex-wrap items-center justify-between text-[10px] text-neutral-400 gap-2 pt-1">
                  <span>
                    Birama: <strong className="text-neutral-700">{songData.stylePrompt.timeSignature || "4/4"}</strong> • Tempo: <strong className="text-neutral-700">{songData.stylePrompt.tempo}</strong> • Nada Dasar: <strong className="text-neutral-700">{songData.stylePrompt.key}</strong>
                  </span>
                  <span className="text-amber-700 font-medium">
                    ⚡ Klik kotak atau tombol di atas untuk salin instan
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Universal Tags / All-in-One Compact Option */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-neutral-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-600" />
            Universal AI Music Tags (Semua Generator)
          </span>
          <p className="text-neutral-500 text-[11px] mt-0.5">
            Format tag ringkas fleksibel untuk generator musik AI lainnya ({universalTags.length} / 900 karakter).
          </p>
        </div>
        <button
          type="button"
          id="btn-copy-universal-tags"
          onClick={() => handleCopy(universalTags, "universal")}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer"
        >
          {copiedKey === "universal" ? <Check size={13} /> : <Copy size={13} />}
          <span>{copiedKey === "universal" ? "Tersalin!" : "Salin Universal Tags"}</span>
        </button>
      </div>
    </div>
  );
};
