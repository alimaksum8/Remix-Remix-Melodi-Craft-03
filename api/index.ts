import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini API client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or still has the placeholder value in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Route: Generate lyrics and music production style parameters
app.post("/api/generate", async (req, res) => {
  try {
    const {
      topic,
      genre = "Slow Rock Melayu 90's",
      mood = "Warm, Romantic, Emotional, Nostalgic",
      tempo = "72 BPM",
      timeSignature = "4/4",
      key = "Am",
      vocalStyle = "Warm Male Vocal, Emotional, Soft Vibrato",
      lyricLanguage = "Natural Indonesian, Conversational, Simple vocabulary",
      storyFlow = "Verse 1 (Introduce relation), Verse 2 (Misunderstanding/longing), Chorus (Emotional hook), Verse 3 (Acceptance), Bridge (Reflection), Outro (Fade)",
      introOpening = "🎵 Gitar Distorsi, 🎵 Solo Gitar Lead, 🎵 Solo Gitar Sustain, 🎵 Solo Gitar Bending, 🎵 Solo Gitar Vibrato, 🎵 Solo Nada Tinggi / Gitar Menjerit, 🎵 Tematik Main Theme Preview, 🎵 Tematik Chorus Preview",
      liveConcert = "",
    } = req.body;

    if (!topic || topic.trim() === "") {
      res.status(400).json({ error: "Topic is required" });
      return;
    }

    const ai = getAI();

    const systemInstruction = `You are a master songwriter, lyricist, and musicologist specializing in Classic Indonesian-Malay Pop, Pop Melayu Ballad, and Slow Rock Melayu 90's music.
Your objective is to generate completely ORIGINAL lyrics and a detailed musical style arrangement based on the user's requested topic and custom options.

IMPORTANT GENRE & STRUCTURE RULES:
1. Completely ORIGINAL: Do not copy any copyrighted melody, lyrics, or identifiable composition from real songs.
2. LANGUAGE: Natural Indonesian, simple conversational vocabulary, romantic, and highly emotional. Avoid overly complex metaphors unless creating fresh poetic imagery. It should sound like heartfelt, everyday conversation.
3. RHYME PATTERNS: Use flexible and beautiful Indonesian rhyme patterns (AABB, ABAB, ABCB, or AAAA) without repeating the exact same words.
4. SYLLABLES RULE (VERY IMPORTANT FOR VOCAL FLOW):
   - Verses (Verse 1, Verse 2, Verse 3): Exactly 4 lines each. Target 8-12 syllables per line.
   - Pre-Chorus: Exactly 2 lines. Target 8-12 syllables per line.
   - Chorus & Final Chorus: Exactly 6 lines each. Target 8-11 syllables per line. Must have a strong melodic hook.
   - Post-Chorus: Exactly 2 lines. Target 5-10 syllables per line.
   - Bridge: Exactly 4 lines. Target 7-11 syllables per line. Reflective tone.
   - Outro/Coda: Exactly 2-4 lines. Target 3-7 words per line.
5. TEMPO & KEY: Make sure the tempo (${tempo}) and key (${key}) align perfectly with the mood.
6. VOCAL GENDER SENSITIVITY (CRITICAL):
   - You MUST strictly respect the requested vocal style (${vocalStyle}).
   - If "Warm Female Vocal" is requested (or "Female" or "Wanita"), you MUST describe a FEMALE vocal in the response's "vocalStyle" (e.g., "Warm Female Vocal, sweet alto/soprano tone, soft vibrato"). Under no circumstances should you output a male vocal.
   - If "Duet" is requested, you MUST describe a duet arrangement (e.g., "Duet Vocal (Male & Female)").
   - If "Warm Male Vocal" is requested (or "Male" or "Pria"), describe a male vocal.
7. CREATIVE TRANSFORMATION FOR FULL LYRICS / EXISTING DRAFTS (SANGAT PENTING):
   If the user provides full lyrics, complete draft stanzas, or existing lyrics in the input:
   - You MUST apply a CREATIVE TRANSFORMATION (Transformasi Kreatif), NOT simple word substitution or swapping a few synonyms.
   - Retain the main theme & core emotions (e.g., fractured relationship, guilt, asking for forgiveness, fighting for love).
   - Retain the general message and story arc.
   - Completely rewrite sentence structures so they do not mirror or copy the source sentences.
   - Replace diksi and metaphors with fresh, original imagery (e.g. transform "bunga hati" into brand-new poetic metaphors).
   - Re-imagine the emotional expression patterns — invent fresh ways to express feelings rather than replacing individual words with synonyms.
   - Reorder or reorganize the sequence of ideas if needed to enhance the emotional arc.
   - Avoid word-for-word substitution (e.g., merely changing "cinta" to "kasih" while keeping the sentence structure is strictly forbidden).
   - Maintain general song structure (Verse -> Pre-Chorus -> Chorus -> Bridge -> Outro) with singable lines, natural vocal flow, and 8-12 syllables per line.
   - Result MUST be a completely new, standalone, original lyric that captures the theme & emotion of the source text.
8. LIVE CONCERT (ADVANCED REALISTIC) & FAN EFFECTS (VERY IMPORTANT):
   If any Live Concert options are requested, you MUST adhere to these precise guidelines to generate the appropriate tags inside the 'lyrics' or described in 'liveConcert':
    - "opening mc": Before the intro starts, the vocalist delivers a warm spoken storytelling monologue (bukan bernyanyi) for 8–20 seconds explaining the song's emotional meaning. Represent this with tags like [MC Speaking], [Live Concert], [Stage Banter], [Storytelling], and [Natural Speech]. Write 1–2 emotional sentences matching the song's theme (do not repeat song lyrics).
    - "tepuk tangan": Add live audience applause and cheering sounds. Use tags like [Audience Applause] and [Crowd Cheering] before the intro starts, after the MC finishes speaking, and at transitions or outro.
    - "penonton bernyanyi verse 1": In Verse 1, the vocalist sings only the first 1–2 lines as a guide, then the vocalist is COMPLETELY SILENT (Lead Vocal Silent) for the next 3–4 lines where only the audience sings. Represent this using tags like [Audience Singing Only], [Crowd Sing Along], and [Lead Vocal Silent] on those lines. Ensure NO lead vocals, harmonies, or ad-libs are present during this silence.
    - "penonton bernyanyi chorus": During the first Chorus, the vocalist sings the first line, cues the crowd, and then is SILENT (Lead Vocal Silent) for the next 3–4 lines where only the audience sings with grand arena reverb. Represent this using tags like [Crowd Chorus], [Audience Singing Only], and [Lead Vocal Silent], then the vocalist enters back with larger energy at the end.
    - "interaksi vokalis": In between sections or transition breaks, insert short spoken (not sung) vocalist shoutouts (e.g. "Nyanyi bareng, semuanya...", "Saya ingin dengar suara kalian...", "Yang paling belakang... lebih keras lagi!"). Represent this using tags like [Crowd Interaction] or [Audience Response].
    - "atmosfer konser": Infuse stadium ambiance such as a full crowd, arena reverb, whispering/whistling, yelling after emotional sections, and rhythmic handclaps following the beat. Use tags like [Concert Atmosphere] and [Arena Reverb].
    
    IMPORTANT COMPATIBILITY: The generated tags must use standard live performance tags easily recognized by Suno AI, Yooly, SongGenerator.io, and AIMusic.so, such as:
    - [Live Concert], [Audience], [Audience Applause], [Crowd Chant], [Crowd Singing], [MC Speaking], [Stage Banter], [Live Performance], [Arena Reverb], [Concert Atmosphere], [Storytelling], [Natural Speech], [Crowd Interaction], [Audience Response], [Epic Crowd], [Lead Vocal Silent], [Audience Singing Only], [Crowd Sing Along], [Crowd Cheering]
    
    Do NOT change the song structure, number of lyric lines, word count, tempo, key, genre, or chord progression. Only layer the live concert ambiance and place correct tags at appropriate positions. If no live concert options are selected, do not add any of these live effects.
9. TIME SIGNATURE & INSTRUMENTAL BREAK BEFORE CHORUS:
   - Ensure 'timeSignature' in stylePrompt strictly returns the requested Birama (${timeSignature}).
   - Note that a 10-second musical instrumental break is designed to transition into each Chorus section.

You must return a JSON object adhering exactly to the provided schema.`;

    const prompt = `Write or creatively transform a beautiful Slow Rock/Pop Melayu song based on: "${topic}".
(Note: If full lyrics or draft stanzas are provided above, apply the CREATIVE TRANSFORMATION method: preserve theme, emotions, and message, but completely recreate sentence structures, diksi, metaphors, and emotional expressions into a fresh standalone original song).

Use the following specifications:
- Genre: ${genre}
- Mood: ${mood}
- Tempo: ${tempo}
- Time Signature (Birama/Ketukan): ${timeSignature}
- Key: ${key}
- Intro Opening Instruments suggested: ${introOpening}
- Vocal Style: ${vocalStyle}
- Lyric Language: ${lyricLanguage}
- Story Flow structure: ${storyFlow}
${liveConcert ? `- Live Concert atmosphere elements: ${liveConcert}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songTitle: {
              type: Type.STRING,
              description: "A beautiful, memorable, poetic Indonesian song title.",
            },
            chordsSuggestion: {
              type: Type.STRING,
              description: "Suggestions for standard chord progressions for Verse, Chorus, and Bridge, e.g. 'Verse: Am - Dm - G - C | Chorus: Dm - G - C - F - Dm - E'.",
            },
            lyrics: {
              type: Type.OBJECT,
              properties: {
                intro: {
                  type: Type.STRING,
                  description: "8-bar instrument intro description matching 90s slow rock (e.g., clean guitar pickings, wide strings pad, etc.)",
                },
                verse1: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 lines of lyrics for Verse 1.",
                },
                verse2: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 lines of lyrics for Verse 2.",
                },
                preChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 2 lines of lyrics for Pre-Chorus.",
                },
                chorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 6 lines of lyrics for Chorus.",
                },
                postChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 2 lines of lyrics for Post-Chorus.",
                },
                verse3: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 lines of lyrics for Verse 3.",
                },
                bridge: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 lines of lyrics for Bridge.",
                },
                finalChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 6 lines of lyrics for the Final Chorus (can be identical or slightly modified version of Chorus).",
                },
                outro: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2 to 4 lines of lyrics for Outro/Coda.",
                },
              },
              required: [
                "intro",
                "verse1",
                "verse2",
                "preChorus",
                "chorus",
                "postChorus",
                "verse3",
                "bridge",
                "finalChorus",
                "outro",
              ],
            },
            stylePrompt: {
              type: Type.OBJECT,
              properties: {
                genre: { type: Type.STRING, description: "Style or genre tags, e.g. Slow Rock Melayu 90s, Pop Melayu Ballad" },
                mood: { type: Type.STRING, description: "List of mood adjectives" },
                tempo: { type: Type.STRING, description: "BPM value (e.g., 72 BPM)" },
                key: { type: Type.STRING, description: "Vocal key (e.g., Am, G, Em)" },
                timeSignature: { type: Type.STRING, description: "Time signature (birama / ketukan), e.g., '4/4', '3/4', '6/8'" },
                introOpening: { type: Type.STRING, description: "Detailed intro arrangement instructions (8 bars, instruments entering sequence)" },
                arrangement: { type: Type.STRING, description: "Arrangement escalation path from Verse (minimal) to Chorus (full/climax) and Outro" },
                vocalStyle: { type: Type.STRING, description: "Vocal instruction notes. MUST strictly match the requested gender (e.g. 'Warm Female Vocal, sweet alto/soprano tone, soft vibrato' if female was selected; 'Warm Male Vocal...' if male was selected; 'Duet Vocal (Male & Female)...' if duet was selected)." },
                lyricLanguage: { type: Type.STRING, description: "Language definition" },
                melodyCharacter: { type: Type.STRING, description: "A detailed breakdown of melodic register and register changes between Verse, Pre-Chorus, and Chorus" },
                dynamics: { type: Type.STRING, description: "Dynamics instructions (Soft in Verses, open and wide in Chorus, pulling back in Bridge)" },
                mixing: { type: Type.STRING, description: "Sound mixing guidelines (Lead vocal forward, wide stereo strings, natural piano, round warm bass, plate reverb)" },
                liveConcert: { type: Type.STRING, description: "Detailed description of how selected live concert atmosphere elements are integrated (e.g., crowd cheering, greetings, chantings, fan sing-alongs), or 'Tidak ada (Aransemen Studio Standar)' if none were requested." },
              },
              required: [
                "genre",
                "mood",
                "tempo",
                "key",
                "timeSignature",
                "introOpening",
                "arrangement",
                "vocalStyle",
                "lyricLanguage",
                "melodyCharacter",
                "dynamics",
                "mixing",
                "liveConcert",
              ],
            },
          },
          required: ["songTitle", "chordsSuggestion", "lyrics", "stylePrompt"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const parsedData = JSON.parse(text);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating lyrics & style:", error);
    res.status(500).json({ error: error.message || "Gagal membuat lirik lagu." });
  }
});

