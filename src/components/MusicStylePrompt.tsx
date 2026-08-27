import React, { useState } from "react";
import { StylePromptData, SongData } from "../types";
import { StyleTagsBoxes } from "./StyleTagsBoxes";
import { Copy, Check, Info, Music, Sliders, Volume2, User, HelpCircle, Sparkles } from "lucide-react";

interface MusicStylePromptProps {
  style: StylePromptData;
  chords: string;
  songData?: SongData;
  onCopyFullPrompt: () => void;
}

export const MusicStylePrompt: React.FC<MusicStylePromptProps> = ({
  style,
  chords,
  songData,
  onCopyFullPrompt,
}) => {
  const [copiedFull, setCopiedFull] = useState<boolean>(false);
  const [copiedChords, setCopiedChords] = useState<boolean>(false);

  const handleCopyFull = () => {
    onCopyFullPrompt();
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleCopyChords = () => {
    navigator.clipboard.writeText(chords);
    setCopiedChords(true);
    setTimeout(() => setCopiedChords(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-150 pb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-800">Master Prompt Gaya Musik</h3>
          <p className="text-xs text-neutral-500">Salin prompt lengkap ini untuk digunakan pada Suno, Udio, atau pengembang musik AI lainnya.</p>
        </div>
        <button
          type="button"
          id="btn-copy-full-prompt"
          onClick={handleCopyFull}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          {copiedFull ? <Check size={14} /> : <Copy size={14} />}
          <span>{copiedFull ? "Tersalin!" : "Salin Master Prompt Lengkap"}</span>
        </button>
      </div>

      {/* Primary Song Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Tempo</p>
          <p className="text-sm font-extrabold text-neutral-800 mt-1">{style.tempo}</p>
        </div>
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Nada Dasar (Key)</p>
          <p className="text-sm font-extrabold text-neutral-800 mt-1">{style.key}</p>
        </div>
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Tanda Birama</p>
          <p className="text-sm font-extrabold text-neutral-800 mt-1">{style.timeSignature || "4/4"}</p>
        </div>
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 text-center">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Bahasa</p>
          <p className="text-sm font-extrabold text-neutral-800 mt-1">Indonesian</p>
        </div>
      </div>

      {/* Style of Music Tags for Suno, Yolly AI, SongGenerator.io */}
      {songData && (
        <div className="pt-2">
          <StyleTagsBoxes songData={songData} />
        </div>
      )}

      {/* Accordion/Detail Sections */}
      <div className="space-y-4">
        {/* Genre & Mood Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-150 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Music size={16} className="text-amber-600" />
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Genre / Gaya</h4>
            </div>
            <p className="text-sm text-neutral-800 font-medium leading-relaxed">
              {style.genre}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-150 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={16} className="text-amber-600" />
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Suasana / Mood</h4>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {style.mood.split(",").map((m, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-md font-medium transition-colors cursor-default"
                >
                  {m.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chords Suggestions (Card size visualizer) */}
        <div className="p-4 rounded-xl border border-neutral-150 bg-amber-50/40 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-amber-700" />
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">Rekomendasi Akor (Chords)</h4>
            </div>
            <button
              type="button"
              id="copy-chords"
              onClick={handleCopyChords}
              className="p-1 text-neutral-400 hover:text-amber-700 rounded transition-all cursor-pointer"
              title="Salin Akor"
            >
              {copiedChords ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-sm font-semibold text-neutral-800 font-mono tracking-wide">
            {chords}
          </p>
        </div>

        {/* Production Arrangements Detail Rows */}
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white divide-y divide-neutral-100">
          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Intro Opening (8 Bars)
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
              {style.introOpening}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Karakter Vokal & Pelafalan
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium flex items-center gap-2">
              <User size={16} className="text-neutral-400 shrink-0" />
              <span>{style.vocalStyle}</span>
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Struktur & Eskalasi Aransemen
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
              {style.arrangement}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Gerak Melodi & Register Vokal
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
              {style.melodyCharacter}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Dinamika Lagu
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
              {style.dynamics}
            </p>
          </div>

          <div className="p-4 sm:p-5">
            <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Gaya Mixing Studio (Mixing Concept)
            </h5>
            <p className="text-sm text-neutral-700 leading-relaxed font-medium">
              {style.mixing}
            </p>
          </div>

          {style.liveConcert && (
            <div className="p-4 sm:p-5">
              <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Atmosfer Konser Live (Live Performance)
              </h5>
              <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                {style.liveConcert}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 text-xs text-neutral-500 leading-relaxed">
        <Info size={16} className="text-neutral-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-neutral-700">Mencari hasil orisinal penuh?</p>
          <p>Seluruh parameter aransemen di atas dirancang agar terhindar dari klaim hak cipta melodi atau komposisi populer mana pun, sekaligus menangkap estetika nostalgia aslinya secara akurat.</p>
        </div>
      </div>
    </div>
  );
};
