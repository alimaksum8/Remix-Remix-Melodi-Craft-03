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
 * Helper to build optimized Suno / Udio Style Tags (max 120 chars recommended)
 */
export function formatSunoStyleTags(song: SongData): string {
  const { stylePrompt } = song;
  
  // Determine if female, duet, or male vocal is more appropriate
  let vocalTag = "male vocal";
  const vocalLower = (stylePrompt.vocalStyle || "").toLowerCase();
  if (vocalLower.includes("female") || vocalLower.includes("wanita") || vocalLower.includes("perempuan") || vocalLower.includes("cewek")) {
    vocalTag = "female vocal";
  } else if (vocalLower.includes("duet")) {
    vocalTag = "duet vocal, male female";
  } else if (vocalLower.includes("male") || vocalLower.includes("pria") || vocalLower.includes("cowok") || vocalLower.includes("laki-laki")) {
    vocalTag = "male vocal";
  }

  // Format Time Signature / Birama tag
  const biramaTag = stylePrompt.timeSignature ? `${stylePrompt.timeSignature} time signature` : "4/4 time signature";

  // Pick primary genres, birama/time signature, and instrumental style
  const tags = [
    stylePrompt.genre.split(",")[0].toLowerCase(),
    biramaTag,
    stylePrompt.tempo.toLowerCase(),
    vocalTag,
    "emotional",
    "electric guitar fingerstyle",
    "strings pad",
    "plate reverb",
  ];

  if (stylePrompt.liveConcert && !stylePrompt.liveConcert.toLowerCase().includes("tidak ada")) {
    tags.push("live concert");
    const liveLower = stylePrompt.liveConcert.toLowerCase();
    
    // Check for Opening MC
    if (
      liveLower.includes("opening mc") || 
      liveLower.includes("menyapa") || 
      liveLower.includes("mc") || 
      liveLower.includes("speaking") || 
      liveLower.includes("banter") || 
      liveLower.includes("greet") ||
      liveLower.includes("sapaan")
    ) {
      tags.push("mc speaking", "storytelling", "natural speech");
    }
    
    // Check for Tepuk Tangan
    if (
      liveLower.includes("tepuk tangan") || 
      liveLower.includes("applause") || 
      liveLower.includes("cheer") || 
      liveLower.includes("sorakan")
    ) {
      tags.push("audience applause", "crowd cheering");
    }
    
    // Check for Penonton Bernyanyi — Verse 1
    if (
      liveLower.includes("penonton bernyanyi verse 1") || 
      liveLower.includes("verse 1") || 
      liveLower.includes("sing along")
    ) {
      tags.push("audience singing only", "crowd sing along", "lead vocal silent");
    }
    
    // Check for Penonton Bernyanyi — Chorus
    if (
      liveLower.includes("penonton bernyanyi chorus") || 
      liveLower.includes("chorus") || 
      liveLower.includes("epic chorus")
    ) {
      tags.push("crowd chorus", "audience singing only", "lead vocal silent");
    }

    // Check for Interaksi Vokalis
    if (
      liveLower.includes("interaksi") || 
      liveLower.includes("interaction") || 
      liveLower.includes("vokalis")
    ) {
      tags.push("crowd interaction", "audience response");
    }

    // Check for Atmosfer Konser
    if (
      liveLower.includes("atmosfer") || 
      liveLower.includes("atmosphere") || 
      liveLower.includes("reverb")
    ) {
      tags.push("concert atmosphere", "arena reverb");
    }
  }

  return tags.join(", ").substring(0, 120);
}
