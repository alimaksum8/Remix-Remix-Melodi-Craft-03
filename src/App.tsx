import React, { useState, useEffect, useRef } from "react";
import { SongData, Preset, LyricsData } from "./types";
import { PRESETS } from "./presets";
import { DEFAULT_SONG } from "./defaultSong";
import { LyricDisplay } from "./components/LyricDisplay";
import { MusicStylePrompt } from "./components/MusicStylePrompt";
import { DynamicCoverArt } from "./components/DynamicCoverArt";
import { LiveConcertSelector } from "./components/LiveConcertSelector";
import { StyleTagsBoxes } from "./components/StyleTagsBoxes";
import {
  generateMasterPromptMarkdown,
  formatSunoLyrics,
  formatSunoStyleTags,
  formatYollyAiStyleTags,
  formatSongGeneratorIoStyleTags,
} from "./utils";
import {
  Music,
  Sparkles,
  Sliders,
  Check,
  Copy,
  HelpCircle,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Disc,
  CopyPlus,
  Play,
  ArrowRight,
} from "lucide-react";

const OPTIONS_GENRE = [
  "Slow Rock Melayu 90's",
  "Pop Melayu Ballad",
  "Romantic Ballad",
  "Pop Melayu Melankolis",
  "Acoustic Ballad",
  "Sad Romantic",
  "Pop Rock Indonesia 2000s",
  "Alternative Pop",
  "Classic Band Anthem",
  "Folk-Pop",
  "Pure Intimacy"
];

const OPTIONS_BIRAMA = [
  "3/4",
  "4/4",
  "6/8",
  "9/8",
  "12/8"
];

const OPTIONS_TEMPO = [
  "68 BPM",
  "72 BPM",
  "80 BPM",
  "95 BPM"
];

const OPTIONS_KEY = [
  "Am",
  "Em",
  "Cm",
  "Dm",
  "G Major",
  "C Major"
];

const OPTIONS_MOOD = [
  "Warm",
  "Romantic",
  "Heartfelt",
  "Hopeful",
  "Emotional",
  "Elegant",
  "Nostalgic",
  "Soft but Powerful",
  "Sad",
  "Melancholic",
  "Intimate",
  "Heartbreaking",
  "Uplifting",
  "Cozy",
  "Peaceful"
];

const OPTIONS_VOCAL = [
  "Warm Male Vocal",
  "Warm Female Vocal",
  "Duet",
  "Emotional",
  "Natural",
  "Clean Pronunciation",
  "Smooth Legato",
  "Soft Vibrato",
  "Chest Voice Dominant",
  "Vulnerable Vocal",
  "Air-y breathing",
  "Soft chest-head voice",
  "Whispery Vocals"
];

const OPTIONS_LANGUAGE = [
  "Natural Indonesian",
  "Conversational",
  "Simple vocabulary",
  "Romantic",
  "Heartfelt everyday conversation",
  "Everyday words showing pain",
  "Uplifting metaphors",
  "Poetic but simple"
];

const OPTIONS_STORY = [
  "Verse 1 (Introduce relationship & hope)",
  "Verse 2 (Show misunderstanding & longing)",
  "Pre-Chorus (Build tension & emotions)",
  "Chorus (Main memorable hook)",
  "Post-Chorus (Brief pause / reinforcement)",
  "Verse 3 (Show acceptance or commitment)",
  "Bridge (Reflection & climax build)",
  "Final Chorus (Maximum climax)",
  "Outro (Fade out peacefully)"
];

const OPTIONS_INTRO = [
  "🎵 Gitar Distorsi",
  "🎵 Gitar Elektrik",
  "🎵 Perkusi Akustik",
  "🎵 Solo Gitar Sustain",
  "🎵 Solo Gitar Bending",
  "🎵 Solo Gitar Vibrato",
  "🎵 Solo Nada Tinggi / Gitar Menjerit",
  "🎵 Solo Gitar Lead",
  "🎵 Tematik Main Theme Preview",
  "🎵 Tematik Chorus Preview",
  "🎵 Drum Intro",
  "🎵 Drum Fill + Electric Guitar",
  "🎵 Drum Solo Intro",
  "🎵 Live Drum Intro + Crowd Cheering",
  "🎵 Akustic Figer Style"
];

interface MultiSelectGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (newValues: string[]) => void;
}

