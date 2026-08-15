import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Disc, RefreshCw, AlertCircle, Eye } from "lucide-react";

interface DynamicCoverArtProps {
  title: string;
  genre: string;
  presetId: string;
  chords: string;
}

export const DynamicCoverArt: React.FC<DynamicCoverArtProps> = ({
  title,
  genre,
  presetId,
  chords,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pick a nostalgic color theme based on the current preset ID
  const getThemeColors = () => {
    switch (presetId) {
      case "slow-rock-melayu-90s":
        return {
          bg: "bg-gradient-to-br from-amber-950 via-amber-900 to-stone-950",
          accent: "text-amber-400 border-amber-500/30",
          vinylCenter: "bg-amber-500",
          textLight: "text-amber-100",
          textAccent: "text-amber-400",
          glowingLine: "bg-amber-400/20",
        };
      case "pop-melayu-melankolis":
        return {
          bg: "bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950",
          accent: "text-blue-400 border-blue-500/30",
          vinylCenter: "bg-blue-400",
          textLight: "text-blue-50",
          textAccent: "text-blue-300",
          glowingLine: "bg-blue-400/20",
        };
      case "pop-rock-2000an":
        return {
          bg: "bg-gradient-to-br from-rose-950 via-rose-900 to-zinc-950",
          accent: "text-rose-400 border-rose-500/30",
          vinylCenter: "bg-rose-400",
          textLight: "text-rose-100",
          textAccent: "text-rose-400",
          glowingLine: "bg-rose-400/20",
        };
      case "balada-pop-akustik":
        return {
          bg: "bg-gradient-to-br from-emerald-950 via-stone-800 to-stone-900",
          accent: "text-emerald-400 border-emerald-500/30",
          vinylCenter: "bg-emerald-400",
          textLight: "text-emerald-100",
          textAccent: "text-emerald-300",
          glowingLine: "bg-emerald-400/20",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950",
          accent: "text-amber-500 border-amber-500/30",
          vinylCenter: "bg-amber-500",
          textLight: "text-amber-50",
          textAccent: "text-amber-500",
          glowingLine: "bg-amber-500/20",
        };
    }
  };

  const theme = getThemeColors();

  const handleGenerateAIArt = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          genre,
          mood: presetId === "slow-rock-melayu-90s" ? "classic slow rock" : "music cover art",
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi server untuk membuat gambar.");
      }

      const data = await response.json();
      if (data.isFallback || !data.imageUrl) {
        // Fallback occurred, e.g. unpaid key or rate limit
        throw new Error(data.reason || "Fitur gambar memerlukan paid API key. Menampilkan cover bawaan premium.");
      } else {
        setImageUrl(data.imageUrl);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Gagal membuat cover AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Workspace Canvas */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden shadow-xl border border-neutral-300 bg-black group">
          {imageUrl ? (
            /* AI Generated Image display */
            <img
              src={imageUrl}
              alt={`Album Cover: ${title}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover animate-fade-in"
            />
          ) : (
            /* High-fidelity procedural nostalgic cover (SVG & styled DIV elements) */
            <div className={`w-full h-full ${theme.bg} p-6 flex flex-col justify-between select-none relative overflow-hidden`}>
              
              {/* Retro decorative stripes */}
              <div className="absolute top-0 left-0 w-full h-[6px] flex">
                <div className="flex-1 bg-amber-500/50" />
                <div className="flex-1 bg-rose-500/50" />
                <div className="flex-1 bg-blue-500/50" />
                <div className="flex-1 bg-emerald-500/50" />
              </div>

              {/* Glowing vertical soundwave bars in the background (procedural) */}
              <div className="absolute inset-0 flex justify-around items-end opacity-10 pointer-events-none p-10">
                <div className="w-1.5 bg-white h-20 rounded-full" />
                <div className="w-1.5 bg-white h-32 rounded-full animate-pulse" />
                <div className="w-1.5 bg-white h-12 rounded-full" />
                <div className="w-1.5 bg-white h-24 rounded-full animate-pulse" />
                <div className="w-1.5 bg-white h-16 rounded-full" />
              </div>

              {/* Tape / cassette record player centerpiece */}
              <div className="flex justify-between items-start pt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400/80">
                  STEREO LP
                </span>
                <span className="text-[10px] font-mono tracking-wide text-neutral-400/80">
                  90S REC
                </span>
              </div>

              {/* Center Spinning vinyl or cassette visualizer */}
              <div className="flex flex-col items-center justify-center my-auto relative">
                {/* Cassette visualization inside the album artwork */}
                <div className="w-48 h-28 border border-white/15 bg-neutral-900/80 rounded-lg p-2.5 flex flex-col justify-between relative shadow-inner">
                  {/* Tape label */}
                  <div className="h-10 bg-white/10 border border-white/5 rounded flex items-center justify-between px-3">
                    <span className="text-[9px] font-bold text-white/50 tracking-wider">A-SIDE</span>
                    <span className="text-[9px] font-mono text-white/40">{chords.split(" ")[0] || "Am"}</span>
                  </div>
                  
                  {/* Spinners */}
                  <div className="flex justify-center gap-10 items-center my-1.5">
                    <div className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center animate-spin [animation-duration:8s]">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center animate-spin [animation-duration:8s]">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                    </div>
                  </div>

                  <div className="h-2 bg-amber-500/40 rounded-full mx-6" />
                </div>
              </div>

              {/* Album Metadata with gorgeous typography */}
              <div className="space-y-1.5 z-10">
                <div className={`h-[1px] w-full ${theme.glowingLine}`} />
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                  {genre.split(",")[0]}
                </p>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight line-clamp-2">
                  {title}
                </h1>
                <p className="text-[10px] text-neutral-400 flex items-center gap-1 italic">
                  <span>Akurasi Orisinalitas:</span>
                  <span className="font-semibold text-green-400">99.8%</span>
                </p>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
              <RefreshCw className="animate-spin text-amber-500 mb-3" size={32} />
              <p className="text-sm font-semibold">Mengembangkan Desain AI...</p>
              <p className="text-xs text-neutral-400 mt-1">Menggunakan model Gemini-3.1-Flash-Lite-Image untuk melukis konsep retro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Button and Explanatory Notes */}
      <div className="text-center space-y-3">
        <button
          type="button"
          id="btn-generate-ai-cover"
          onClick={handleGenerateAIArt}
          disabled={isLoading}
          className="mx-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500 text-white font-semibold text-xs rounded-xl shadow transition-all duration-200"
        >
          <Sparkles size={14} className="text-amber-400 animate-pulse" />
          <span>Hasilkan Cover Seni dengan AI</span>
        </button>

        {errorMsg ? (
          <div className="flex gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-[11px] text-neutral-500 text-left leading-relaxed">
            <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-neutral-700">Cover Bawaan Diaktifkan</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-neutral-500 leading-relaxed max-w-sm mx-auto">
            Cover seni procedur di atas menyesuaikan palet warna secara otomatis berdasarkan jenis aransemen yang Anda pilih.
          </p>
        )}
      </div>
    </div>
  );
};
