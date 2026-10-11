import React, { useState } from "react";
import { LyricsData } from "../types";
import { countIndonesianSyllables, hyphenateLine, unhyphenateLine } from "../utils";
import { Copy, Check, Edit3, Save, X, Eye, EyeOff, Music } from "lucide-react";

interface LyricDisplayProps {
  lyrics: LyricsData;
  onUpdateLyrics: (newLyrics: LyricsData) => void;
}

export const LyricDisplay: React.FC<LyricDisplayProps> = ({
  lyrics,
  onUpdateLyrics,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Check if lyrics already have hyphens
  const isPreHyphenated = (lyrics.verse1 && lyrics.verse1.some(l => l.includes("-"))) ||
                          (lyrics.chorus && lyrics.chorus.some(l => l.includes("-")));
  
  const [showHyphenated, setShowHyphenated] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<{ section: keyof LyricsData; index: number } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const formatLineForDisplay = (line: string): string => {
    if (showHyphenated) {
      return line.includes("-") ? line : hyphenateLine(line);
    }
    return unhyphenateLine(line);
  };

  const sections: { key: keyof LyricsData; label: string; subLabel: string; target: string; min: number; max: number }[] = [
    { key: "verse1", label: "VERSE 1A", subLabel: "Perkenalan Tokoh & Cinta Awal (KAU Hadir)", target: "4 Baris • 3–8 Kata", min: 2, max: 8 },
    { key: "verse2", label: "VERSE 1B", subLabel: "Perkembangan Rasa (Sebab-Akibat & Tatapan)", target: "4 Baris • 3–8 Kata", min: 2, max: 8 },
    { key: "preChorus", label: "PRE-CHORUS", subLabel: "Eskalasi Transisi Menuju Korus", target: "2 Baris • 3–8 Kata", min: 2, max: 8 },
    { key: "chorus", label: "CHORUS A", subLabel: "Hook Utama & Panggilan Cinta (Kasih/Sayang)", target: "4 Baris • Hook Romantis", min: 2, max: 8 },
    { key: "postChorus", label: "CHORUS B / VARIASI", subLabel: "Variasi Hook / Kedalaman Rasa", target: "4 Baris • Penegasan Rasa", min: 2, max: 8 },
    { key: "verse3", label: "VERSE 3 / REFRAIN", subLabel: "Penguatan Ketulusan Cinta (Kalimat Baru)", target: "4 Baris • 3–8 Kata", min: 2, max: 8 },
    { key: "bridge", label: "BRIDGE", subLabel: "Titik Balik Emosi, Janji & Kesetiaan", target: "4 Baris • Puncak Ketulusan", min: 2, max: 8 },
    { key: "finalChorus", label: "FINAL CHORUS", subLabel: "Klimaks Vokal Emosional Penuh", target: "4 Baris • Puncak Emosi", min: 2, max: 8 },
    { key: "outro", label: "OUTRO", subLabel: "Penutup Romantis & Vocalization (Oooh...)", target: "2–4 Baris • Resolusi Manis", min: 2, max: 8 },
  ];

  const handleCopySection = (sectionName: string, lines: string[] | string) => {
    let textToCopy = "";
    if (Array.isArray(lines)) {
      textToCopy = lines.map(l => formatLineForDisplay(l)).join("\n");
    } else {
      textToCopy = lines;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const startEditing = (section: keyof LyricsData, index: number, value: string) => {
    setEditingKey({ section, index });
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const saveEditing = (section: keyof LyricsData, index: number) => {
    if (editValue.trim() === "") return;
    
    const lines = lyrics[section];
    if (Array.isArray(lines)) {
      const updatedLines = [...lines];
      updatedLines[index] = editValue.trim();
      
      onUpdateLyrics({
        ...lyrics,
        [section]: updatedLines,
      });
    }
    
    setEditingKey(null);
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, section: keyof LyricsData, index: number) => {
    if (e.key === "Enter") {
      saveEditing(section, index);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Controls & Dramatic Arc Roadmap */}
      <div className="space-y-4 border-b border-neutral-150 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-800">Lirik Lagu Hasil Olahan</h3>
            <p className="text-xs text-neutral-500">Struktur Balada Melayu &amp; Format Pemenggalan Suku Kata (Hyphenated Syllabification).</p>
          </div>
          
          <button
            type="button"
            id="btn-toggle-hyphenation"
            onClick={() => setShowHyphenated(!showHyphenated)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer shrink-0 ${
              showHyphenated
                ? "bg-amber-100 text-amber-950 border-amber-300 shadow-2xs"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            {showHyphenated ? <Eye size={13} className="text-amber-800" /> : <EyeOff size={13} />}
            <span>{showHyphenated ? "Format Suku Kata: Aktif (Ma-sih ber-bu-nga)" : "Format Standar (Tanpa Tanda Hubung)"}</span>
          </button>
        </div>

        {/* Dramatic Arc Steps Pill Navigation */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50/80 via-neutral-50 to-orange-50/60 border border-amber-200/60 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Kurva Emosional Balada Melayu / Dangdut Slow:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-neutral-700">
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-emerald-800">1. Cinta (Verse 1A)</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-rose-800">2. Luka (Verse 1B)</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-amber-800">3. Korus / Refrain</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-purple-800">4. Pertanyaan Emosional</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-blue-800">5. Menerima &amp; Harapan (Bridge)</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-teal-800">6. Resolusi Bahagia (Outro)</span>
            <span className="text-neutral-300">→</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 shadow-2xs font-semibold text-neutral-700">7. Luka Tersisa (Reprise)</span>
          </div>
        </div>
      </div>

      {/* Intro Block (Description only) */}
      <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-amber-700">INTRO</span>
          <button
            type="button"
            id="copy-intro"
            onClick={() => handleCopySection("intro", lyrics.intro)}
            className="text-neutral-400 hover:text-amber-700 transition-colors"
            title="Salin Intro"
          >
            {copiedSection === "intro" ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>
        <p className="text-sm font-medium text-neutral-600 italic">
          [Instrumental - {lyrics.intro}]
        </p>
      </div>

      {/* Lyric Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map(({ key, label, subLabel, target, min, max }) => {
          const lines = lyrics[key];
          if (!Array.isArray(lines)) return null;

          const isChorusSection = key === "chorus" || key === "finalChorus";

          return (
            <React.Fragment key={key}>
              {isChorusSection && (
                <div className="md:col-span-2 p-3.5 rounded-xl border border-amber-300/60 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 text-amber-950 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold shadow-xs my-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center">
                      <Music size={13} />
                    </span>
                    <span className="font-bold text-amber-900 tracking-wide">[Instrumen Musik - 10 Detik]</span>
                  </div>
                  <span className="text-[11px] text-amber-700/90 font-mono font-medium">Interlude Melodi / Solo Gitar Sebelum Chorus</span>
                </div>
              )}

              <div
                id={`section-${key}`}
                className="p-5 rounded-2xl border border-neutral-100 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
              <div>
                <div className="flex items-start justify-between mb-4 border-b border-neutral-50 pb-2.5 gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold tracking-wider text-amber-700">{label}</span>
                      <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 font-medium">
                        {target}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                      {subLabel}
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    id={`copy-${key}`}
                    onClick={() => handleCopySection(key, lines)}
                    className="p-1 text-neutral-400 hover:text-amber-700 hover:bg-neutral-50 rounded transition-all shrink-0"
                    title={`Salin ${label}`}
                  >
                    {copiedSection === key ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="space-y-3">
                  {lines.map((line, idx) => {
                    const syllables = countIndonesianSyllables(line);
                    const isOutsideLimits = key !== "outro" && (syllables < min || syllables > max);
                    const isEditingThisLine = editingKey?.section === key && editingKey?.index === idx;

                    return (
                      <div key={idx} className="group min-h-[44px] flex flex-col justify-center relative">
                        {isEditingThisLine ? (
                          <div className="flex items-center gap-2 w-full bg-neutral-50 p-1.5 rounded-lg border border-neutral-300">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, key, idx)}
                              className="flex-1 bg-white border border-neutral-200 rounded px-2 py-1 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => saveEditing(key, idx)}
                              className="p-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                              title="Simpan"
                            >
                              <Save size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="p-1 bg-neutral-200 text-neutral-600 rounded hover:bg-neutral-300 transition-colors"
                              title="Batal"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3 p-1.5 hover:bg-neutral-50/70 rounded-lg transition-all duration-200">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-neutral-800 leading-relaxed font-mono">
                                {formatLineForDisplay(line)}
                              </p>
                              {showHyphenated && (
                                <p className="text-[10px] text-neutral-400 italic mt-0.5 font-sans">
                                  {unhyphenateLine(line)}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Edit triggers on hover or touch */}
                              <button
                                type="button"
                                onClick={() => startEditing(key, idx, line)}
                                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 text-neutral-400 hover:text-amber-600 hover:bg-neutral-100 rounded transition-all"
                                title="Edit baris ini"
                              >
                                <Edit3 size={12} />
                              </button>

                              {/* Word & Syllable Counter Pill */}
                              {(() => {
                                const wordCount = line.trim().split(/\s+/).filter(Boolean).length;
                                return (
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 select-none"
                                      title={`${wordCount} kata`}
                                    >
                                      {wordCount} kata
                                    </span>
                                    <span
                                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/50 select-none"
                                      title={`${syllables} suku kata`}
                                    >
                                      {syllables} sk
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
