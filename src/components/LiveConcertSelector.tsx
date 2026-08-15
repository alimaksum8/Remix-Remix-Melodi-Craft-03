import React from "react";
import { Check, Mic, Users, Volume2, Sparkles, AlertCircle, Heart } from "lucide-react";

interface LiveConcertOption {
  id: string;
  label: string;
  description: string;
  tags: string[];
  example?: string;
  notes?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const LIVE_CONCERT_OPTIONS: LiveConcertOption[] = [
  {
    id: "opening mc",
    label: "🎤 Opening MC / Cerita Makna Lagu",
    description: "Sebelum lagu dimulai, vokalis menyampaikan monolog singkat secara natural (8–20 detik) mengenai makna emosional lagu.",
    tags: ["[MC Speaking]", "[Live Concert]", "[Stage Banter]", "[Storytelling]", "[Natural Speech]"],
    example: "Terima kasih sudah hadir malam ini... Lagu berikut ini bercerita tentang seseorang yang mencintai dengan tulus, tetapi akhirnya hanya bisa belajar merelakan. Kalau kalian pernah merasakan hal yang sama... lagu ini untuk kalian.",
    notes: "Suara bicara alami, intonasi emosional hangat, langsung transisi ke intro musik.",
    icon: Mic,
  },
  {
    id: "tepuk tangan",
    label: "👏 Tepuk Tangan & Sorakan Penonton",
    description: "Menambahkan gemuruh tepuk tangan dan sorakan penonton yang natural sebelum intro dimulai, pasca MC selesai bicara, dan di akhir lagu.",
    tags: ["[Audience Applause]", "[Crowd Cheering]"],
    notes: "Efek ambience tepuk tangan akustik panggung konser nyata tanpa mengubah struktur tempo lagu.",
    icon: Volume2,
  },
  {
    id: "penonton bernyanyi verse 1",
    label: "🎶 Penonton Bernyanyi — Verse 1",
    description: "Vokalis memancing 1–2 baris pertama, kemudian vokalis DIAM SEPENUHNYA (Lead Vocal Silent) selama 3–4 bait berikutnya, digantikan ribuan penonton bernyanyi serempak.",
    tags: ["[Audience Singing Only]", "[Crowd Sing Along]", "[Lead Vocal Silent]"],
    notes: "Vokal utama senyap/mute, tanpa harmonisasi atau ad-lib, murni paduan suara penonton sesuai melodi asli.",
    icon: Users,
  },
  {
    id: "penonton bernyanyi chorus",
    label: "🎶 Penonton Bernyanyi — Chorus",
    description: "Vokalis menyanyikan satu baris pertama, memberi isyarat, lalu DIAM (Lead Vocal Silent) selama 3-4 bait agar penonton menyanyikan bagian reff dengan gema megah.",
    tags: ["[Crowd Chorus]", "[Audience Singing Only]", "[Lead Vocal Silent]"],
    notes: "Menciptakan efek klimaks stadium. Vokalis kembali masuk dengan energi lebih besar di bait penutup chorus.",
    icon: Sparkles,
  },
  {
    id: "interaksi vokalis",
    label: "🙌 Interaksi Vokalis (Shoutouts)",
    description: "Vokalis sesekali berbicara pendek di tengah jeda/intro lagu untuk memandu & membakar semangat penonton panggung.",
    tags: ["[Crowd Interaction]", "[Audience Response]"],
    example: "Nyanyi bareng, semuanya... Saya ingin dengar suara kalian... Yang paling belakang... lebih keras lagi!",
    notes: "Gaya bicara lisan (spoken words) bukan bernyanyi, disisipkan rapi di sela melodi transisi.",
    icon: Heart,
  },
  {
    id: "atmosfer konser",
    label: "🎵 Atmosfer Konser (Stadium FX)",
    description: "Ambience stadion penuh, reverb arena panggung luas, siulan penonton, teriakan di bagian emosional, dan tepukan ritmis mengikuti irama drum.",
    tags: ["[Concert Atmosphere]", "[Arena Reverb]"],
    notes: "Mengaktifkan efek gema akustik panggung outdoor tanpa merusak kualitas rekaman audio utama.",
    icon: Sparkles,
  },
];

interface LiveConcertSelectorProps {
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
}

export function LiveConcertSelector({ selectedValues, onChange }: LiveConcertSelectorProps) {
  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const selectAll = () => {
    onChange(LIVE_CONCERT_OPTIONS.map((o) => o.id));
  };

  const selectNone = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4 border-t border-neutral-100 pt-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
            <span>🎤</span> Live Concert (Advanced Realistic)
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Konfigurasi tag interaksi panggung live realistis kompatibel untuk Suno AI, Yooly, SongGenerator, & AIMusic
          </p>
        </div>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          <button
            type="button"
            onClick={selectAll}
            className="hover:text-amber-600 transition-colors cursor-pointer"
          >
            Pilih Semua
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={selectNone}
            className="hover:text-rose-600 transition-colors cursor-pointer"
          >
            Hapus Semua
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LIVE_CONCERT_OPTIONS.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          const IconComponent = option.icon;

          return (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden select-none ${
                isSelected
                  ? "bg-amber-50/70 border-amber-400 shadow-sm animate-fade-in"
                  : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
              }`}
            >
              <div>
                {/* Header & Checkbox */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-amber-500 text-neutral-950"
                          : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                      }`}
                    >
                      <IconComponent size={16} />
                    </div>
                    <span className="font-semibold text-neutral-800 text-xs sm:text-sm">
                      {option.label}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-amber-500 border-amber-500 text-neutral-950"
                        : "border-neutral-300 bg-white group-hover:border-neutral-400"
                    }`}
                  >
                    {isSelected && <Check size={14} className="stroke-[3]" />}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {option.description}
                </p>
              </div>

              {/* Tags and Live Previews */}
              <div className="space-y-2 mt-auto">
                <div className="flex flex-wrap gap-1">
                  {option.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-amber-100 text-amber-800 border border-amber-200/50"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div className="text-[11px] leading-relaxed p-2.5 rounded bg-white border border-amber-200/40 text-neutral-700 mt-2 space-y-1.5">
                    {option.example && (
                      <div>
                        <span className="font-bold text-amber-800 block text-[9px] uppercase tracking-wider">
                          Contoh Transkrip Vokalis:
                        </span>
                        <span className="italic">"{option.example}"</span>
                      </div>
                    )}
                    {option.notes && (
                      <div>
                        <span className="font-bold text-amber-800 block text-[9px] uppercase tracking-wider">
                          Petunjuk Format AI:
                        </span>
                        <span>{option.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning/Notes */}
      {selectedValues.length > 0 && (
        <div className="p-3 bg-neutral-50 border border-neutral-150 rounded-xl flex items-start gap-2.5">
          <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-neutral-600 space-y-1">
            <p>
              <strong className="text-neutral-700">Aturan Mutlak Aransemen:</strong> Lirik dasar, tempo, kunci nada, progresi kord, dan genre musik utama tetap dipertahankan utuh tanpa perubahan struktur. Yang berubah adalah variasi pementasan dan petunjuk pembagian vokal (misalnya <code className="font-mono bg-neutral-200/50 px-1 rounded text-neutral-800">[Lead Vocal Silent]</code>) agar menghasilkan audio konser realistis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
