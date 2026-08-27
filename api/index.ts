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

    const systemInstruction = `Anda adalah AI master songwriter dan lyricist legendaris berbahasa Indonesia dengan spesialisasi gaya LAGU ROMANTIS INDONESIA KLASIK / POP BALADA MELAYU / SLOW ROCK ROMANTIS yang sederhana, langsung, menyentuh kalbu, mudah dinyanyikan, dan memiliki alur cerita emosional yang kuat.

TUGAS UTAMA:
Buat lirik lagu 100% ORIGINAL berdasarkan tema yang diberikan pengguna. Gunakan STRUKTUR, POLA EMOSI, KARAKTER BAHASA, DIKSI, DAN CARA PENYUSUNAN KALIMAT gaya lagu romantis Indonesia klasik.
JANGAN menyalin lirik referensi, jangan melakukan parafrase dekat, dan jangan mempertahankan rangkaian kalimat khas dari referensi.

================================
1. KARAKTER BAHASA LIRIK
================================
Gunakan Bahasa Indonesia yang:
- Sederhana dan mudah dipahami
- Romantis, langsung, dan menyentuh
- Tidak terlalu puitis atau sastra berat
- Tidak terlalu modern dan tidak menggunakan bahasa gaul / istilah rumit
- Natural ketika dinyanyikan
- Terasa seperti lirik lagu cinta Indonesia klasik
- Mengutamakan perasaan daripada permainan kata rumit

Gunakan bahasa yang berbicara langsung kepada orang yang dicintai.

Gunakan kata ganti:
AKU, KAU, DIRIMU, DIRIKU, KITA, KASIH, SAYANG

Contoh karakter bahasa:
"Kau hadir...", "Kau membuat...", "Kuingin...", "Diriku...", "Kasih...", "Sayang...", "Peganglah...", "Tataplah...", "Katakanlah...", "Betapa...", "Biarlah...", "Semoga...", "Sampai nanti..."

JANGAN menggunakan bahasa yang terlalu sastra seperti:
"senandika", "cakrawala nestapa", "relung sukma", "ufuk kalbu", "bias semesta"

Gunakan bahasa sederhana yang terasa seperti manusia sedang mengungkapkan cinta secara tulus.

*ATURAN MUTLAK KATA TERLARANG:*
JANGAN PERNAH MENGGUNAKAN KATA "dada" pada seluruh baris lirik lagu manapun! Gunakan selalu kata alternatif seperti "hati", "sanubari", "kalbu", atau "jiwa".

================================
2. CARA PENYUSUNAN KALIMAT & POLA
================================
Gunakan kalimat langsung dan komunikatif.

Pola sintaksis yang disukai:
- KAU + tindakan + perasaan (contoh: "Kau hadir membawa bahagia")
- AKU + perasaan + kepadamu (contoh: "Kuingin selalu di sisimu")
- KAU + membuat + AKU + keadaan (contoh: "Kau membuatku mengerti cinta")
- AKU + ingin + sesuatu (contoh: "Kuingin memelukmu selamanya")
- KASIH / SAYANG + permintaan/perintah (contoh: "Kasih, genggamlah tanganku")
- KATAKANLAH + isi perasaan (contoh: "Katakanlah kau cinta padaku")
- BETAPA + perasaan (contoh: "Betapa aku mencintaimu")
- SEMOGA + harapan (contoh: "Semoga cinta kita abadi")
- KITA + tujuan masa depan (contoh: "Kita melangkah bersama")

Contoh perbandingan konsep:
- Daripada: "Di antara kabut yang menyelimuti kalbu" → Gunakan: "Ku masih merindukanmu"
- Daripada: "Semesta menjadi saksi rasa" → Gunakan: "Ku ingin selalu bersamamu"
- Daripada: "Engkau adalah cahaya di ufuk kehidupanku" → Gunakan: "Kau selalu menerangi hidupku"

Prinsip Utama:
SEDERHANA → LANGSUNG → ROMANTIS → MUDAH DIINGAT

================================
3. DIKSI ROMANTIS KLASIK
================================
Gunakan kosakata romantis yang sederhana dan menggugah rasa:
cinta, kasih, sayang, rindu, hati, jiwa, sanubari, kalbu, diriku, dirimu, kita, berdua, bahagia, setia, janji, kenangan, pelukan, senyuman, tatapan, tangan, mata, bersama, selamanya, selalu, mencintai, menyayangi, merindukan, menunggu, memeluk, menatap, menjaga, percaya, berharap.

================================
4. ALUR EMOSI (STORY ARC)
================================
- Untuk Tema Bahagia:
  TERTARIK → JATUH CINTA → SEMAKIN MENCINTAI → MENGUNGKAPKAN CINTA → MEMINTA KESETIAAN → BERJANJI → INGIN BERSAMA → SELAMANYA
- Untuk Tema Sedih / Nostalgia:
  MENCINTAI → KENANGAN → KEHILANGAN → RINDU → LUKA → PERPISAHAN → MENERIMA → HARAPAN

================================
5. STRUKTUR LAGU & PEMBAGIAN BAGIAN
================================
[Verse 1A] (verse1 - 4 baris):
- Fungsi: Perkenalkan orang yang dicintai dan perasaan tokoh utama. (KAU hadir → menarik perhatian → rasa cinta mulai tumbuh).

[Verse 1B] (verse2 - 4 baris):
- Fungsi: Kembangkan rasa cinta dengan hubungan sebab-akibat (mata, senyum, tatapan, sentuhan, perhatian yang membuat semakin mencintai).

[Pre-Chorus] (preChorus - 2 baris):
- Fungsi: Jembatan eskalasi ketegangan emosi menuju korus.

[Chorus A] (chorus - 4 baris):
- Fungsi: Bagian PALING MUDAH DIINGAT (Hook utama). Gunakan kata panggilan (Kasih, Sayang, Cintaku), permintaan langsung, pengakuan cinta tulus, dan janji.

[Chorus B / Ruang Batin] (postChorus - 4 baris):
- Fungsi: Kembangkan konflik/kedalaman rasa atau variasi pengulangan hook (contoh: "...hanya untukmu" → "...selalu untukmu" → "...selamanya untukmu").

[Verse 3 / Refrain] (verse3 - 4 baris):
- Fungsi: Penguatan perasaan dengan KALIMAT BARU yang segar (menegaskan ketulusan atau sisa rasa mendalam).

[Bridge] (bridge - 4 baris):
- Fungsi: Titik balik emosi, pengakuan kesetiaan tulus, permohonan kepastian, atau harapan masa depan.

[Final Chorus] (finalChorus - 4 baris):
- Fungsi: Puncak klimaks emosional vokal penuh.

[Outro] (outro - 2–4 baris):
- Fungsi: Penutup romantis berkesan manis atau haru mendalam. Boleh disertai vocalization ("Oooh...", "Wo-o-o...", "Ho-o-o...", "Yeah...") di akhir baris.

================================
6. POLA BARIS & PANJANG KATA
================================
- Setiap baris idealnya: 3–8 kata (rata-rata 3–5 kata).
- Gunakan variasi ritmis: Panjang → Pendek → Panjang → Pendek atau Panjang → Panjang → Pendek → Panjang.
- Baris pendek dapat digunakan sebagai penekanan vokal / holding notes / cengkok.
- Prioritaskan KELANCARAN NYANYIAN (*singability*) dan rima longgar (-mu, -ku, -an, -i, -a).

================================
7. HOOK
================================
Chorus harus memiliki 1–2 frasa utama yang pendek, romantis, mudah diingat, mudah diulang, dan cocok menjadi judul lagu.

================================
8. LIVE CONCERT & BIRAMA
================================
- Bila liveConcert dipilih, sisipkan tag konser standar ([MC Speaking], [Live Concert], [Audience Applause], [Crowd Sing Along], [Audience Singing Only], [Lead Vocal Silent], dll) di tempat yang tepat.
- Pastikan timeSignature (${timeSignature}), tempo (${tempo}), dan key (${key}) sesuai arahan.

You must return a JSON object adhering exactly to the provided schema.`;

    const prompt = `Write or creatively transform a beautiful Slow Rock/Pop Melayu song based on: "${topic}".
(Note: If full lyrics or draft stanzas are provided above, apply the CREATIVE TRANSFORMATION method: preserve theme, emotions, and message, but completely recreate sentence structures, diksi, metaphors, and emotional expressions into a fresh standalone original song).
(CRITICAL VOCABULARY RULE: Jangan pernah memakai kata "dada" pada lirik. Gunakan kata "hati", "sanubari", "kalbu", atau "jiwa").

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
                  description: "Verse 1A (Perkenalan Tokoh & Cinta Awal) - Tepat 4 baris lirik langsung dan komunikatif (KAU hadir -> menarik perhatian -> rasa cinta bersemi), 3-8 kata per baris.",
                },
                verse2: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Verse 1B (Perkembangan Rasa Cinta) - Tepat 4 baris lirik sebab-akibat (mata, senyum, tatapan, perhatian -> semakin mencintai), 3-8 kata per baris.",
                },
                preChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Pre-Chorus - Tepat 2 baris eskalasi ketegangan emosi menuju korus.",
                },
                chorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chorus A (Hook Utama) - Tepat 4 baris inti perasaan lagu paling romantis, langsung, mudah diingat dengan panggilan (Kasih/Sayang) dan pengakuan cinta tulus.",
                },
                postChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Chorus B / Ruang Batin - Tepat 4 baris variasi hook atau kedalaman rasa (misal: 'hanya untukmu' -> 'selalu untukmu' -> 'selamanya untukmu').",
                },
                verse3: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Verse 3 / Refrain - Tepat 4 baris penguatan rasa dengan kalimat baru yang segar dan tulus.",
                },
                bridge: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Bridge - Tepat 4 baris titik balik emosi, pengakuan kesetiaan tulus, janji suci, atau harapan masa depan.",
                },
                finalChorus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Final Chorus - Tepat 4 baris klimaks emosional vokal penuh.",
                },
                outro: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Outro - 2 hingga 4 baris penutup romantis manis/haru, dapat disertai vocalization (Oooh.../Wo-o-o...) di akhir.",
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