function MultiSelectGroup({ label, options, selectedValues, onChange }: MultiSelectGroupProps) {
  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const selectAll = () => onChange(options);
  const selectNone = () => onChange([]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-neutral-700 uppercase tracking-wide text-xs">
          {label}
        </label>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
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
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1 cursor-pointer select-none ${
                isSelected
                  ? "bg-amber-500 border-amber-500 text-neutral-950 font-semibold shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              {isSelected && <Check size={12} className="stroke-[2.5]" />}
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SingleSelectGroupProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (newValue: string) => void;
}

function SingleSelectGroup({ label, options, selectedValue, onChange }: SingleSelectGroupProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-neutral-700 uppercase tracking-wide text-xs">
          {label}
        </label>
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          Pilih Salah Satu
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1 cursor-pointer select-none ${
                isSelected
                  ? "bg-amber-500 border-amber-500 text-neutral-950 font-semibold shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
            >
              {isSelected && <Check size={12} className="stroke-[2.5]" />}
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  // Primary state management
  const [topic, setTopic] = useState<string>("Penantian Sia-sia di Dermaga Lama");
  const topicTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);

  // Auto-expand topic textarea dynamically based on word count & line length
  useEffect(() => {
    if (topicTextareaRef.current) {
      topicTextareaRef.current.style.height = "auto";
      topicTextareaRef.current.style.height = `${topicTextareaRef.current.scrollHeight}px`;
    }
  }, [topic]);
  
  // Custom advanced settings fields (multiple choice selections, all selected by default)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Slow Rock Melayu 90's",
    "Romantic Ballad",
    "Sad Romantic",
    "Pure Intimacy"
  ]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([
    "Warm",
    "Romantic",
    "Emotional",
    "Soft but Powerful",
    "Melancholic",
    "Intimate",
    "Uplifting"
  ]);
  const [selectedTempos, setSelectedTempos] = useState<string[]>(["80 BPM", "95 BPM"]);
  const [selectedBirama, setSelectedBirama] = useState<string>("4/4");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["Am", "Cm", "G Major", "C Major"]);
  const [selectedVocals, setSelectedVocals] = useState<string[]>([
    "Warm Male Vocal",
    "Emotional",
    "Natural",
    "Chest Voice Dominant",
    "Vulnerable Vocal",
    "Soft chest-head voice",
    "Whispery Vocals"
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(OPTIONS_LANGUAGE);
  const [selectedLiveConcerts, setSelectedLiveConcerts] = useState<string[]>([]);
  const [selectedStories, setSelectedStories] = useState<string[]>(OPTIONS_STORY);
  const [selectedIntros, setSelectedIntros] = useState<string[]>([
    "🎵 Solo Gitar Sustain",
    "🎵 Solo Gitar Bending",
    "🎵 Solo Gitar Vibrato",
    "🎵 Solo Nada Tinggi / Gitar Menjerit"
  ]);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"lyrics" | "prompt" | "suno" | "cover">("lyrics");
  
  const [songData, setSongData] = useState<SongData>(DEFAULT_SONG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [copiedLyrics, setCopiedLyrics] = useState<boolean>(false);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);

  // Custom vocal choice handling logic
  const handleVocalsChange = (newValues: string[]) => {
    const hadDuet = selectedVocals.includes("Duet");
    const hasDuet = newValues.includes("Duet");
    
    let finalValues = [...newValues];
    
    if (hasDuet && !hadDuet) {
      // Duet was newly selected -> automatically select Warm Male Vocal and Warm Female Vocal
      if (!finalValues.includes("Warm Male Vocal")) {
        finalValues.push("Warm Male Vocal");
      }
      if (!finalValues.includes("Warm Female Vocal")) {
        finalValues.push("Warm Female Vocal");
      }
    } else if (!hasDuet && hadDuet) {
      // Duet was unselected -> enforce single selection between Warm Male Vocal and Warm Female Vocal
      if (finalValues.includes("Warm Male Vocal") && finalValues.includes("Warm Female Vocal")) {
        finalValues = finalValues.filter(v => v !== "Warm Female Vocal");
      }
    } else {
      // Duet state did not change
      if (hasDuet) {
        // If Duet is active, both must remain. If one is removed, deselect Duet too.
        const hasMale = finalValues.includes("Warm Male Vocal");
        const hasFemale = finalValues.includes("Warm Female Vocal");
        if (!hasMale || !hasFemale) {
          finalValues = finalValues.filter(v => v !== "Duet");
        }
      } else {
        // Duet is NOT active -> only one of Warm Male Vocal or Warm Female Vocal can be chosen
        const hasMale = finalValues.includes("Warm Male Vocal");
        const hasFemale = finalValues.includes("Warm Female Vocal");
        
        const hadMale = selectedVocals.includes("Warm Male Vocal");
        const hadFemale = selectedVocals.includes("Warm Female Vocal");
        
        if (hasMale && hasFemale) {
          if (!hadMale && hasMale) {
            // Warm Male Vocal was newly selected -> deselect Warm Female Vocal
            finalValues = finalValues.filter(v => v !== "Warm Female Vocal");
          } else if (!hadFemale && hasFemale) {
            // Warm Female Vocal was newly selected -> deselect Warm Male Vocal
            finalValues = finalValues.filter(v => v !== "Warm Male Vocal");
          }
        }
      }
    }
    
    setSelectedVocals(finalValues);
  };

  // Generate Song handler
  const handleGenerateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Silakan masukkan tema atau topik lagu terlebih dahulu.");
      return;
    }

    if (
      selectedGenres.length === 0 &&
      selectedMoods.length === 0 &&
      selectedTempos.length === 0 &&
      !selectedBirama &&
      selectedKeys.length === 0 &&
      selectedVocals.length === 0 &&
      selectedLanguages.length === 0 &&
      selectedStories.length === 0 &&
      selectedIntros.length === 0
    ) {
      setError("Silakan pilih minimal satu opsi untuk setiap parameter aransemen.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          genre: selectedGenres.join(", "),
          mood: selectedMoods.join(", "),
          tempo: selectedTempos.join(", "),
          timeSignature: selectedBirama,
          key: selectedKeys.join(", "),
          introOpening: selectedIntros.join(", "),
          vocalStyle: selectedVocals.join(", "),
          lyricLanguage: selectedLanguages.join(", "),
          storyFlow: selectedStories.join(", "),
          liveConcert: selectedLiveConcerts.join(", "),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menghubungi AI untuk menulis lagu.");
      }

      const generatedData = await response.json();
      setSongData(generatedData);
      
      // Auto switch to lyrics tab to display output
      setActiveTab("lyrics");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat memproses pembuatan lirik.");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback to allow inline manual lyrics editing in LyricDisplay
  const handleUpdateLyrics = (updatedLyrics: LyricsData) => {
    setSongData({
      ...songData,
      lyrics: updatedLyrics,
    });
  };

  const handleCopyMasterPrompt = () => {
    const markdown = generateMasterPromptMarkdown(songData);
    navigator.clipboard.writeText(markdown);
  };

  const handleCopySunoLyrics = () => {
    const sunoLyrics = formatSunoLyrics(songData);
    navigator.clipboard.writeText(sunoLyrics);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleCopySunoTags = () => {
    const sunoTags = formatSunoStyleTags(songData);
    navigator.clipboard.writeText(sunoTags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-800 antialiased font-sans">
      {/* Premium minimal navigation header */}
      <header className="border-b border-neutral-200/80 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-sm ring-4 ring-amber-500/10">
              <Music size={20} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-neutral-900 uppercase">
                  Melodi<span className="text-amber-500 font-extrabold">Kraft</span> Konser
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  Indonesian v1.2
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-medium tracking-wide">
                Developer Ali Maksum Gejes
              </span>
            </div>
          </div>
          <div className="text-xs text-neutral-500 font-medium hidden sm:block">
            Pembuat Lirik & Master Prompt Lagu Klasik Orisinal
          </div>
        </div>
      </header>

      {/* Primary Workspace Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PARAMETERS CONFIGURATION (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-bold text-neutral-900">Arsitektur Lagu & Gaya</h2>
                <p className="text-xs text-neutral-500 mt-1">Konfigurasikan tema, genre, dan parameter melodi lagu yang ingin diciptakan.</p>
              </div>

              <form onSubmit={handleGenerateSong} className="space-y-6">
                
                {/* Topic / Theme Input */}
                <div className="space-y-2">
                  <label htmlFor="topic-input" className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex justify-between items-center">
                    <span>Tema / Ide Cerita Lagu</span>
                    <span className="text-amber-600 font-semibold text-[11px]">Bisa ide singkat ATAU tempel lirik lengkap</span>
                  </label>
                  <textarea
                    ref={topicTextareaRef}
                    id="topic-input"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ketik ide/cerita (misal: Rindu ayah di kampung) ATAU tempel lirik lagu lengkap untuk ditransformasi secara kreatif..."
                    rows={2}
                    className="w-full text-sm border border-neutral-300 rounded-xl px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all bg-neutral-50/50 resize-none overflow-hidden min-h-[52px] leading-relaxed"
                    required
                  />
                </div>

                {/* Advanced Settings Fields (Always Visible) */}
                <div className="border border-neutral-150 rounded-2xl bg-neutral-50/30 p-5 space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <SlidersHorizontal size={14} className="text-amber-600" />
                    <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Sesuaikan Parameter Aransemen
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {/* Genre Tags Selector */}
                    <MultiSelectGroup
                      label="Genre Tags"
                      options={OPTIONS_GENRE}
                      selectedValues={selectedGenres}
                      onChange={setSelectedGenres}
                    />

                    {/* Birama (Time Signature) Selector (Single Select only) */}
                    <SingleSelectGroup
                      label="Birama (Time Signature)"
                      options={OPTIONS_BIRAMA}
                      selectedValue={selectedBirama}
                      onChange={setSelectedBirama}
                    />

                    {/* Tempo (BPM) Selector */}
                    <MultiSelectGroup
                      label="Tempo (BPM)"
                      options={OPTIONS_TEMPO}
                      selectedValues={selectedTempos}
                      onChange={setSelectedTempos}
                    />

                    {/* Nada Dasar (Key) Selector */}
                    <MultiSelectGroup
                      label="Nada Dasar (Key)"
                      options={OPTIONS_KEY}
                      selectedValues={selectedKeys}
                      onChange={setSelectedKeys}
                    />

                    {/* Intro Opening Pilihan Selector */}
                    <MultiSelectGroup
                      label="Intro Opening Pilihan (Bisa pilih beberapa)"
                      options={OPTIONS_INTRO}
                      selectedValues={selectedIntros}
                      onChange={setSelectedIntros}
                    />

                    {/* Daftar Suasana (Mood) Selector */}
                    <MultiSelectGroup
                      label="Daftar Suasana (Mood)"
                      options={OPTIONS_MOOD}
                      selectedValues={selectedMoods}
                      onChange={setSelectedMoods}
                    />

                    {/* Karakter Vokal Selector */}
                    <MultiSelectGroup
                      label="Karakter Vokal"
                      options={OPTIONS_VOCAL}
                      selectedValues={selectedVocals}
                      onChange={handleVocalsChange}
                    />

                    {/* Bahasa & Kosakata Selector */}
                    <MultiSelectGroup
                      label="Bahasa & Kosakata"
                      options={OPTIONS_LANGUAGE}
                      selectedValues={selectedLanguages}
                      onChange={setSelectedLanguages}
                    />

                    {/* Live Concert Selector */}
                    <LiveConcertSelector
                      selectedValues={selectedLiveConcerts}
                      onChange={setSelectedLiveConcerts}
                    />

                    {/* Alur Drama Cerita (Story Flow) Selector */}
                    <MultiSelectGroup
                      label="Alur Drama Cerita (Story Flow)"
                      options={OPTIONS_STORY}
                      selectedValues={selectedStories}
                      onChange={setSelectedStories}
                    />
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  id="btn-generate-lyrics"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-600 disabled:bg-neutral-200 disabled:text-neutral-500 text-neutral-950 font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="animate-spin text-neutral-950" size={16} />
                      <span>Menggubah Lirik & Aransemen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="fill-neutral-950" />
                      <span>Hasilkan Lirik & Aransemen Baru</span>
                    </>
                  )}
                </button>
              </form>

              {/* Feedback Error Panel */}
              {error && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 text-xs text-rose-800 leading-relaxed space-y-1">
                  <p className="font-bold">Gagal Membuat Lagu</p>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: INTERACTIVE OUTPUT VIEWER (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* Produced Song Info Display */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
              
              {/* Output Title Panel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/40">
                    {songData.stylePrompt.genre.split(",")[0]}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mt-1.5">
                    {songData.songTitle}
                  </h1>
                </div>
                <div className="text-xs text-neutral-500 font-mono tracking-wide bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200/40 shrink-0">
                  Akor Utama: <span className="font-bold text-neutral-800">{songData.chordsSuggestion.split(" | ")[0].replace("Verse: ", "")}</span>
                </div>
              </div>

              {/* Interactive Tabs Menu */}
              <div className="flex border-b border-neutral-100 pb-px">
                <button
                  type="button"
                  id="tab-lyrics"
                  onClick={() => setActiveTab("lyrics")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                    activeTab === "lyrics"
                      ? "border-amber-500 text-amber-950 bg-amber-50/20"
                      : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                  }`}
                >
                  <FileText size={14} />
                  <span>Lirik & Suku Kata</span>
                </button>
                <button
                  type="button"
                  id="tab-prompt"
                  onClick={() => setActiveTab("prompt")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                    activeTab === "prompt"
                      ? "border-amber-500 text-amber-950 bg-amber-50/20"
                      : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                  }`}
                >
                  <Sliders size={14} />
                  <span>Master Prompt</span>
                </button>
                <button
                  type="button"
                  id="tab-suno"
                  onClick={() => setActiveTab("suno")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                    activeTab === "suno"
                      ? "border-amber-500 text-amber-950 bg-amber-50/20"
                      : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                  }`}
                >
                  <CopyPlus size={14} />
                  <span>Penyalin AI (aimusic.so / Suno / Yolly / SongGen)</span>
                </button>
                <button
                  type="button"
                  id="tab-cover"
                  onClick={() => setActiveTab("cover")}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${
                    activeTab === "cover"
                      ? "border-amber-500 text-amber-950 bg-amber-50/20"
                      : "border-transparent text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/50"
                  }`}
                >
                  <Disc size={14} />
                  <span>Cover Album</span>
                </button>
              </div>

              {/* TAB PANEL RENDERER */}
              <div className="pt-4 min-h-[480px]">
                
                {activeTab === "lyrics" && (
                  <LyricDisplay
                    lyrics={songData.lyrics}
                    onUpdateLyrics={handleUpdateLyrics}
                  />
                )}

                {activeTab === "prompt" && (
                  <MusicStylePrompt
                    style={songData.stylePrompt}
                    chords={songData.chordsSuggestion}
                    songData={songData}
                    onCopyFullPrompt={handleCopyMasterPrompt}
                  />
                )}

                {activeTab === "suno" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-800">
                        Generator Prompt &amp; Style of Music Tags (aimusic.so, Suno, Yolly AI, SongGenerator.io)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Gunakan kolom style tags di bawah ini untuk mengisi formulir pembuatan musik pada aimusic.so (≤ 120 karakter), Suno AI, Yolly AI, maupun SongGenerator.io.
                      </p>
                    </div>

                    {/* Dedicated Style Tags Boxes for Suno, Yolly, SongGenerator (≤ 900 Chars) */}
                    <StyleTagsBoxes songData={songData} />

                    {/* Full Lyrics Sheet (With structural block indicators) */}
                    <div className="p-4 rounded-xl border border-neutral-150 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                          Lembar Lirik Siap Salin (Format Tag Struktur [Verse], [Chorus])
                        </span>
                        <button
                          type="button"
                          id="copy-suno-lyrics"
                          onClick={handleCopySunoLyrics}
                          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline transition-all cursor-pointer"
                        >
                          {copiedLyrics ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedLyrics ? "Tersalin!" : "Salin Lirik Lengkap"}</span>
                        </button>
                      </div>
                      <pre className="p-4 rounded-lg bg-neutral-50 font-mono text-xs text-neutral-800 border border-neutral-100 overflow-y-auto max-h-72 whitespace-pre-wrap leading-relaxed">
                        {formatSunoLyrics(songData)}
                      </pre>
                      <p className="text-[10px] text-neutral-400">
                        Tag kurung siku (seperti [Verse], [Instrumental Break - 10s], [Chorus]) memandu AI untuk membawakan dinamika lagu secara akurat.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "cover" && (
                  <DynamicCoverArt
                    title={songData.songTitle}
                    genre={songData.stylePrompt.genre}
                    presetId={selectedPreset.id}
                    chords={songData.chordsSuggestion}
                  />
                )}

              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Decorative premium footer */}
      <footer className="border-t border-neutral-200/60 bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-neutral-400 space-y-1">
          <p>© 2026 MelodiKraft Konser — Generator Otomatis Lirik Melayu Orisinal.</p>
          <p>Terhubung secara aman ke model Gemini AI versi modern untuk penataan musik presisi tinggi.</p>
        </div>
      </footer>
    </div>
  );
}
