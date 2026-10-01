import { SongData } from "./types";

/**
 * Counts the syllables of a line of Indonesian text using a heuristic model.
 */
export function countIndonesianSyllables(text: string): number {
  if (!text) return 0;
  // Remove punctuation and clean up spacing
  const clean = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  
  if (!clean) return 0;
  
  const words = clean.split(" ");
  let totalSyllables = 0;

  for (const word of words) {
    let syllablesInWord = 0;
    let i = 0;
    const len = word.length;

    while (i < len) {
      const char = word[i];
      if ("aeiou".includes(char)) {
        // Check for diphthongs (ai, au, oi, ei) which are pronounced as single vowels in Indonesian syllables
        if (i < len - 1) {
          const next = word[i + 1];
          if (
            (char === "a" && next === "i") ||
            (char === "a" && next === "u") ||
            (char === "o" && next === "i") ||
            (char === "e" && next === "i")
          ) {
            syllablesInWord++;
            i += 2;
            continue;
          }
        }
        syllablesInWord++;
      }
      i++;
    }

    // Default to at least 1 syllable if the word has no vowels
    totalSyllables += syllablesInWord === 0 ? 1 : syllablesInWord;
  }

  return totalSyllables;
}

/**
 * Splits an Indonesian word into its constituent syllables using Indonesian phonetic rules.
 * e.g., "menanti" -> "me-nan-ti", "kerinduan" -> "ke-rin-du-an", "sunyi" -> "su-nyi"
 */
export function hyphenateIndonesianWord(word: string): string {
  const clean = word.trim();
  if (clean.length <= 3) return word;

  const isVowel = (c: string) => c ? "aeiouAEIOU".includes(c) : false;
  
  let syllables: string[] = [];
  let current = "";
  
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    current += char;
    
    const next = clean[i + 1];
    const nextNext = clean[i + 2];
    
    if (isVowel(char)) {
      if (next) {
        if (isVowel(next)) {
          // V-V split (e.g., "sa-at", "di-a", except diphthongs "ai", "au", "oi", "ei")
          const dip = (char + next).toLowerCase();
          if (!["ai", "au", "oi", "ei"].includes(dip)) {
            syllables.push(current);
            current = "";
          }
        } else if (nextNext && isVowel(nextNext)) {
          // V-C-V split -> split before the consonant (e.g., "ba-pa", "u-tang")
          syllables.push(current);
          current = "";
        } else if (nextNext && !isVowel(nextNext)) {
          // V-C-C-V split -> split between the consonants unless they form a digraph (ng, ny, sy, kh)
          const digraph = ["ng", "ny", "sy", "kh"].includes((next + nextNext).toLowerCase());
          if (digraph) {
            // Digraph: treat as a single consonant, split before it (e.g., "sa-ngat", "ha-nyut")
            syllables.push(current);
            current = "";
          } else {
            // Standard V-C-C-V -> split after the first consonant (e.g., "man-di", "ar-ti")
            current += next;
            syllables.push(current);
            current = "";
            i++; // Skip the next character as it's consumed
          }
        }
      }
    }
  }
  
  if (current) {
    syllables.push(current);
  }
  
  return syllables.filter(Boolean).join("-");
}

/**
 * Break a full line of text into hyphenated words.
 */
export function hyphenateLine(text: string): string {
  if (!text) return "";
  return text.split(" ").map(word => {
    // Preserve punctuation
    const wordClean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"]/g, "");
    if (!wordClean) return word;
    const hyphenated = hyphenateIndonesianWord(wordClean);
    return word.replace(wordClean, hyphenated);
  }).join(" ");
}

/**
 * Generates the full master prompt markdown from song data, matching the exact requested layout structure.
 */