// API Route: Generate Album cover art
app.post("/api/generate-cover", async (req, res) => {
  try {
    const { title, genre, mood } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title is required for generating cover art." });
      return;
    }

    const ai = getAI();

    // Use gemini-3.1-flash-lite-image to generate a high quality image
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `A professional square album cover art for an Indonesian slow rock/pop song titled "${title}". 
Genre: ${genre || "Slow Rock Melayu 90's"}. 
Vibe/Mood: ${mood || "Emotional, Warm, Nostalgic"}. 
Aesthetic: Vintage 90s Indonesian/Malaysian music cassette album vibe. A melancholic, beautifully lit background (maybe a quiet shoreline, cassette filter, subtle retro glow, or a clean minimalist look). No human faces if possible to keep it poetic, or just a silhouette. Include the title "${title}" in elegant, professional vintage typography integrated nicely into the cover. High resolution, high contrast, clean graphic design. Strictly no watermarks, no generic stock photo frames, no fake CD logos.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let base64Image = "";
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("Gemini did not return image data.");
    }

    res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    console.error("Error generating cover art:", error);
    // Return a flag so the UI can construct an elegant dynamic SVG cover instead of crashing
    res.json({
      imageUrl: null,
      isFallback: true,
      reason: error.message || "Gagal memproses gambar.",
    });
  }
});

export default app;