export function generateMasterPromptMarkdown(song: SongData): string {
  const { songTitle, chordsSuggestion, lyrics, stylePrompt } = song;

  return `# MASTER PROMPT — ${stylePrompt.genre.toUpperCase()} (ORIGINAL)

## OBJECTIVE
Transform this song into an ORIGINAL ${stylePrompt.genre} ballad with warm, romantic, emotional storytelling and memorable sing-along melodies.
The result MUST feel like a classic song while remaining completely original.

---

# GENRE
${stylePrompt.genre}

---

# MOOD
${stylePrompt.mood}

---

# TEMPO
${stylePrompt.tempo}

---

# TIME SIGNATURE
${stylePrompt.timeSignature || "4/4"}

---

# KEY
${stylePrompt.key}

---

# INTRO OPENING
${stylePrompt.introOpening}

---

# ARRANGEMENT
${stylePrompt.arrangement}

---

# VOCAL STYLE
${stylePrompt.vocalStyle}

---

# LYRIC LANGUAGE
${stylePrompt.lyricLanguage}

---

# STORY FLOW
- Verse 1 & 2: Introduce relationship, misunderstanding and longing.
- Pre-Chorus & Chorus: Increase tension and deliver the main emotional message.
- Post-Chorus & Verse 3: Short emotional reinforcement and show acceptance.
- Bridge & Final Chorus: Reflection and maximum emotional climax.
- Outro: End peacefully, leaving emotional resonance.

---

# LYRIC STRUCTURE & SONG

INTRO
[Instrumental Only - ${lyrics.intro}]

VERSE 1
${lyrics.verse1.join("\n")}

VERSE 2
${lyrics.verse2.join("\n")}

PRE-CHORUS
${lyrics.preChorus.join("\n")}

[Instrumental Break - 10 Detik]

CHORUS
${lyrics.chorus.join("\n")}

POST CHORUS
${lyrics.postChorus.join("\n")}

VERSE 3
${lyrics.verse3.join("\n")}

BRIDGE
${lyrics.bridge.join("\n")}

[Instrumental Break - 10 Detik]

FINAL CHORUS
${lyrics.finalChorus.join("\n")}

OUTRO
${lyrics.outro.join("\n")}

---

# CHORDS SUGGESTIONS
${chordsSuggestion}

---

# MELODY CHARACTER
${stylePrompt.melodyCharacter}

---

# DYNAMICS
${stylePrompt.dynamics}

---

# MIXING
${stylePrompt.mixing}

---

${stylePrompt.liveConcert ? `# LIVE CONCERT ATMOSPHERE\n${stylePrompt.liveConcert}\n\n---\n\n` : ""}# OUTPUT REQUIREMENTS
Produce a completely ORIGINAL song.
Do not imitate or reproduce any copyrighted melody, lyric, arrangement, or identifiable composition from existing songs.
Capture only the timeless characteristics of the genre while creating fresh melodies, lyrics, and musical ideas.
`;
}

/**
 * Formats lyrics specifically for pasting into Suno or Udio (using structural bracket tags)
 */
export function formatSunoLyrics(song: SongData): string {
  const { lyrics } = song;
  return `[Intro]
[${lyrics.intro}]

[Verse 1]
${lyrics.verse1.join("\n")}

[Verse 2]
${lyrics.verse2.join("\n")}

[Pre-Chorus]
${lyrics.preChorus.join("\n")}

[Instrumental Break - 10s]
[Chorus]
${lyrics.chorus.join("\n")}

[Post-Chorus]
${lyrics.postChorus.join("\n")}

[Verse 3]
${lyrics.verse3.join("\n")}

[Bridge]
${lyrics.bridge.join("\n")}

[Instrumental Break - 10s]
[Chorus]
${lyrics.finalChorus.join("\n")}

[Outro]
${lyrics.outro.join("\n")}
[Fade Out]
[End]`;
}

/**
 * Safely clamps any text to a strict maximum character limit (default 900),
 * trimming cleanly at logical boundaries without cutting mid-word where possible.
 */
export function clampToMaxChars(text: string, maxChars: number = 900): string {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  
  const truncated = cleaned.substring(0, maxChars);
  const lastBreak = Math.max(
    truncated.lastIndexOf(","),
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("|"),
    truncated.lastIndexOf(";")
  );
  if (lastBreak > maxChars * 0.7) {
    return truncated.substring(0, lastBreak).trim();
  }
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxChars * 0.8) {
    return truncated.substring(0, lastSpace).trim();
  }
  return truncated.trim();
}

/**
 * Helper to determine vocal descriptor for AI Music Prompts
 */
function getVocalDescriptor(vocalStyle: string): string {
  const vocalLower = (vocalStyle || "").toLowerCase();
  if (vocalLower.includes("female") || vocalLower.includes("wanita") || vocalLower.includes("perempuan") || vocalLower.includes("cewek")) {
    return "warm female vocal, sweet emotive alto-soprano tone, soft natural vibrato, breathy intimacy";
  } else if (vocalLower.includes("duet")) {
    return "duet vocal, male and female harmonies, emotional interplay, dynamic vocal trade-offs";
  } else if (vocalLower.includes("male") || vocalLower.includes("pria") || vocalLower.includes("cowok") || vocalLower.includes("laki-laki")) {
    return "warm male vocal, chest voice dominant, emotional delivery, heartfelt natural vibrato, soft rasp on climax";
  }
  return "warm expressive vocal, natural vibrato, emotive delivery, clean pronunciation";
}

/**
 * Helper to build aimusic.so Style of Music Tags (Maksimal KETAT ≤ 120 Karakter)
 */
export function formatAiMusicSoStyleTags(song: SongData): string {
  const { stylePrompt } = song;
  const timeSig = stylePrompt.timeSignature || "4/4";
  
  // Compact vocal descriptor
  let vocal = "male vocal";
  const vocalLower = (stylePrompt.vocalStyle || "").toLowerCase();
  if (vocalLower.includes("female") || vocalLower.includes("wanita") || vocalLower.includes("perempuan") || vocalLower.includes("cewek")) {
    vocal = "female vocal";
  } else if (vocalLower.includes("duet")) {
    vocal = "duet vocal";
  }

  // Extract compact attributes
  const primaryGenre = stylePrompt.genre.split(",")[0].trim().toLowerCase();
  const tempoClean = stylePrompt.tempo.replace(/BPM/i, "bpm").trim().toLowerCase();
  const moodClean = stylePrompt.mood.split(",")[0].trim().toLowerCase();

  const parts: string[] = [
    primaryGenre,
    `${timeSig} meter`,
    tempoClean,
    `key ${stylePrompt.key}`,
    vocal,
    moodClean,
    "guitar solo",
    "90s ballad",
  ];

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    parts.push("live concert");
  }

  const raw = parts.filter(Boolean).join(", ");
  return clampToMaxChars(raw, 120);
}

/**
 * Helper to build optimized Suno AI Style of Music Tags (Maksimal 900 Karakter)
 */
export function formatSunoStyleTags(song: SongData): string {
  const { stylePrompt } = song;
  const vocalDesc = getVocalDescriptor(stylePrompt.vocalStyle);
  const timeSig = stylePrompt.timeSignature || "4/4";

  const tags: string[] = [
    stylePrompt.genre.toLowerCase(),
    `${timeSig} time signature`,
    stylePrompt.tempo.toLowerCase(),
    `key ${stylePrompt.key}`,
    vocalDesc,
    stylePrompt.mood.toLowerCase(),
    "crying electric guitar solo",
    "long sustain distortion",
    "acoustic guitar fingerpicking",
    "melodic bassline",
    "dynamic power drums",
    "heartfelt slow rock ballad",
    "soaring chorus climax",
    "90s vintage studio mix",
    "stereo plate reverb",
  ];

  if (stylePrompt.introOpening) {
    const cleanIntro = stylePrompt.introOpening.replace(/🎵/g, "").replace(/\s+/g, " ").trim();
    if (cleanIntro) {
      tags.push(cleanIntro.toLowerCase());
    }
  }

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    tags.push("live concert", "arena acoustics");
    const liveLower = stylePrompt.liveConcert.toLowerCase();
    
    if (liveLower.includes("mc") || liveLower.includes("speaking") || liveLower.includes("banter") || liveLower.includes("sapaan")) {
      tags.push("mc speaking", "storytelling intro", "natural speech");
    }
    if (liveLower.includes("tepuk") || liveLower.includes("applause") || liveLower.includes("cheer") || liveLower.includes("sorakan")) {
      tags.push("audience applause", "crowd cheering");
    }
    if (liveLower.includes("verse 1") || liveLower.includes("sing along")) {
      tags.push("crowd sing along", "audience singing verse", "lead vocal silent");
    }
    if (liveLower.includes("chorus") || liveLower.includes("epic chorus")) {
      tags.push("crowd chorus sing along", "epic audience chant");
    }
    if (liveLower.includes("interaksi") || liveLower.includes("interaction")) {
      tags.push("crowd interaction", "vocalist stage banter");
    }
    if (liveLower.includes("atmosfer") || liveLower.includes("atmosphere") || liveLower.includes("reverb")) {
      tags.push("live stadium reverb", "authentic concert ambiance");
    }
  }

  const rawTags = tags.filter(Boolean).join(", ");
  return clampToMaxChars(rawTags, 900);
}

/**
 * Helper to build Yolly AI Style of Music Tags & Prompt (Maksimal 900 Karakter)
 */
export function formatYollyAiStyleTags(song: SongData): string {
  const { stylePrompt } = song;
  const timeSig = stylePrompt.timeSignature || "4/4";
  const vocalDesc = getVocalDescriptor(stylePrompt.vocalStyle);

  const sections: string[] = [
    `[Genre & Rhythm]: ${stylePrompt.genre}, ${timeSig} time signature, ${stylePrompt.tempo}, Key ${stylePrompt.key}`,
    `[Vocal Tone]: ${vocalDesc}, Indonesian lyric phrasing`,
    `[Instrumentation]: ${stylePrompt.introOpening.replace(/🎵/g, "").trim()}, screaming distorted electric guitar solo with long sustain, acoustic guitar arpeggios, melodic bass, expressive dynamic drums`,
    `[Arrangement & Mood]: ${stylePrompt.mood}, ${stylePrompt.arrangement}`,
    `[Production & Mixing]: ${stylePrompt.mixing}, spacious plate reverb, clear vocal presence`,
  ];

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    sections.push(`[Live Concert FX]: ${stylePrompt.liveConcert}, audience applause, crowd cheering, live arena acoustics`);
  }

  const combined = sections.join(" | ");
  return clampToMaxChars(combined, 900);
}

/**
 * Helper to build SongGenerator.io Style of Music Tags & Prompt (Maksimal 900 Karakter)
 */
export function formatSongGeneratorIoStyleTags(song: SongData): string {
  const { stylePrompt } = song;
  const timeSig = stylePrompt.timeSignature || "4/4";
  const vocalDesc = getVocalDescriptor(stylePrompt.vocalStyle);
  const introClean = stylePrompt.introOpening.replace(/🎵/g, "").trim();

  let prompt = `${stylePrompt.genre} ballad in ${timeSig} time signature, ${stylePrompt.tempo}, key ${stylePrompt.key}. Mood is ${stylePrompt.mood.toLowerCase()} with heartfelt emotional storytelling. Features ${vocalDesc}. Instrumentation includes ${introClean}, crying melodic electric guitar solo with heavy sustain and bending, warm acoustic rhythm guitar, punchy melodic bassline, dynamic power ballad drums, and ambient string pads. Arrangement moves from intimate gentle verses with a 10-second melodic instrumental break into a soaring anthemic chorus climax. Sound engineering: ${stylePrompt.mixing.toLowerCase()}, vintage 90s analog console warmth, stereo plate reverb, pristine vocal clarity.`;

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    prompt += ` Live concert setting with ${stylePrompt.liveConcert.toLowerCase()}, audience applause, crowd singing along, and stadium atmosphere.`;
  }

  return clampToMaxChars(prompt, 900);
}

/**
 * Helper to build Universal Extended AI Music Tags (Maksimal 900 Karakter)
 */
export function formatUniversalMusicTags(song: SongData): string {
  const { stylePrompt } = song;
  const timeSig = stylePrompt.timeSignature || "4/4";
  const vocalDesc = getVocalDescriptor(stylePrompt.vocalStyle);

  const tags = [
    stylePrompt.genre.toLowerCase(),
    `${timeSig} meter`,
    stylePrompt.tempo.toLowerCase(),
    `key ${stylePrompt.key}`,
    vocalDesc,
    stylePrompt.mood.toLowerCase(),
    "screaming guitar solo",
    "acoustic fingerstyle",
    "analog synth pad",
    "rich bass",
    "live drum fills",
    "10s instrumental break before chorus",
    "anthemic chorus climax",
    "vintage 90s analog mixing",
    "spacious plate reverb",
    "emotional nostalgic vibe",
  ];

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    tags.push("live concert ambiance", "crowd cheering", "audience sing-along");
  }

  return clampToMaxChars(tags.join(", "), 900);
}
